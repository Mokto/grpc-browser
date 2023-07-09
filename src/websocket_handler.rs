use std::vec;

use salvo::ws::WebSocketUpgrade;
use salvo::{prelude::*, ws::Message, ws::WebSocket};
use serde::{Deserialize, Serialize};

use crate::grpc_client::GrpcClient;

#[derive(Clone, Debug, Deserialize, Serialize)]
struct WebsocketEvent {
    call_type: String,
    host: String,
    ssl: bool,
    method: String,
    data: Vec<u8>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct WebsocketResponse {
    bytes: Vec<u8>,
}

pub struct WebsocketHandler {
    pub grpc_client: GrpcClient,
}

#[async_trait]
impl Handler for WebsocketHandler {
    async fn handle(
        &self,
        req: &mut Request,
        _depot: &mut Depot,
        res: &mut Response,
        _ctrl: &mut FlowCtrl,
    ) {
        let mut grpc_client = self.grpc_client.clone();
        WebSocketUpgrade::new()
            .upgrade(req, res, |mut ws: WebSocket| async move {
                while let Some(msg) = ws.recv().await {
                    if let Ok(msg) = msg {
                        if msg.is_close() {
                            return;
                        }
                        if msg.is_text() {
                            println!("txt");
                            let data = msg.to_str().unwrap();
                            let websocket_event: WebsocketEvent = serde_json::from_str(data)
                                .unwrap_or(WebsocketEvent {
                                    call_type: "failure".to_string(),
                                    host: "".to_string(),
                                    ssl: false,
                                    method: "".to_string(),
                                    data: vec![],
                                });
                            if websocket_event.call_type == "unary" {
                                let result = grpc_client
                                    .unary(
                                        websocket_event.host,
                                        websocket_event.ssl,
                                        websocket_event.method,
                                        websocket_event.data,
                                    )
                                    .await
                                    .unwrap();

                                if ws.send(Message::binary(result)).await.is_err() {
                                    println!("Disconnected.");
                                }
                            }
                        }
                    } else {
                        println!("Closed.");
                        // client disconnected
                        return;
                    };
                }
            })
            .await
            .unwrap();
    }
}
