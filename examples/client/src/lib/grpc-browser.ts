
export class GrpcBrowser {
    public isConnected: boolean = false;
    private ws: WebSocket;
    private messageQueue: string[] = [];
    private callbacks: {
        [operationId: number]: (blob: Blob) => void
    } = {}

    constructor(host: string) {
        this.ws = new WebSocket(host);
        this.ws.onopen = this.onOpen;
        this.ws.onclose = this.onClose;
        this.ws.onmessage = this.onMessage;
    }

    public send(data: string) {
        if (this.isConnected) {
            this.ws.send(data);
        } else {
            this.messageQueue.push(data);
        }
    }

    private onMessage = (event: MessageEvent) => {
        if (this.callbacks[0]) {
            this.callbacks[0](event.data);
        }
    };

    public waitForMessage = async () => {
        return new Promise((resolve, reject) => {
            this.callbacks[0] = (blob: Blob) => {
                blob.arrayBuffer().then(buffer => resolve(new Uint8Array(buffer)))
            }
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