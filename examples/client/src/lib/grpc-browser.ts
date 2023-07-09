
export class GrpcBrowser {
    public isConnected: boolean = false;
    private ws: WebSocket;
    private messageQueue: string[] = [];

    constructor(
        private readonly host: string
    ) {
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
        console.log(event)
    };

  private onOpen = () => {
    this.isConnected = true;
    // if (this.authIsConnected !== null) {
    //   this.sendAuthMessage(this.authIsConnected, this.authToken);
    // }

    this.messageQueue.forEach(message => this.send(message));
    this.messageQueue = [];
  };

  private onClose = () => {
    this.isConnected = false;
    // setTimeout(() => {
    //   this.initializeWebSocket();
    // }, 300);
  };
}