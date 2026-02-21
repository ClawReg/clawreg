import { BaseProvider, ChannelProvider, AgentMessage } from '../types';

export class WhatsAppProvider extends BaseProvider {
    name: ChannelProvider = 'whatsapp';
    private handlers: ((msg: AgentMessage) => void)[] = [];

    constructor(private config: { phoneNumber: string; sessionId?: string }) {
        super();
    }

    async initialize(): Promise<void> {
        console.log(`[ClawReg] Initializing WhatsApp provider for ${this.config.phoneNumber}...`);
        // Logic for QR code generation or session restoration would go here
    }

    async send(to: string, message: string): Promise<void> {
        console.log(`[WhatsApp] Sending to ${to}: ${message}`);
        // Actual API call to WhatsApp gateway
    }

    onMessage(handler: (msg: AgentMessage) => void): void {
        this.handlers.push(handler);
    }

    // Internal method to simulate incoming messages
    public _simulateIncoming(from: string, text: string) {
        const msg: AgentMessage = {
            id: Math.random().toString(36).substring(7),
            channel: this.name,
            sender: from,
            text,
            timestamp: Date.now(),
        };
        this.handlers.forEach(h => h(msg));
    }
}
