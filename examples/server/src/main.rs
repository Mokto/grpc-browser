use tokio;
use tokio::sync::mpsc;
use tokio_stream::wrappers::ReceiverStream;
use tonic::{transport::Server, Request, Response, Status};

pub mod helloworld {
    tonic::include_proto!("helloworld");
}
use helloworld::greeter_server::{Greeter, GreeterServer};
use helloworld::{HelloReply, HelloRequest, SayHelloMultipleRequest, SayHelloMultipleResponse};

#[derive(Default)]
pub struct MyGreeter {}

#[tonic::async_trait]
impl Greeter for MyGreeter {
    async fn say_hello(
        &self,
        request: Request<HelloRequest>,
    ) -> Result<Response<HelloReply>, Status> {
        println!("Got a request from {:?}", request.remote_addr());
        println!("Metadata {:?}", request.metadata());

        let reply = helloworld::HelloReply {
            message: format!("Hello {}!", request.into_inner().name),
        };
        Ok(Response::new(reply))
    }

    type SayHelloMultipleStream = ReceiverStream<Result<SayHelloMultipleResponse, Status>>;
    async fn say_hello_multiple(
        &self,
        request: Request<SayHelloMultipleRequest>,
    ) -> Result<Response<Self::SayHelloMultipleStream>, Status> {
        println!("Got a request from {:?}", request.remote_addr());
        println!("Metadata {:?}", request.metadata());

        let (tx, rx) = mpsc::channel(4);
        let names = request.into_inner().names;

        tokio::spawn(async move {
            for name in &names[..] {
                tx.send(Ok(helloworld::SayHelloMultipleResponse {
                    message: format!("Hello {}!", name.clone()),
                }))
                .await
                .unwrap();
            }
        });

        Ok(Response::new(ReceiverStream::new(rx)))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "127.0.0.1:50051".parse().unwrap();
    let greeter = MyGreeter::default();

    println!("GreeterServer listening on {}", addr);

    Server::builder()
        .add_service(GreeterServer::new(greeter))
        .serve(addr)
        .await?;

    Ok(())
}
