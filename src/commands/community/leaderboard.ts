import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/command.js';
import { env } from '../../config/env.js';

const MEDALS = ['🥇', '🥈', '🥉'];

interface LeaderboardWorshipper {
    rank: number;
    discordId: string;
    username: string | null;
    avatarHash: string | null;
    xp: number;
    level: number;
    fervorStreak: number;
}

export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Découvrez le panthéon des fidèles les plus dévoués au Saint-Cochon.'),

    async execute(interaction) {
        await interaction.deferReply();

        const res = await fetch(`${env.API_URL}/worshippers/leaderboard`, {
            headers: { 'X-Bot-Secret': env.BOT_SECRET },
        });

        if (!res.ok) {
            await interaction.editReply({
                content: '⚠️ Les parchemins sacrés sont illisibles. Le Saint-Cochon fait la sieste, réessayez plus tard.',
            });
            return;
        }

        const leaderboard: LeaderboardWorshipper[] = await res.json();

        if (leaderboard.length === 0) {
            await interaction.editReply({
                content: '🐖 Le temple est désert... Tapez `/pray` pour devenir le premier disciple !',
            });
            return;
        }

        const leaderboardText = leaderboard.map(user => {
            const rankIndicator = user.rank <= 3 ? MEDALS[user.rank - 1] : `**${user.rank}.**`;

            const isMe = user.discordId === interaction.user.id;
            const displayName = user.username || 'Fidèle Anonyme';
            const nameFormat = isMe ? `__**${displayName}**__ 👈` : `**${displayName}**`;

            const streakBadge = user.fervorStreak >= 3 ? ` 🔥 *(${user.fervorStreak}j)*` : '';

            return `${rankIndicator} ${nameFormat} — Niv. ${user.level} (🐽 \`${user.xp} XP\`)${streakBadge}`;
        }).join('\n\n');

        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('🏆 Panthéon du Saint-Cochon')
            .setDescription('*Seuls les plus fervents adorateurs voient leur nom gravé dans le marbre sacré.*\n\n' + leaderboardText)
            .setThumbnail(interaction.client.user.displayAvatarURL({ size: 256 }))
            .setFooter({ text: 'Utilisez /pray chaque jour pour consolider votre place !' });

        await interaction.editReply({ embeds: [embed] });
    },
} satisfies Command;