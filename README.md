# GRPC Browser

## Idea

- The proxy is a websocket server that allow the browser to support GRPC!
- It's written in Rust: fast & memory safe
- It doesn't use a temporary JSON representation of the data but directly sends the protobuf binary bytes on the wire for maximal performances!
- Right now it only supports unary calls but because it's websocket based it should be able to support streaming in the near future.

## Example

First you need to generate the typescript files with [buf web connect library](https://github.com/bufbuild/protobuf-es). protobufjs/minimal support is on the way

```typescript
const grpcBrowser = new GrpcBrowser(`ws://127.0.0.1:5800/ws`) // connects to the GRPC browser proxy
const service = new GrpcServiceConnect(grpcBrowser, Greeter, "127.0.0.1:50051", false); // creates a internal grpc service proxy - note that 127.0.0.1:50051 is the internal grpc server address accessible from the proxy. Greeter is the service file generated from the bug web connect library
const result = await service.methods.sayHello(new HelloRequest({name: 'John'}), {headers: {"accessToken": "My access token"}}) // then you can easily call any unary method from your service.
```

## Notes

- If you need to know the call comes from the frontend, the proxy adds the grpc-proxied-from=grpc-browser header to the metadata.

## TODO

Needs to be done

- [X] GRPC channel reconnection
- [X] Send result back to Websocket
- [X] Support different operations at the same time
- [X] Add default metadata (grpc-proxied-from = grpc-browser)
- [X] Support passing additional metadata


Nice to have:

- [ ] Streaming support
- [ ] Support protobufjs/minimal. Right now it only supports @bufbuild/protobuf
- [ ] Support GRPC authentication
- [ ] Automatically detect compression vs no compression
- [ ] Make sure SSL is supported