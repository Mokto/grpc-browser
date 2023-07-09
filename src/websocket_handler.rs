use std::collections::HashMap;

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
    // data: Vec<u8>,
    operationId: u64,
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
                let mut queries: HashMap<u64, WebsocketEvent> = HashMap::new();
                while let Some(msg) = ws.recv().await {
                    if let Ok(msg) = msg {
                        if msg.is_close() {
                            return;
                        }
                        if msg.is_text() {
                            println!("txt");
                            let data = msg.to_str().unwrap();
                            let websocket_event: WebsocketEvent =
                                serde_json::from_str(data).unwrap();
                            // .unwrap_or(WebsocketEvent {
                            //     call_type: "failure".to_string(),
                            //     host: "".to_string(),
                            //     ssl: false,
                            //     method: "".to_string(),
                            //     operationId: 0,
                            //     // data: vec![],
                            // });
                            queries.insert(websocket_event.operationId, websocket_event);
                        }
                        if msg.is_binary() {
                            let websocket_event = queries
                                // .get_mut(&msg.to_binary().unwrap()[0] as u64)
                                // .get_mut(&0)
                                .get(&0)
                                .unwrap();
                            let host = websocket_event.host.clone();
                            let method = websocket_event.method.clone();
                            if websocket_event.call_type == "unary" {
                                let result = grpc_client
                                    .unary(host, websocket_event.ssl, method, msg.as_bytes().into())
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
