import * as v from 'valibot';

export enum NodeEnv {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

const configSchema = v.object({
    NODE_ENV: v.fallback(v.enum(NodeEnv, 'NODE_ENV must be one of \'development\', \'production\', or \'test\'.'), NodeEnv.Development),
    DISCORD_TOKEN: v.pipe(v.string('A token is required to run the bot.'), v.nonEmpty('The token cannot be empty.')),
    DISCORD_CLIENT_ID: v.pipe(v.string('A client ID is required to run the bot.'), v.nonEmpty('The client ID cannot be empty.')),
    DISCORD_GUILD_ID: v.pipe(v.string('A guild ID is required to run the bot.'), v.nonEmpty('The guild ID cannot be empty.')),
    API_URL: v.pipe(v.string('An API URL is required.'), v.nonEmpty('The API URL cannot be empty.')),
});

export const env = v.parse(configSchema, process.env);