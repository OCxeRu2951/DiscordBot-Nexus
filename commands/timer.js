import { SlashCommandBuilder } from 'discord.js';
import { db } from '../utils/db.js';

export default {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('指定した時間後にメンションで通知します')
    .addIntegerOption(opt =>
      opt.setName('minutes').setDescription('分数 (1〜180)').setRequired(true).setMinValue(1).setMaxValue(180)
    )
    .addStringOption(opt =>
      opt.setName('label').setDescription('タイマーのラベル（任意）').setRequired(false)
    ),

  async execute(interaction) {
    const minutes = interaction.options.getInteger('minutes');
    const label = interaction.options.getString('label') ?? 'タイマー';
    const ms = minutes * 60 * 1000;
    const fireAt = Date.now() + ms;

    // DBに保存（再起動後も復元可能）
    const result = await db.execute({
      sql: `INSERT INTO reminders (user_id, channel_id, label, fire_at) VALUES (?, ?, ?, ?)`,
      args: [interaction.user.id, interaction.channelId, label, fireAt],
    });
    const reminderId = Number(result.lastInsertRowid);

    await interaction.reply(`**${label}** を ${minutes} 分後にお知らせします。`);

    setTimeout(async () => {
      await interaction.followUp(`${interaction.user} **${label}** の時間です！ (${minutes}分経過)`);
      await db.execute({ sql: `DELETE FROM reminders WHERE id = ?`, args: [reminderId] });
    }, ms);
  },
};
