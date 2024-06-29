import crypto from 'crypto';

export function hashEmail(email: string): string {
  return crypto
    .createHmac('sha256', process.env.EMAIL_PEPPER ?? '')
    .update(email)
    .digest('hex');
}
