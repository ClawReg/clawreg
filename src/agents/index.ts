import { AgentMessage, AgentResponse, Tool, AgentSession } from '../types';

export abstract class BaseAgent {
    constructor(public name: string) { }

    public abstract handleMessage(msg: AgentMessage, session?: AgentSession): Promise<AgentResponse>;
}

/**
 * AIAgent is a sophisticated agent capable of using tools and maintaining memory.
 */
export class AIAgent extends BaseAgent {
    protected tools: Map<string, Tool> = new Map();
    protected systemPrompt: string = "You are a helpful ClawReg assistant.";

    constructor(name: string, systemPrompt?: string) {
        super(name);
        if (systemPrompt) this.systemPrompt = systemPrompt;
    }

    public registerTool(tool: Tool) {
        this.tools.set(tool.name, tool);
    }

    public async handleMessage(msg: AgentMessage, session?: AgentSession): Promise<AgentResponse> {
        console.log(`[Agent:${this.name}] Processing: ${msg.text}`);

        // In a real implementation, this is where LLM integration happens
        // 1. Send history + message + tool definitions to LLM
        // 2. If LLM returns tool_call, execute it
        // 3. Return final text response

        return {
            text: `Processed by ${this.name}: ${msg.text.toUpperCase()}`,
            actions: []
        };
    }

    protected async executeTool(name: string, args: any) {
        const tool = this.tools.get(name);
        if (!tool) throw new Error(`Tool ${name} not found`);
        return await tool.execute(args);
    }
}

/**
 * OrchestratorAgent manages multiple sub-agents and routes tasks between them.
 */
export class OrchestratorAgent extends BaseAgent {
    private subAgents: Map<string, BaseAgent> = new Map();

    constructor(name: string) {
        super(name);
    }

    public addAgent(agent: BaseAgent) {
        this.subAgents.set(agent.name, agent);
    }

    public async handleMessage(msg: AgentMessage, session?: AgentSession): Promise<AgentResponse> {
        // Intelligent logic to decide which sub-agent to use
        const firstAgent = Array.from(this.subAgents.values())[0];
        if (firstAgent) {
            return firstAgent.handleMessage(msg, session);
        }
        return { text: "No sub-agents available to handle this request." };
    }
}
