import crypto, { randomUUID } from 'crypto';

import { cookies } from 'next/headers';

const ANON_ID_COOKIE = 'diary-anon-id';

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

export function getAnonId(createIfNotExists: true): string;
export function getAnonId(createIfNotExists?: false): string | undefined;
export function getAnonId(createIfNotExists = false) {
  const cookieStore = cookies();

  let anonId = cookieStore.get(ANON_ID_COOKIE)?.value;
  if (!anonId && createIfNotExists) {
    anonId = randomUUID();
  }

  if (anonId) {
    try {
      cookieStore.set(ANON_ID_COOKIE, anonId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
    } catch (error) {
      if (createIfNotExists) {
        throw error;
      }
    }
  }

  return anonId ? `anon-${anonId}` : undefined;
}

export async function verifyCaptcha(token: string, action?: string) {
  try {
    const result = (await Promise.race([
      fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
        { method: 'POST' }
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
    ])) as Response;

    const resultJson = await result.json();
    if (!resultJson.success) {
      throw resultJson;
    }
    if (action && resultJson.action !== action) {
      throw `Captcha action mismatch: ${resultJson.action} / ${action}`;
    }
    return resultJson.score > 0.7;
  } catch (error) {
    console.log('Failed to verify captcha', error);
    return false;
  }
}
