import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fileLoader from '../utils/fileLoader.js';
import { Client } from 'discord.js';
import { isEvent } from '../types/event.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const eventsPath = path.join(__dirname, '..', 'events');

export default async function loadEvents(client: Client): Promise<void> {
    await fileLoader(eventsPath, async (filePath) => {
        const { default: event } = await import(filePath);

        if (isEvent(event)) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            }
            else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
        else {
            console.log(`[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`);
        }
    });
}
