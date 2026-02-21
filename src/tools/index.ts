import { Tool } from '../types';

export const FileSystemTool: Tool = {
    name: 'file_system',
    description: 'Read and write files in the agent workspace.',
    parameters: {
        path: 'string',
        action: 'read | write',
        content: 'string?'
    },
    execute: async (args) => {
        console.log(`[Tool:FS] Executing ${args.action} on ${args.path}`);
        return { success: true, data: "Simulated file content" };
    }
};

export const WebSearchTool: Tool = {
    name: 'web_search',
    description: 'Search the internet for real-time information.',
    parameters: {
        query: 'string'
    },
    execute: async (args) => {
        console.log(`[Tool:Web] Searching for: ${args.query}`);
        return { results: ["Result 1", "Result 2"] };
    }
};
