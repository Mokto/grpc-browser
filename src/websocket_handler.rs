use salvo::prelude::*;
use salvo::ws::WebSocketUpgrade;
use serde::{Deserialize, Serialize};

use crate::grpc_client::GrpcClient;
use std::{collections::HashMap, sync::RwLock};

#[derive(Clone, Debug, Deserialize, Serialize)]
struct WebsocketEvent {
    call_type: String,
    host: String,
    ssl: bool,
    method: String,
    data: String,
}

pub struct WebsocketHandler {
    pub client: GrpcClient,
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
        WebSocketUpgrade::new()
            .upgrade(req, res, |mut ws| async move {
                while let Some(msg) = ws.recv().await {
                    let msg = if let Ok(msg) = msg {
                        if msg.is_close() {
                            return;
                        }
                        if msg.is_text() {
                            let data = msg.to_str().unwrap();
                            let websocket_event: WebsocketEvent = serde_json::from_str(data)
                                .unwrap_or(WebsocketEvent {
                                    call_type: "".to_string(),
                                    host: "".to_string(),
                                    ssl: false,
                                    method: "".to_string(),
                                    data: "".to_string(),
                                });
                            if websocket_event.call_type == "unary" {
                                // self.client
                                //     .unary(
                                //         websocket_event.host,
                                //         websocket_event.ssl,
                                //         websocket_event.method,
                                //         websocket_event.data.as_bytes(),
                                //     )
                                //     .await
                                //     .unwrap();
                            }
                        }
                        // let websocket_event: WebsocketEvent = serde_json::from_str(msg)?;
                        // grpc_client::run_test_unary(
                        //     "127.0.0.1:6001".to_string(),
                        //     false,
                        //     "search_engine.SearchEngine/GetCompany".to_string(),
                        //     "\n\x07home.dk".as_bytes(),
                        // )
                        // .await
                        // .unwrap();

                        println!("recv: {:?}", msg);
                        msg
                    } else {
                        // client disconnected
                        return;
                    };

                    if ws.send(msg).await.is_err() {
                        // client disconnected
                        return;
                    }
                }
            })
            .await
            .unwrap();
    }
}
