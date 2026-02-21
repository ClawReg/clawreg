import { BaseProvider, ChannelProvider, AgentMessage } from '../types';

/**
 * CustomProvider allows users to bridge any proprietary or niche messaging 
 * platform into the ClawReg ecosystem by providing their own implementation logic.
 */
export class CustomProvider extends BaseProvider {
    name: ChannelProvider = 'custom';
    private handlers: ((msg: AgentMessage) => void)[] = [];

    constructor(
        public nameOverride: string,
        private options: {
            onInitialize?: () => Promise<void>;
            onSend: (to: string, message: string) => Promise<void>;
        }
    ) {
        super();
        if (nameOverride) {
            // Technically name is 'custom', but we can allow identification
            console.log(`[ClawReg] Custom provider created: ${nameOverride}`);
        }
    }

    async initialize(): Promise<void> {
        if (this.options.onInitialize) {
            await this.options.onInitialize();
        }
        console.log(`[ClawReg] Custom provider ${this.nameOverride} initialized.`);
    }

    async send(to: string, message: string): Promise<void> {
        await this.options.onSend(to, message);
    }

    onMessage(handler: (msg: AgentMessage) => void): void {
        this.handlers.push(handler);
    }

    /**
     * Use this method to inject messages received from your custom source 
     * into the ClawReg routing system.
     */
    public pushMessage(from: string, text: string, metadata?: any) {
        const msg: AgentMessage = {
            id: `custom-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            channel: this.name,
            sender: from,
            text,
            timestamp: Date.now(),
            metadata: {
                customProvider: this.nameOverride,
                ...metadata
            }
        };
        this.handlers.forEach(h => h(msg));
    }
}
