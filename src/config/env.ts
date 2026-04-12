import * as v from 'valibot';

export enum NodeEnv {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

const configSchema = v.object({
    NODE_ENV: v.fallback(v.enum(NodeEnv, 'NODE_ENV must be one of \'development\', \'production\', or \'test\'.'), NodeEnv.Development),
    DISCORD_TOKEN: v.pipe(v.string('A token is required to run the bot.'), v.nonEmpty('The token cannot be empty.')),
    CLIENT_ID: v.pipe(v.string('A client ID is required to run the bot.'), v.nonEmpty('The client ID cannot be empty.')),
    CLIENT_SECRET: v.pipe(v.string('A client secret is required to run the bot.'), v.nonEmpty('The client secret cannot be empty.')),
    GUILD_ID: v.pipe(v.string('A guild ID is required to run the bot.'), v.nonEmpty('The guild ID cannot be empty.')),
});

export const config = v.parse(configSchema, process.env);