import { MethodKind } from "@bufbuild/protobuf";
import { GrpcBrowser } from "./grpc-browser";
import { getRandomUint32, numToUint8Array } from "./operation-bytes";


interface ConnectService {
    typeName: string;
    methods: {
        [method: string]: ConnectServiceUnary<any, any>;
    }
}

interface ConnectServiceUnary<I, O> {
    name: string,
    I: I,
    O: O,
    kind: MethodKind.Unary,
}

interface CallOptions {
  headers?: Record<string, string>;
}

type Unary<I, O> = (input: I, options?: CallOptions) => Promise<O>;


export class GrpcServiceConnect<T extends ConnectService> {
  public methods: {
    [prop in keyof T['methods']]: Unary<InstanceType<T['methods'][prop]['I']>, InstanceType<T['methods'][prop]['O']>>;
  }

  constructor(
    grpcBrowser: GrpcBrowser,
    service: T,
    host: string,
    ssl: boolean,
  ) {
    this.methods = {} as any;
    Object.entries(service.methods).forEach(([key, value]) => {
        this.methods[key as keyof T["methods"]] = async (input: typeof value.I, options?: CallOptions) => {
            const operationId = getRandomUint32();
            grpcBrowser.send(JSON.stringify({
                call_type: value.kind === 0 ? 'unary' : 'unsupported',
                host: host,
                ssl: ssl,
                method: `${service.typeName}/${value.name}`,
                operation_id: operationId,
                headers: options?.headers,
            }))

            const operationIdBinary = numToUint8Array(operationId);
            const inputBinary = input.toBinary();

            const fullBinary = new Uint8Array(operationIdBinary.length + inputBinary.length)
            fullBinary.set(operationIdBinary);
            fullBinary.set(inputBinary, operationIdBinary.length);
            
            grpcBrowser.send(fullBinary);

            const result = await grpcBrowser.waitForMessage(operationId);
            return value.O.fromBinary(result);
        };
    });
  }
}
