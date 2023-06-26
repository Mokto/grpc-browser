mod grpc_client;
mod websocket_handler;

use std::error::Error;

use salvo::prelude::*;
use salvo::{Router, Server};

use crate::websocket_handler::WebsocketHandler;

#[tokio::main]
pub async fn main() -> Result<(), Box<dyn Error>> {
    let grpc_client = grpc_client::GrpcClient::new();

    // grpc_client
    //     .unary(
    //         "127.0.0.1:6001".to_string(),
    //         false,
    //         "search_engine.SearchEngine/GetCompany".to_string(),
    //         "\n\x07bbc.com".to_string(),
    //     )
    //     .await?;

    // grpc_client
    //     .unary(
    //         "127.0.0.1:6001".to_string(),
    //         false,
    //         "search_engine.SearchEngine/GetCompany".to_string(),
    //         "\n\x07bbc.com".to_string(),
    //     )
    //     .await?;

    let router: Router = Router::new().push(Router::with_path("ws").handle(WebsocketHandler {
        grpc_client: grpc_client,
    }));

    let acceptor = TcpListener::new("127.0.0.1:5800").bind().await;
    Server::new(acceptor).serve(router).await;
    Ok(())
}
