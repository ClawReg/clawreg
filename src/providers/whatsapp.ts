import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    delay
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import { BaseProvider, ChannelProvider, AgentMessage } from '../types';

export class WhatsAppProvider extends BaseProvider {
    name: ChannelProvider = 'whatsapp';
    private handlers: ((msg: AgentMessage) => void)[] = [];
    private sock: any;

    constructor(private options: { sessionPath?: string } = {}) {
        super();
    }

    async initialize(): Promise<void> {
        const { state, saveCreds } = await useMultiFileAuthState(this.options.sessionPath || 'auth_info_baileys');
        const { version, isLatest } = await fetchLatestBaileysVersion();

        console.log(`[WhatsApp] Starting Baileys v${version.join('.')} (latest: ${isLatest})`);

        this.sock = makeWASocket({
            version,
            auth: state,
            printQRInTerminal: true // Mengeluarkan QR Code di terminal
        });

        this.sock.ev.on('creds.update', saveCreds);

        this.sock.ev.on('connection.update', (update: any) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('[WhatsApp] Connection closed, reconnecting:', shouldReconnect);
                if (shouldReconnect) this.initialize();
            } else if (connection === 'open') {
                console.log('[WhatsApp] Connected successfully!');
            }
        });

        this.sock.ev.on('messages.upsert', async (m: any) => {
            if (m.type === 'notify') {
                for (const msg of m.messages) {
                    if (!msg.key.fromMe && msg.message) {
                        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
                        if (text) {
                            const agentMsg: AgentMessage = {
                                id: msg.key.id!,
                                channel: 'whatsapp',
                                sender: msg.key.remoteJid!,
                                text: text,
                                timestamp: Date.now()
                            };
                            this.handlers.forEach(h => h(agentMsg));
                        }
                    }
                }
            }
        });
    }

    async send(to: string, message: string): Promise<void> {
        if (!this.sock) throw new Error("WhatsApp socket not initialized");
        await this.sock.sendMessage(to, { text: message });
    }

    onMessage(handler: (msg: AgentMessage) => void): void {
        this.handlers.push(handler);
    }
}
