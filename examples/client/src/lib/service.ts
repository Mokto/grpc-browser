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
    [prop in keyof T['methods']]: Unary<T['methods'][prop]['I'], T['methods'][prop]['O']>;
  }

  constructor(
    private readonly grpcBrowser: GrpcBrowser,
    private readonly service: T,
    private host: string,
    private ssl: boolean,
  ) {
    this.methods = {} as any;
    Object.entries(service.methods).forEach(([key, value]) => {
        this.methods[key] = async (input: typeof value.I) => {
            this.grpcBrowser.send(JSON.stringify({
                call_type: value.kind === 0 ? 'unary' : 'unsupported',
                host: host,
                ssl: ssl,
                method: `${service.typeName}/${value.name}`,
                data: Array.from(input.toBinary()),
            }))
            // this.grpcBrowser.send(input.toBinary());
        };
    });
  }
}
