#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
    .name('clawreg')
    .description('ClawReg Premium Remote Management CLI')
    .version('0.1.0');

program
    .command('onboard')
    .description('Start the ClawReg onboarding wizard')
    .option('--install-daemon', 'Install ClawReg as a system service')
    .action((options: { installDaemon?: boolean }) => {
        console.log('--- ClawReg Onboarding Wizard ---');
        if (options.installDaemon) {
            console.log('Installing daemon... Done.');
        }
        console.log('Welcome! Your gateway is being prepared.');
    });

program
    .command('serve')
    .description('Start the ClawReg gateway server')
    .action(() => {
        console.log('ClawReg Gateway Server starting on port 3000...');
    });

program.parse();
