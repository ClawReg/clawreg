import { AgentMessage, AgentSession, ChannelProvider } from './types';
import { BaseAgent } from './agents';

export class MessageRouter {
    private routes: Map<string, BaseAgent> = new Map();
    private sessions: Map<string, AgentSession> = new Map();

    public registerRoute(pattern: string | RegExp, agent: BaseAgent) {
        this.routes.set(pattern.toString(), agent);
    }

    public async getSession(channel: ChannelProvider, userId: string): Promise<AgentSession> {
        const sessionId = `${channel}:${userId}`;
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, {
                id: sessionId,
                channel,
                userId,
                history: [],
                metadata: {}
            });
        }
        return this.sessions.get(sessionId)!;
    }

    public async handle(message: AgentMessage) {
        const session = await this.getSession(message.channel, message.sender);
        session.history.push(message);

        // Simple routing logic: look for exact matches or use a default
        // In a real app, this would be more sophisticated (NLP, etc.)
        for (const [pattern, agent] of this.routes.entries()) {
            if (message.text.includes(pattern)) {
                return agent.handleMessage(message);
            }
        }

        // Default route if registered
        const defaultAgent = this.routes.get('default');
        if (defaultAgent) {
            return defaultAgent.handleMessage(message);
        }
    }
}
