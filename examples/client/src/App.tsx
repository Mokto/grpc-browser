import React, { useEffect, useRef, useState } from "react";
import { HelloRequest, SayHelloMultipleRequest } from "./gen/helloworld_pb";
import { GrpcBrowser, GrpcServiceConnect } from "./lib";
import { Greeter } from "./gen/helloworld_connect";

function App() {
  const service = useRef<GrpcServiceConnect<typeof Greeter>>();
  const [messageUnary, setMessageUnary] = useState<string>("");

  useEffect(() => {
    (async () => {
      const grpcBrowser = new GrpcBrowser(`ws://127.0.0.1:5800/ws`);
      service.current = new GrpcServiceConnect(
        grpcBrowser,
        Greeter,
        "127.0.0.1:50051",
        false
      );
      const result = await service.current.methods.sayHello(
        new HelloRequest({ name: "Theo" }),
        { headers: { accessToken: "My access token" } }
      );
      setMessageUnary(result?.message || "");
    })();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ height: 150 }}>
        <h1>Unary</h1>
        <p>{messageUnary}</p>
        <button
          onClick={async () => {
            setMessageUnary("");
            const result = await service.current?.methods.sayHello(
              new HelloRequest({ name: "John" })
            );
            setMessageUnary(result?.message || "");
          }}
        >
          Say hello to John
        </button>
      </div>
      <hr />

      <div style={{ height: 150 }}>
        <h1>Server side streaming</h1>
        <button onClick={async() => {
          const result = await service.current?.methods.sayHelloMultiple(
            new SayHelloMultipleRequest({names: ["John", "Theo"]}),
            (response) => {
              console.log(response)
            }
          );
          console.log(result);
        }}>Run</button>
      </div>
    </div>
  );
}

export default App;
