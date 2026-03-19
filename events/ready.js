import { db } from '../utils/db.js';

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    await restoreReminders(client);
    scheduleHourlyAnnouncement(client);
  },
};

async function restoreReminders(client) {
  try {
    const { rows } = await db.execute(
      `SELECT * FROM reminders WHERE fire_at > ?`,
      [Date.now()]
    );
    for (const row of rows) {
      const delay = Number(row.fire_at) - Date.now();
      setTimeout(async () => {
        const ch = client.channels.cache.get(row.channel_id);
        if (ch) {
          await ch
            .send(`<@${row.user_id}> **${row.label}** の時間です！（再起動後に復元）`)
            .catch(console.error);
        }
        await db.execute({ sql: `DELETE FROM reminders WHERE id = ?`, args: [row.id] });
      }, delay);
    }
    if (rows.length > 0) console.log(`Restored ${rows.length} reminder(s).`);
  } catch (err) {
    console.error('Failed to restore reminders:', err);
  }
}

function scheduleHourlyAnnouncement(client) {
  const now = new Date();
  const msUntilNextHour =
    (60 - now.getMinutes()) * 60 * 1000 -
    now.getSeconds() * 1000 -
    now.getMilliseconds();
  setTimeout(() => {
    sendHourlyAnnouncement(client);
    setInterval(() => sendHourlyAnnouncement(client), 60 * 60 * 1000);
  }, msUntilNextHour);
}

async function sendHourlyAnnouncement(client) {
  const channelId = process.env.HOURLY_CHANNEL_ID;
  if (!channelId) return;
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  await channel.send(`**${hour}:${minute}** — 時報です。`).catch(console.error);
}
