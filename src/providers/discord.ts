import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { BaseProvider, ChannelProvider, AgentMessage } from '../types';

export class DiscordProvider extends BaseProvider {
    name: ChannelProvider = 'discord';
    private handlers: ((msg: AgentMessage) => void)[] = [];
    private client: Client;

    constructor(private config: { botToken: string }) {
        super();
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages
            ]
        });
    }

    async initialize(): Promise<void> {
        console.log(`[Discord] Logging in...`);

        this.client.on('messageCreate', (message) => {
            if (message.author.bot) return;

            const agentMsg: AgentMessage = {
                id: message.id,
                channel: 'discord',
                sender: message.channelId, // We use channelId for context
                text: message.content,
                timestamp: message.createdTimestamp,
                metadata: {
                    author: message.author.tag,
                    isDirect: !message.guild
                }
            };

            this.handlers.forEach(h => h(agentMsg));
        });

        await this.client.login(this.config.botToken);
        console.log(`[Discord] Logged in as ${this.client.user?.tag}`);
    }

    async send(to: string, message: string): Promise<void> {
        const channel = await this.client.channels.fetch(to);
        if (channel && channel.isTextBased()) {
            await (channel as any).send(message);
        } else {
            throw new Error(`Channel ${to} is not a valid text channel`);
        }
    }

    onMessage(handler: (msg: AgentMessage) => void): void {
        this.handlers.push(handler);
    }
}
