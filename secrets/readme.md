# Secrets 🔐

The secret.json file should look like this.

```json
{
  "bucket": "<Bucket name>",
  "token": "<Telegram bot token>",
  "chatId": "<Your telegram chat id>",
  "domain": "<Webhook domain>",
  "centuria": "A18b"
}
```

You can encrypt them running this command.

```bash
yarn encrypt --passphrase "<your passphrase>"
```
