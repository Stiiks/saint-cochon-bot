import { ClientEvents } from 'discord.js';

export interface Event<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (...args: ClientEvents[K]) => Promise<void>;
}

export const isEvent = (obj: unknown): obj is Event<keyof ClientEvents> => {
    return obj !== null && typeof obj === 'object' && 'name' in obj && 'execute' in obj;
};