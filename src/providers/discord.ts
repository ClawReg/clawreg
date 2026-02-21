import { BaseProvider, ChannelProvider, AgentMessage } from '../types';

export class DiscordProvider extends BaseProvider {
    name: ChannelProvider = 'discord';
    private handlers: ((msg: AgentMessage) => void)[] = [];

    constructor(private config: { botToken: string; guildId?: string }) {
        super();
    }

    async initialize(): Promise<void> {
        console.log(`[ClawReg] Initializing Discord bot provider...`);
        // Discord.js or similar logic here
    }

    async send(to: string, message: string): Promise<void> {
        console.log(`[Discord] Sending message to channel/user ${to}: ${message}`);
    }

    onMessage(handler: (msg: AgentMessage) => void): void {
        this.handlers.push(handler);
    }
}
