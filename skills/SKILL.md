---
name: clawreg_skill_system
description: Framework for building and extending autonomous capabilities for ClawReg AI agents.
---

# ClawReg Skill Specification v1.0

A **Skill** in ClawReg is a collection of tools, configurations, and specialized logic that empowers an AI agent to perform specific real-world tasks. This document serves as the master guide for developers and AI assistants to build interoperable capabilities.

## 🛠️ Anatomy of a Skill

Every skill should follow this directory structure for portability:

```text
skills/
└── my-cool-skill/
    ├── SKILL.md          # This instruction file
    ├── index.ts          # Entry point (Tools export)
    ├── scripts/          # Helper scripts (Python, JS, Shell)
    └── resources/        # Static assets or templates
```

## 📜 Skill Definition

Skills are defined as a set of `Tool` objects. In ClawReg, a tool must strictly adhere to the following interface:

```typescript
interface Tool {
  name: string;        // Unique snake_case identifier
  description: string; // Detailed prompt for the LLM
  parameters: object;  // JSON Schema for arguments
  execute: (args: any) => Promise<any>;
}
```

## 🚀 Building a Skill (Example: Machine Control)

Here is a blueprint for a "Machine Management" skill that allows agents to reboot or check the health of physical claw machines.

### 1. Define the Tools (`index.ts`)

```typescript
import { Tool } from '@clawreg/core';

export const MachineControlSkill: Tool[] = [
  {
    name: 'reboot_machine',
    description: 'Triggers a hardware reboot of the specified claw machine.',
    parameters: {
      machineId: 'string',
      force: 'boolean'
    },
    execute: async ({ machineId, force }) => {
      // Hardware-specific logic here
      return { status: 'success', message: `${machineId} is rebooting.` };
    }
  },
  {
    name: 'get_revenue_report',
    description: 'Fetches the current daily revenue status from the machine database.',
    parameters: {},
    execute: async () => {
      return { dailyTotal: 1540.50, currency: 'USD' };
    }
  }
];
```

### 2. Attaching to an Agent

```typescript
import { AIAgent } from '@clawreg/core';
import { MachineControlSkill } from './skills/machine-control';

const agent = new AIAgent("AdminAgent");

// Register all tools from the skill
MachineControlSkill.forEach(tool => agent.registerTool(tool));
```

## 🤖 AI Assistant Instructions

When an AI assistant is tasked with using a ClawReg skill, it must:

1.  **Analyze Parameters**: Strictly validate the `machineId` or other parameters before execution.
2.  **Safety First**: For destructive actions (like `reboot` or `delete`), request explicit human confirmation via the channel (WhatsApp/Discord).
3.  **Contextual Response**: After a tool executes, format the raw JSON response into a human-friendly message for the user.

## 📡 Skill Lifecycle

1.  **Discovery**: The `MessageRouter` identifies a request requiring a specific skill.
2.  **Invocation**: The `AIAgent` selects the appropriate tool from its registry.
3.  **Execution**: The tool's `execute` function runs (possibly interacting with hardware or APIs).
4.  **Completion**: The agent receives the result and closes the loop with the human user.

---

*This specification is part of the ClawReg Core Library ecosystem. Visit [clawreg.fun](https://clawreg.fun) for updates.*
