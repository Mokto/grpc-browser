use h2::client;
use http::{Method, Request};
use std::collections::HashMap;
use std::convert::TryFrom;
use std::error::Error;
use tokio::sync::{mpsc, oneshot};

use tokio::net::TcpStream;

pub struct GrpcClient {
    tx: mpsc::Sender<Command>,
}

impl Clone for GrpcClient {
    fn clone(&self) -> Self {
        GrpcClient {
            tx: self.tx.clone(),
        }
    }
}

#[derive(Debug)]
pub struct Command {
    host: String,
    ssl: bool,
    endpoint: String,
    message: Vec<u8>,
    additional_headers: HashMap<String, String>,
    kind: CommandKind,
}

#[derive(Debug)]
enum CommandKind {
    Unary {
        response_sender: oneshot::Sender<Vec<u8>>,
    },
}

impl GrpcClient {
    pub fn new() -> GrpcClient {
        let (tx, mut rx) = mpsc::channel::<Command>(32);

        let mut connections: HashMap<String, client::SendRequest<bytes::Bytes>> = HashMap::new();

        tokio::spawn(async move {
            while let Some(cmd) = rx.recv().await {
                use CommandKind::*;

                let key = GrpcClient::get_hashmap_key(cmd.host.clone());
                let mut force_reconnect: bool = false;
                if connections.contains_key(key.as_str()) {
                    if connections
                        .get(GrpcClient::get_hashmap_key(cmd.host.clone()).as_str())
                        .unwrap()
                        .clone()
                        .ready()
                        .await
                        .is_err()
                    {
                        force_reconnect = true;
                    }
                }
                if force_reconnect || !connections.contains_key(key.as_str()) {
                    let tcp = TcpStream::connect(cmd.host.as_str()).await.unwrap();
                    let (client, http2_connection) = client::handshake(tcp).await.unwrap();

                    tokio::spawn({
                        async move {
                            if let Err(e) = http2_connection.await {
                                println!("GOT ERR={:?}", e);
                            }
                        }
                    });
                    connections.insert(key, client);
                }

                let mut client = connections
                    .get(GrpcClient::get_hashmap_key(cmd.host.clone()).as_str())
                    .unwrap()
                    .clone();

                tokio::spawn(async move {
                    match cmd.kind {
                        Unary { response_sender } => {
                            let scheme: &str = if cmd.ssl { "https" } else { "http" };

                            println!("{}://{}/{}", scheme, cmd.host, cmd.endpoint);

                            let mut request_builder = Request::builder()
                                .method(Method::POST)
                                .uri(format!("{}://{}/{}", scheme, cmd.host, cmd.endpoint))
                                .header("TE", "trailers")
                                .header("grpc-timeout", "30S")
                                .header("content-type", "application/grpc")
                                .header("grpc-proxied-from", "grpc-browser");

                            for (header_key, header_value) in cmd.additional_headers.into_iter() {
                                request_builder = request_builder
                                    .header(header_key.as_str(), header_value.as_str());
                            }

                            let request = request_builder.body(()).unwrap();

                            let (response, mut stream) =
                                client.send_request(request, false).unwrap();

                            stream
                                .send_data(GrpcClient::get_data(&cmd.message).into(), true)
                                .unwrap();

                            let response = response.await.unwrap();
                            if response.status() != 200 {
                                println!("GOT RESPONSE: {:?}", response.status());
                                panic!("unexpected status: {}", response.status());
                            }

                            let mut body = response.into_body();

                            let mut result: Vec<u8> = vec![];
                            while let Some(chunk) = body.data().await {
                                result.extend(chunk.unwrap().to_vec());
                            }
                            // println!("GOT RESULT: {:?}", result);
                            if result.len() == 0 {
                                return;
                            }
                            result.drain(0..5); // remove the first 5 bytes (compression flag + length)

                            response_sender.send(result).unwrap();

                            // if let Some(trailers) = body.trailers().await.unwrap() {
                            //     println!("GOT TRAILERS: {:?}", trailers);
                            // }
                        }
                    }
                });
            }
        });

        GrpcClient { tx: tx }
    }

    pub async fn unary(
        &mut self,
        host: String,
        ssl: bool,
        endpoint: String,
        message: Vec<u8>,
        additional_headers: HashMap<String, String>,
    ) -> Result<Vec<u8>, Box<dyn Error>> {
        let (resp_tx, resp_rx) = oneshot::channel();

        self.tx
            .send(Command {
                host: host,
                ssl: ssl,
                endpoint: endpoint,
                message: message,
                additional_headers: additional_headers,
                kind: CommandKind::Unary {
                    response_sender: resp_tx,
                },
            })
            .await
            .unwrap();

        let res = resp_rx.await.unwrap();

        Ok(res)
    }

    fn get_data(data_to_send: &[u8]) -> Vec<u8> {
        let mut result: Vec<u8> = vec![0];
        result.extend(
            u32::try_from(data_to_send.len())
                .unwrap()
                .to_be_bytes()
                .to_vec(),
        );
        result.extend(data_to_send.to_vec());

        result
    }

    fn get_hashmap_key(host: String) -> String {
        format!("{}", host)
    }
}
