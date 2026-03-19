import { db } from '../utils/db.js';

export default {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // 自分がAFKだった場合は解除
    const { rows: selfRows } = await db.execute({
      sql: `SELECT user_id FROM afk WHERE user_id = ?`,
      args: [message.author.id],
    });
    if (selfRows.length > 0) {
      await db.execute({ sql: `DELETE FROM afk WHERE user_id = ?`, args: [message.author.id] });
      await message.reply('AFKを解除しました。').catch(console.error);
    }

    // メンションされたユーザーがAFKかチェック
    for (const user of message.mentions.users.values()) {
      const { rows } = await db.execute({
        sql: `SELECT reason, since FROM afk WHERE user_id = ?`,
        args: [user.id],
      });
      if (rows.length > 0) {
        const { reason, since } = rows[0];
        const elapsed = Math.floor((Date.now() - Number(since)) / 60000);
        await message
          .reply(`**${user.username}** は現在AFK中です（${elapsed}分前）\n理由: ${reason}`)
          .catch(console.error);
      }
    }
  },
};
