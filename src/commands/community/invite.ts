import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command.js';

export default {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Créer un sondage pour inviter un membre à rejoindre le serveur.')
        .addStringOption((option) => option.setName('user').setDescription('Le pseudo membre à inviter').setRequired(true)),
    async execute(interaction) {
        await interaction.reply({
            poll: {
                question: { text: `Voulez-vous inviter ${interaction.options.getString('user')} à rejoindre le serveur ?` },
                allowMultiselect: false,
                answers: [
                    { text: 'Oui', emoji: '✅' },
                    { text: 'Non', emoji: '❌' },
                    { text: 'Je ne connais pas cette personne', emoji: '❓' },
                ],
                duration: 24,
            },
        });
    },
} satisfies Command;