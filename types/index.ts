export type ChannelProvider = 'whatsapp' | 'telegram' | 'discord' | 'custom';

export interface ClawRegConfig {
    apiKey?: string;
    gatewayUrl?: string;
    debug?: boolean;
}

export interface AgentMessage {
    id: string;
    channel: ChannelProvider;
    sender: string;
    text: string;
    metadata?: Record<string, any>;
    timestamp: number;
}

export interface AgentResponse {
    text: string;
    actions?: AgentAction[];
}

export interface AgentAction {
    type: string;
    payload: any;
}

export interface Tool {
    name: string;
    description: string;
    parameters: any;
    execute: (args: any) => Promise<any>;
}

export interface AgentSession {
    id: string;
    channel: ChannelProvider;
    userId: string;
    history: AgentMessage[];
    metadata: Record<string, any>;
}

export interface Workspace {
    id: string;
    name: string;
    files: string[];
    config: Record<string, any>;
}

export abstract class BaseProvider {
    abstract name: ChannelProvider;
    abstract send(to: string, message: string): Promise<void>;
    abstract onMessage(handler: (msg: AgentMessage) => void): void;
    abstract initialize(): Promise<void>;
}
