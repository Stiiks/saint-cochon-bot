import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/command.js';
import { env } from '../../config/env.js';

export default {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Consultez votre dévotion auprès du Saint-Cochon.'),

    async execute(interaction) {
        await interaction.deferReply();

        const res = await fetch(
            `${env.API_URL}/worshippers/${interaction.user.id}/level`,
            { headers: { 'X-Bot-Secret': env.BOT_SECRET } },
        );

        if (res.status === 404) {
            await interaction.editReply('🐷 Vous n\'avez jamais prié. Le Saint ignore votre existence.');
            return;
        }

        if (!res.ok) {
            await interaction.editReply('⚠️ L\'autel est inaccessible pour le moment. Réessayez plus tard.');
            return;
        }

        const { xp, level, xpCurrentLevel, xpNextLevel, xpToNextLevel, fervorStreak, lastPrayer } = await res.json();

        const progress = (xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel);
        const BAR_LENGTH = 12;
        const filled = Math.round(progress * BAR_LENGTH);
        const bar = '▰'.repeat(filled) + '▱'.repeat(BAR_LENGTH - filled);

        const streakText = fervorStreak >= 3
            ? `🔥 **${fervorStreak} jours** (En feu !)`
            : `**${fervorStreak} jour${fervorStreak > 1 ? 's' : ''}**`;

        const lastPrayerUnix = Math.floor(new Date(lastPrayer).getTime() / 1000);
        const formattedDate = lastPrayer ? `<t:${lastPrayerUnix}:f> (<t:${lastPrayerUnix}:R>)` : '*Aucune prière enregistrée*';

        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setAuthor({
                name: interaction.user.displayName,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle(`🐷 Grade Spirituel : Niveau ${level}`)
            .setThumbnail(interaction.user.displayAvatarURL({ size: 512 }))
            .setDescription('*Le Saint-Cochon observe votre ferveur...*')
            .addFields(
                {
                    name: 'Ascension vers le niveau suivant',
                    value: `${bar} **${Math.round(progress * 100)}%**\n*Encore ${xpToNextLevel} XP nécessaire.*`,
                    inline: false,
                },
                {
                    name: 'Dévotion Totale',
                    value: `🐽 ${xp} XP`,
                    inline: true,
                },
                {
                    name: 'Ferveur',
                    value: streakText,
                    inline: true,
                },
                {
                    name: 'Dernière Prière',
                    value: formattedDate,
                    inline: false,
                },
            )
            .setFooter({ text: 'Priez chaque jour pour maintenir votre ferveur !' });

        await interaction.editReply({ embeds: [embed] });
    },
} satisfies Command;