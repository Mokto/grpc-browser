use salvo::ws::WebSocketUpgrade;
use salvo::{prelude::*, ws::WebSocket};
use serde::{Deserialize, Serialize};

use crate::grpc_client::{self, GrpcClient};

#[derive(Clone, Debug, Deserialize, Serialize)]
struct WebsocketEvent {
    call_type: String,
    host: String,
    ssl: bool,
    method: String,
    data: String,
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
        grpc_client
            .unary(
                "127.0.0.1:6001".to_string(),
                false,
                "search_engine.SearchEngine/GetCompany".to_string(),
                "\n\x07bbc.com".to_string(),
            )
            .await
            .unwrap();
        // WebSocketUpgrade::new()
        //     .upgrade(req, res, |mut ws: WebSocket| async move {
        //         // self.grpc_client
        //         //     .unary(
        //         //         "127.0.0.1:6001".to_string(),
        //         //         false,
        //         //         "search_engine.SearchEngine/GetCompany".to_string(),
        //         //         "\n\x07bbc.com".as_bytes(),
        //         //     )
        //         //     .await
        //         //     .unwrap();
        //         // while let Some(msg) = ws.recv().await {
        //         //     let msg = if let Ok(msg) = msg {
        //         //         if msg.is_close() {
        //         //             return;
        //         //         }
        //         //         if msg.is_text() {
        //         //             let data = msg.to_str().unwrap();
        //         //             let websocket_event: WebsocketEvent = serde_json::from_str(data)
        //         //                 .unwrap_or(WebsocketEvent {
        //         //                     call_type: "".to_string(),
        //         //                     host: "".to_string(),
        //         //                     ssl: false,
        //         //                     method: "".to_string(),
        //         //                     data: "".to_string(),
        //         //                 });
        //         //             if websocket_event.call_type == "unary" {
        //         //                 // grpc_client
        //         //                 //     .unary(
        //         //                 //         websocket_event.host,
        //         //                 //         websocket_event.ssl,
        //         //                 //         websocket_event.method,
        //         //                 //         websocket_event.data.as_bytes(),
        //         //                 //     )
        //         //                 //     .await
        //         //                 //     .unwrap();
        //         //             }
        //         //         }
        //         //         // let websocket_event: WebsocketEvent = serde_json::from_str(msg)?;
        //         //         // grpc_client::run_test_unary(
        //         //         //     "127.0.0.1:6001".to_string(),
        //         //         //     false,
        //         //         //     "search_engine.SearchEngine/GetCompany".to_string(),
        //         //         //     "\n\x07home.dk".as_bytes(),
        //         //         // )
        //         //         // .await
        //         //         // .unwrap();

        //         //         println!("recv: {:?}", msg);
        //         //         msg
        //         //     } else {
        //         //         // client disconnected
        //         //         return;
        //         //     };

        //         //     if ws.send(msg).await.is_err() {
        //         //         // client disconnected
        //         //         return;
        //         //     }
        //         // }
        //     })
        //     .await
        //     .unwrap();
    }
}
