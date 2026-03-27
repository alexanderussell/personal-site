import { Resend } from 'resend';
import { ConvexHttpClient } from 'convex/browser';

export function getResend() {
  return new Resend(import.meta.env.RESEND_API_KEY);
}

export function getConvex() {
  return new ConvexHttpClient(import.meta.env.CONVEX_URL);
}

export const FROM_EMAIL = () =>
  `Alex Russell <${import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`;

export const REPLY_TO = 'alex@collectivelymade.com';
