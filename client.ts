import { ClawRegConfig, AgentMessage, BaseProvider } from './types';

export class ClawRegClient {
    private providers: Map<string, BaseProvider> = new Map();
    private config: ClawRegConfig;

    constructor(config: ClawRegConfig = {}) {
        this.config = {
            gatewayUrl: 'https://api.clawreg.fun',
            ...config,
        };
    }

    public registerProvider(provider: BaseProvider) {
        this.providers.set(provider.name, provider);
        if (this.config.debug) {
            console.log(`[ClawReg] Provider registered: ${provider.name}`);
        }
    }

    public async send(to: string, message: string, channel: string) {
        const provider = this.providers.get(channel);
        if (!provider) {
            throw new Error(`Provider for channel ${channel} not found.`);
        }
        await provider.send(to, message);
    }

    public async broadcast(message: string) {
        const promises = Array.from(this.providers.values()).map(p =>
            // In a real scenario, you'd need the recipient IDs for each provider
            console.log(`[ClawReg] Broadcasting on ${p.name}: ${message}`)
        );
        await Promise.all(promises);
    }

    public onMessage(handler: (msg: AgentMessage) => void) {
        this.providers.forEach(provider => {
            provider.onMessage(handler);
        });
    }
}

