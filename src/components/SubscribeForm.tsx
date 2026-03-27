import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'already_subscribed' | 'error';

interface Props {
  list: 'book' | 'newsletter';
}

const messages: Record<'success' | 'already_subscribed' | 'error', string> = {
  success: "You're on the list — I'll be in touch.",
  already_subscribed: "You're already signed up.",
  error: 'Something went wrong. Try again.',
};

export function SubscribeForm({ list }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit() {
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, list }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        return;
      }

      setStatus(
        data.status === 'already_subscribed' ? 'already_subscribed' : 'success'
      );
    } catch {
      setStatus('error');
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  if (status === 'success' || status === 'already_subscribed' || status === 'error') {
    return (
      <p className="subscribe-message" data-status={status}>
        {messages[status]}
        {status === 'error' && (
          <button
            onClick={() => setStatus('idle')}
            className="subscribe-retry"
            type="button"
          >
            Try again
          </button>
        )}
      </p>
    );
  }

  const isLoading = status === 'loading';

  return (
    <div className="subscribe-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="your@email.com"
        disabled={isLoading}
        className="subscribe-input"
        autoComplete="email"
        inputMode="email"
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading || !email.trim()}
        className="subscribe-button"
        type="button"
      >
        {isLoading ? (
          <span className="subscribe-spinner" aria-label="Submitting…" />
        ) : (
          'Notify me'
        )}
      </button>
    </div>
  );
}
