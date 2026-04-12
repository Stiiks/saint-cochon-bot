import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fileLoader from '../utils/fileLoader.js';
import { isCommand } from '../types/command.js';
import { Client } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, '..', 'commands');

export default async function loadCommands(client: Client): Promise<void> {
    await fileLoader(commandsPath, async (filePath) => {
        const { default: command } = await import(filePath);

        if (isCommand(command)) {
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }, true);
}
