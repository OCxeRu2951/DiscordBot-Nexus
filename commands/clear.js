import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('メッセージを一括削除します（最大100件・14日以内）')
    .addIntegerOption(opt =>
      opt.setName('amount').setDescription('削除する件数 (1〜100)').setRequired(true).setMinValue(1).setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    await interaction.deferReply({ ephemeral: true });

    const deleted = await interaction.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      return null;
    });

    if (!deleted) {
      return interaction.editReply('削除に失敗しました。14日以内のメッセージのみ削除可能です。');
    }

    await interaction.editReply(`${deleted.size} 件のメッセージを削除しました。`);
  },
};
