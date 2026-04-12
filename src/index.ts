import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from './config/env.js';
import loadCommands from './loaders/commandLoader.js';
import loadEvents from './loaders/eventLoader.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();

// Load core components
await loadCommands(client);
await loadEvents(client);

client.login(config.DISCORD_TOKEN);