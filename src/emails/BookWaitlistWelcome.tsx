import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Hr,
  Link,
} from '@react-email/components';
import * as React from 'react';

export function BookWaitlistWelcome() {
  return (
    <Html lang="en">
      <Head />
      <Preview>You're on the list — I'll be in touch.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={heading}>You're on the list.</Text>
          <Text style={paragraph}>
            Thanks for signing up. I'm working on a book and wanted to gauge
            interest before committing. The fact that you're here means a lot.
          </Text>
          <Text style={paragraph}>
            I'll reach out when there's something worth sharing — no spam, no
            filler. Just a note when the book is real.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            — Alex
            {'  '}
            <Link href="https://alexanderussell.com" style={link}>
              alexanderussell.com
            </Link>
          </Text>
          <Text style={unsubscribe}>
            You signed up at{' '}
            <Link href="https://alexanderussell.com/book" style={link}>
              alexanderussell.com/book
            </Link>
            . Reply to this email if you'd like to be removed.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

BookWaitlistWelcome.PreviewProps = {};

export default BookWaitlistWelcome;

const body: React.CSSProperties = {
  backgroundColor: '#f7f6f3',
  fontFamily: '"JetBrains Mono", "Courier New", monospace',
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: '520px',
  margin: '40px auto',
  padding: '40px 32px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  border: '1px solid #e0dbd3',
};

const heading: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '600',
  color: '#1c1a17',
  margin: '0 0 20px',
  letterSpacing: '-0.01em',
};

const paragraph: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: '#555047',
  margin: '0 0 16px',
};

const hr: React.CSSProperties = {
  borderColor: '#e0dbd3',
  margin: '28px 0 20px',
};

const footer: React.CSSProperties = {
  fontSize: '14px',
  color: '#1c1a17',
  margin: '0 0 16px',
};

const unsubscribe: React.CSSProperties = {
  fontSize: '12px',
  color: '#a09a8f',
  margin: '0',
  lineHeight: '1.6',
};

const link: React.CSSProperties = {
  color: '#0d9b6d',
  textDecoration: 'none',
};
