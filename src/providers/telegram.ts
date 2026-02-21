import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { BaseProvider, ChannelProvider, AgentMessage } from '../types';

export class TelegramProvider extends BaseProvider {
    name: ChannelProvider = 'telegram';
    private handlers: ((msg: AgentMessage) => void)[] = [];
    private bot: Telegraf;

    constructor(private config: { botToken: string }) {
        super();
        this.bot = new Telegraf(this.config.botToken);
    }

    async initialize(): Promise<void> {
        console.log(`[Telegram] Initializing Bot...`);

        this.bot.on(message('text'), (ctx) => {
            const agentMsg: AgentMessage = {
                id: ctx.message.message_id.toString(),
                channel: 'telegram',
                sender: ctx.chat.id.toString(),
                text: ctx.message.text,
                timestamp: Date.now(),
                metadata: {
                    username: ctx.from.username,
                    first_name: ctx.from.first_name
                }
            };

            this.handlers.forEach(h => h(agentMsg));
        });

        this.bot.launch();
        console.log('[Telegram] Bot is live!');

        // Enable graceful stop
        process.once('SIGINT', () => this.bot.stop('SIGINT'));
        process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    }

    async send(to: string, message: string): Promise<void> {
        await this.bot.telegram.sendMessage(to, message);
    }

    onMessage(handler: (msg: AgentMessage) => void): void {
        this.handlers.push(handler);
    }
}
