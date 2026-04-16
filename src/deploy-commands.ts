import { REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { env } from './config/env.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isCommand } from './types/command.js';

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

// ESM doesn't provide __dirname natively, so we recreate it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Grab all the command folders from the commands directory you created earlier
const folderPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(folderPath, folder);
    // Ensure we only read .js files in production and .ts files in development
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(env.NODE_ENV === 'production' ? '.js' : '.ts'));

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const { default: command } = await import(filePath);

        if (isCommand(command)) {
            commands.push(command.data.toJSON());
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(env.DISCORD_TOKEN);

// Command deployment
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID),
            { body: commands },
        );

        if (Array.isArray(data)) {
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
    }
    catch (error) {
        console.error(error);
    }
})();