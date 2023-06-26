use h2::client;
use http::{Method, Request};
use std::collections::HashMap;
use std::convert::TryFrom;
use std::error::Error;
use std::fmt::format;
use std::sync::Arc;
use tokio::sync::Mutex;

use tokio::net::TcpStream;

pub struct GrpcClient {
    connections: Arc<Mutex<HashMap<String, client::Connection<TcpStream>>>>,
}

impl GrpcClient {
    pub fn new() -> GrpcClient {
        GrpcClient {
            connections: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub async fn unary(
        &mut self,
        host: String,
        ssl: bool,
        endpoint: String,
        message: &[u8],
    ) -> Result<(), Box<dyn Error>> {
        let mut connections = self.connections.lock().await;
        let connection_key = format!("{}{}", host, ssl);

        let tcp = TcpStream::connect(host.as_str()).await?;
        let (mut client, http2_connection) = client::handshake(tcp).await?;

        connections.insert(connection_key, http2_connection);
        drop(connections);

        println!("sending request");
        let scheme: &str = if ssl { "https" } else { "http" };

        let request = Request::builder()
            .method(Method::POST)
            .uri(format!("{}://{}/{}", scheme, host, endpoint))
            .header("TE", "trailers")
            .header("grpc-timeout", "30S")
            .header("content-type", "application/grpc")
            .body(())
            .unwrap();

        let (response, mut stream) = client.send_request(request, false).unwrap();

        stream
            .send_data(self.get_data(message).into(), true)
            .unwrap();

        // Spawn a task to run the conn...
        tokio::spawn({
            async move {
                let mut connections = self.connections.lock().await;
                // if let Err(e) = http2_connection.await {
                //     println!("GOT ERR={:?}", e);
                // }
            }
        });

        let response = response.await?;
        if response.status() != 200 {
            println!("GOT RESPONSE: {:?}", response.status());
            panic!("unexpected status: {}", response.status());
        }

        // Get the body
        let mut body = response.into_body();

        while let Some(chunk) = body.data().await {
            println!("GOT CHUNK = {:?}", chunk?);
        }

        if let Some(trailers) = body.trailers().await? {
            println!("GOT TRAILERS: {:?}", trailers);
        }

        Ok(())
    }

    fn get_data(&mut self, data_to_send: &[u8]) -> Vec<u8> {
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
}
