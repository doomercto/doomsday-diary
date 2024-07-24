import crypto from 'crypto';

export function hashEmail(email: string): string {
  return crypto
    .createHmac('sha256', process.env.EMAIL_PEPPER ?? '')
    .update(email)
    .digest('hex');
}

export function sendTelegramMessage({
  chat_id,
  text,
}: {
  chat_id?: string;
  text: string;
}) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error('Telegram bot token not found');
  }
  if (!chat_id) {
    throw new Error('Telegram chat id not found');
  }

  return Promise.race([
    fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id,
          text,
        }),
      }
    ).then(response =>
      response.ok
        ? response
        : Promise.reject(`${response.status} ${response.statusText}`)
    ),
    new Promise((_resolve, reject) =>
      setTimeout(() => {
        reject('timed out');
      }, 5000)
    ),
  ]);
}
