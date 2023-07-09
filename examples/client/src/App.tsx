import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { HelloRequest } from './gen/helloworld_pb';
import { GrpcBrowser, GrpcServiceConnect } from './lib'
import { Greeter } from './gen/helloworld_connect'



function App() {
  const service = useRef<GrpcServiceConnect<typeof Greeter>>();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    (async () => {
      const grpcBrowser = new GrpcBrowser(`ws://127.0.0.1:5800/ws`)
      service.current = new GrpcServiceConnect(grpcBrowser, Greeter, "127.0.0.1:50051", false);
      const result = await service.current.methods.sayHello(new HelloRequest({name: 'Theo'}))
      setMessage(result?.message || "")
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {message}
        </p>
        <button onClick={async () => {
          setMessage("")
          const result = await service.current?.methods.sayHello(new HelloRequest({name: 'John'}))
          setMessage(result?.message || "")
        }}>Say hello to John</button>
      </header>
    </div>
  );
}

export default App;
