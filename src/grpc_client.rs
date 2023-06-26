use h2::client;
use http::{Method, Request};
use std::collections::HashMap;
use std::convert::TryFrom;
use std::error::Error;
use tokio::sync::mpsc;

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
    message: String,
    kind: CommandKind,
}

#[derive(Debug)]
enum CommandKind {
    Unary,
}

impl GrpcClient {
    pub fn new() -> GrpcClient {
        let (tx, mut rx) = mpsc::channel::<Command>(32);

        let mut connections = HashMap::new();

        tokio::spawn(async move {
            while let Some(cmd) = rx.recv().await {
                use CommandKind::*;

                let key = GrpcClient::get_hashmap_key(cmd.host.clone());
                if !connections.contains_key(key.as_str()) {
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
                        Unary => {
                            let scheme: &str = if cmd.ssl { "https" } else { "http" };

                            let request = Request::builder()
                                .method(Method::POST)
                                .uri(format!("{}://{}/{}", scheme, cmd.host, cmd.endpoint))
                                .header("TE", "trailers")
                                .header("grpc-timeout", "30S")
                                .header("content-type", "application/grpc")
                                .body(())
                                .unwrap();

                            let (response, mut stream) =
                                client.send_request(request, false).unwrap();

                            stream
                                .send_data(
                                    GrpcClient::get_data(cmd.message.as_bytes()).into(),
                                    true,
                                )
                                .unwrap();

                            let response = response.await.unwrap();
                            if response.status() != 200 {
                                println!("GOT RESPONSE: {:?}", response.status());
                                panic!("unexpected status: {}", response.status());
                            }

                            // Get the body
                            let mut body = response.into_body();

                            // while let Some(chunk) = body.data().await {
                            //     println!("GOT CHUNK = {:?}", chunk?);
                            // }

                            // if let Some(trailers) = body.trailers().await? {
                            //     println!("GOT TRAILERS: {:?}", trailers);
                            // }
                            println!("got response");
                            println!("-----------------");
                            println!("-----------------");
                            println!("-----------------");
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
        message: String,
    ) -> Result<(), Box<dyn Error>> {
        self.tx
            .send(Command {
                host: host,
                ssl: ssl,
                endpoint: endpoint,
                message: message,
                kind: CommandKind::Unary,
            })
            .await
            .unwrap();

        Ok(())
    }

    fn get_data(data_to_send: &[u8]) -> Vec<u8> {
        let mut result: Vec<u8> = vec![1];
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
