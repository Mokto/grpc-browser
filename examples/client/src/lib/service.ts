import { MethodKind } from "@bufbuild/protobuf";
import { GrpcBrowser } from "./grpc-browser";
import { getRandomUint32, numToUint8Array } from "./operation-bytes";

interface ConnectService {
  typeName: string;
  methods: {
    [method: string]:
      | ConnectServiceUnary<any, any>
      | ConnectServiceServerStreaming<any, any>;
  };
}

interface ConnectServiceUnary<I, O> {
  name: string;
  I: I;
  O: O;
  kind: MethodKind.Unary;
}

interface ConnectServiceServerStreaming<I, O> {
  name: string;
  I: I;
  O: O;
  kind: MethodKind.ServerStreaming;
}

interface CallOptions {
  headers?: Record<string, string>;
}

type Unary<I, O> = (input: I, options?: CallOptions) => Promise<O>;
type ServerStreaming<I, O> = (
  input: I,
  callback: (output: O) => void,
  options?: CallOptions
) => Promise<void>;

export class GrpcServiceConnect<T extends ConnectService> {
  public methods: {
    [prop in keyof T["methods"]]: T["methods"][prop] extends ConnectServiceUnary<
      any,
      any
    >
      ? Unary<
          InstanceType<T["methods"][prop]["I"]>,
          InstanceType<T["methods"][prop]["O"]>
        >
      : ServerStreaming<
          InstanceType<T["methods"][prop]["I"]>,
          InstanceType<T["methods"][prop]["O"]>
        >;
  };

  constructor(
    grpcBrowser: GrpcBrowser,
    service: T,
    host: string,
    ssl: boolean
  ) {
    this.methods = {} as any;
    Object.entries(service.methods).forEach(([key, value]) => {
      if (service.methods[key as keyof T["methods"]].kind === MethodKind.Unary) {
        // @ts-ignore
        this.methods[key as keyof T["methods"]] = async ( 
          input: typeof value.I,
          options?: CallOptions
        ) => {
          const operationId = getRandomUint32();
          grpcBrowser.send(
            JSON.stringify({
              call_type: "unary",
              host: host,
              ssl: ssl,
              method: `${service.typeName}/${value.name}`,
              operation_id: operationId,
              headers: options?.headers,
            })
          );
  
          const operationIdBinary = numToUint8Array(operationId);
          const inputBinary = input.toBinary();
  
          const fullBinary = new Uint8Array(
            operationIdBinary.length + inputBinary.length
          );
          fullBinary.set(operationIdBinary);
          fullBinary.set(inputBinary, operationIdBinary.length);
  
          grpcBrowser.send(fullBinary);
  
          const result = await grpcBrowser.waitForMessage(operationId);
          return value.O.fromBinary(result);
        };
      }


      if (service.methods[key as keyof T["methods"]].kind === MethodKind.ServerStreaming) {
        // @ts-ignore
        this.methods[key as keyof T["methods"]] = async ( 
          input: typeof value.I,
          callback: (output: typeof value.O) => void,
          options?: CallOptions
        ) => {
          console.log(input, callback, options)
          // callback()
          const operationId = getRandomUint32();
          grpcBrowser.send(
            JSON.stringify({
              call_type: "server_streaming",
              host: host,
              ssl: ssl,
              method: `${service.typeName}/${value.name}`,
              operation_id: operationId,
              headers: options?.headers,
            })
          );
  
          const operationIdBinary = numToUint8Array(operationId);
          const inputBinary = input.toBinary();
  
          const fullBinary = new Uint8Array(
            operationIdBinary.length + inputBinary.length
          );
          fullBinary.set(operationIdBinary);
          fullBinary.set(inputBinary, operationIdBinary.length);
  
          grpcBrowser.send(fullBinary);
  
          const result = await grpcBrowser.waitForMessage(operationId);
          return value.O.fromBinary(result);
        };
      }
    });
  }
}
