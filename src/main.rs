mod grpc_client;
mod websocket_handler;

use salvo::prelude::*;
use std::{collections::HashMap, error::Error, sync::RwLock};

use crate::websocket_handler::WebsocketHandler;

#[tokio::main]
pub async fn main() -> Result<(), Box<dyn Error>> {
    let mut client = grpc_client::GrpcClient::new();

    // let router: Router =
    //     Router::new().push(Router::with_path("ws").handle(WebsocketHandler { client: client }));

    // let acceptor = TcpListener::new("127.0.0.1:5800").bind().await;
    // Server::new(acceptor).serve(router).await;
    client
        .unary(
            "127.0.0.1:6001".to_string(),
            false,
            "search_engine.SearchEngine/GetCompany".to_string(),
            "\n\x07bbc.com".as_bytes(),
        )
        .await?;

    Ok(())
}
