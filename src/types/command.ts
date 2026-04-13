import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const isCommand = (obj: unknown): obj is Command => {
    return obj !== null && typeof obj === 'object' && 'data' in obj && 'execute' in obj;
};