import { MethodKind } from "@bufbuild/protobuf";
import { GrpcBrowser } from "./grpc-browser";


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

type Unary<I, O> = (input: I) => Promise<O>;


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
        this.methods[key as keyof T["methods"]] = async (input: typeof value.I) => {
            grpcBrowser.send(JSON.stringify({
                call_type: value.kind === 0 ? 'unary' : 'unsupported',
                host: host,
                ssl: ssl,
                method: `${service.typeName}/${value.name}`,
                operationId: 0,
            }))
            grpcBrowser.send(input.toBinary());

            const result = await grpcBrowser.waitForMessage();
            return value.O.fromBinary(result);
        };
    });
  }
}
