import { uint8ArrayToNum } from "./operation-bytes";

export class GrpcBrowser {
    public isConnected: boolean = false;
    private ws: WebSocket;
    private messageQueue: (string | Uint8Array)[] = [];
    private callbacks: {
        [operationId: number]: (arr: Uint8Array) => void
    } = {}

    constructor(host: string) {
        this.ws = new WebSocket(host);
        this.ws.onopen = this.onOpen;
        this.ws.onclose = this.onClose;
        this.ws.onmessage = this.onMessage;
    }

    public send(data: string | Uint8Array) {
        if (this.isConnected) {
            this.ws.send(data);
        } else {
            this.messageQueue.push(data);
        }
    }

    private onMessage = (event: MessageEvent) => {
        (event.data as Blob).arrayBuffer().then(buffer => {
            const uintArray = new Uint8Array(buffer);
            const operationIdSlice = uintArray.slice(0, 4);
            const operationId = uint8ArrayToNum(operationIdSlice);
            const data = uintArray.slice(4);

            if (this.callbacks[operationId]) {
                this.callbacks[operationId](data);
                delete this.callbacks[operationId];
            }
        })
    };

    public waitForMessage = async (operationId: number) => {
        return new Promise((resolve, reject) => {
            this.callbacks[operationId] = (arr: Uint8Array) => resolve(arr)
        });
    }

  private onOpen = () => {
    this.isConnected = true;

    this.messageQueue.forEach(message => this.send(message));
    this.messageQueue = [];
  };

  private onClose = () => {
    this.isConnected = false;
  };
}