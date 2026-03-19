# Discord Utility Bot (試用版)

discord.js v14 製のユーティリティBot。

## 機能一覧

| コマンド | 説明 |
|---|---|
| `/timer` | 指定分後にメンション通知 |
| `/clear` | メッセージ一括削除（要ManageMessages権限） |
| `/poll` | 絵文字リアクション投票を作成 |
| `/serverinfo` | サーバー情報を表示 |
| `/userinfo` | ユーザー情報を表示 |
| `/afk` | AFK設定（メンション時に自動返信） |

時報は起動中に `.env` の `HOURLY_CHANNEL_ID` を設定すると毎時0分に送信。

---

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、各値を埋める。

```bash
cp .env.example .env
```

- `DISCORD_TOKEN`: Bot Token（Discord Developer Portal > Bot）
- `CLIENT_ID`: ApplicationのID（General Information）
- `GUILD_ID`: テスト用サーバーのID
- `HOURLY_CHANNEL_ID`: 時報を送るチャンネルのID（不要なら空欄）

### 3. Slash Commandの登録

```bash
node deploy-commands.js
```

### 4. 起動

```bash
node index.js
```

---

## fly.io へのデプロイ

```bash
# flyctlをインストール済みの前提
fly launch --no-deploy
fly secrets set DISCORD_TOKEN=xxx CLIENT_ID=xxx GUILD_ID=xxx HOURLY_CHANNEL_ID=xxx
fly deploy
```

---

## ディレクトリ構成

```
discord-bot/
├── index.js              # エントリポイント
├── deploy-commands.js    # Slash Command登録スクリプト
├── fly.toml              # fly.io設定
├── Dockerfile
├── commands/
│   ├── timer.js
│   ├── clear.js
│   ├── poll.js
│   ├── serverinfo.js
│   ├── userinfo.js
│   └── afk.js
├── events/
│   ├── ready.js          # 起動確認 & 時報
│   ├── interactionCreate.js
│   └── messageCreate.js  # AFK検知
└── utils/
    └── afk.js            # AFKの共有状態
```
