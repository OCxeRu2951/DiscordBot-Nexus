import { SlashCommandBuilder } from 'discord.js';
import { db } from '../utils/db.js';

export default {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('AFKを設定します。メンションされると理由を自動返信します')
    .addStringOption(opt =>
      opt.setName('reason').setDescription('理由（省略可）').setRequired(false)
    ),

  async execute(interaction) {
    const reason = interaction.options.getString('reason') ?? '離席中';

    await db.execute({
      sql: `INSERT OR REPLACE INTO afk (user_id, reason, since) VALUES (?, ?, ?)`,
      args: [interaction.user.id, reason, Date.now()],
    });

    await interaction.reply(`**${interaction.user.username}** をAFKに設定しました。\n理由: ${reason}`);
  },
};
