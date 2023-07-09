import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { HelloRequest, HelloReply } from './gen/helloworld_pb';
import { GrpcBrowser, GrpcServiceConnect } from './lib'
import { Greeter } from './gen/helloworld_connect'


window.Buffer = window.Buffer || require("buffer").Buffer;



function App() {
  useEffect(() => {

    (async () => {
      const grpcBrowser = new GrpcBrowser(`ws://127.0.0.1:5800/ws`)
      const service = new GrpcServiceConnect<typeof Greeter>(grpcBrowser, Greeter, "127.0.0.1:50051", false);
      const request = new HelloRequest({name: 'ad'});
      const response = await service.methods.sayHello(request)
      console.log(response)
    })();

    // const ws = new WebSocket(`ws://127.0.0.1:5800/ws`);

    // ws.onopen = function() {
    //     ws.send(JSON.stringify({
    //         call_type: 'unary',
    //         host: "127.0.0.1:50051",
    //         ssl: false,
    //         method: "helloworld.Greeter/SayHello",
    //         data: Array.from(new HelloRequest({name: "John Doe"}).toBinary()),
    //     }));


    //     ws.onmessage = function(evt) {
    //         const received_msg = evt.data;
    //         const message = JSON.parse(received_msg);

    //         console.log(HelloReply.fromBinary(Buffer.from(message.bytes)))
    //     };
    // };

  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
