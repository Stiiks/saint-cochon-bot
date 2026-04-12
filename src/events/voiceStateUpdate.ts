import { ChannelType, Events, PermissionsBitField } from 'discord.js';
import { Event } from '../types/event.js';
import voiceConfig from '../config/voice.js';

export default {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const enteredChannel = newState.channelId;
        const member = newState.member;

        // If user is a bot
        if (member?.user.bot) return;

        // If the user left a channel or switched channels, we check if the old channel was a dynamic one and delete it if it's empty
        if (oldState.channelId && oldState.channel?.parentId === voiceConfig.dynamicVoiceCategoryId) {
            if (oldState.channel.type === ChannelType.GuildVoice && oldState.channel.members.size === 0) {
                await oldState.channel.delete();
            }
        }

        // Check if the user has entered a dynamic voice channel
        const channelConfig = voiceConfig.dynamicVoiceChannels.find(channel => channel.channelId === enteredChannel);
        if (!channelConfig) return;

        const createdChannel = await newState.guild.channels.create({
            name: `${channelConfig.name} de ${member?.displayName || 'Unknown'}`,
            userLimit: channelConfig.maxUsers,
            type: ChannelType.GuildVoice,
            parent: voiceConfig.dynamicVoiceCategoryId,
            permissionOverwrites: [
                {
                    id: newState.member?.id || '',
                    allow: [
                        PermissionsBitField.Flags.ManageChannels,
                        PermissionsBitField.Flags.MoveMembers,
                    ],
                },
            ],
        });

        await member?.voice.setChannel(createdChannel);
    },
} satisfies Event<Events.VoiceStateUpdate>;