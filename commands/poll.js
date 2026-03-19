import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const EMOJI_NUMBERS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

export default {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('投票を作成します')
    .addStringOption(opt =>
      opt.setName('question').setDescription('質問内容').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('choices').setDescription('選択肢をカンマ区切りで入力（例: はい,いいえ,どちらでも）').setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const rawChoices = interaction.options.getString('choices');
    const choices = rawChoices.split(',').map(s => s.trim()).filter(Boolean).slice(0, 10);

    if (choices.length < 2) {
      return interaction.reply({ content: '選択肢は2つ以上入力してください。', ephemeral: true });
    }

    const description = choices.map((c, i) => `${EMOJI_NUMBERS[i]} ${c}`).join('\n');

    const embed = new EmbedBuilder()
      .setTitle(`📊 ${question}`)
      .setDescription(description)
      .setColor(0x5865f2)
      .setFooter({ text: `投票 by ${interaction.user.username}` })
      .setTimestamp();

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    for (let i = 0; i < choices.length; i++) {
      await msg.react(EMOJI_NUMBERS[i]);
    }
  },
};
