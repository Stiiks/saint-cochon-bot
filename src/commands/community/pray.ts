import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/command.js';
import { env } from '../../config/env.js';

const OUTCOME_LABELS: Record<string, { label: string; emoji: string; color: number; quote: string }> = {
    wrath:    {
        label: 'Courroux Divin',
        emoji: '🌩️',
        color: 0xe74c3c,
        quote: '*"Misérable mortel ! Votre offrande est pitoyable. Subissez mon courroux !"*',
    },
    ordinary: {
        label: 'Prière Entendue',
        emoji: '🙏',
        color: 0x95a5a6,
        quote: '*"Votre dévotion quotidienne a été remarquée. Allez en paix."*',
    },
    blessing: {
        label: 'Bénédiction Majeure',
        emoji: '✨',
        color: 0xf1c40f,
        quote: '*"Le Saint-Cochon sourit à votre ferveur ! Que la grâce inonde votre chemin."*',
    },
    miracle:  {
        label: 'Miracle Transcendant',
        emoji: '🌟',
        color: 0xe67e22,
        quote: '*"UN MIRACLE ! Les cieux s\'ouvrent et une pluie de truffes sacrées s\'abat sur vous !"*',
    },
};

export default {
    data: new SlashCommandBuilder()
        .setName('pray')
        .setDescription('Priez le Saint-Cochon et recevez sa bénédiction… ou son courroux.'),

    async execute(interaction) {
        await interaction.deferReply();

        const res = await fetch(`${env.API_URL}/pray`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Bot-Secret': env.BOT_SECRET,
            },
            body: JSON.stringify({
                discordId: interaction.user.id,
                avatar: interaction.user.avatar,
                username: interaction.user.username,
            }),
        });

        if (res.status === 429) {
            await interaction.editReply('🐷 **L\'avidité est un péché !** Vous avez déjà prié aujourd\'hui. Laissez l\'autel se reposer et revenez demain.');
            return;
        }

        if (!res.ok) {
            await interaction.editReply('⚠️ L\'autel du Saint-Cochon est plongé dans les ténèbres. Réessayez plus tard.');
            return;
        }

        const { outcome, xpGained, streak, totalXp } = await res.json();
        const o = OUTCOME_LABELS[outcome] || OUTCOME_LABELS['ordinary'];

        const streakText = streak >= 3
            ? `🔥 **${streak} jours**`
            : `**${streak} jour${streak > 1 ? 's' : ''}**`;

        const embed = new EmbedBuilder()
            .setColor(o.color)
            .setAuthor({
                name: interaction.user.displayName,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle(`${o.emoji} ${o.label}`)
            .setThumbnail(interaction.user.displayAvatarURL({ size: 256 }))
            .setDescription(o.quote)
            .addFields(
                { name: 'XP gagné', value: `+${xpGained} XP`, inline: true },
                { name: 'Ferveur', value: streakText, inline: true },
                { name: 'Dévotion Totale', value: `🐽 \`${totalXp} XP\``, inline: true },
            )
            .setFooter({ text: 'Revenez prier demain pour ne pas briser votre ferveur !' });

        await interaction.editReply({ embeds: [embed] });
    },
} satisfies Command;