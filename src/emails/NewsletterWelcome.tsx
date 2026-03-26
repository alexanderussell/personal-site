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

export function NewsletterWelcome() {
  return (
    <Html lang="en">
      <Head />
      <Preview>You're in — I'll let you know when something new goes up.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={heading}>You're in.</Text>
          <Text style={paragraph}>
            Thanks for subscribing. I write logs, guides, and the occasional
            experiment — things I'm building, figuring out, or just find worth
            documenting.
          </Text>
          <Text style={paragraph}>
            I'll drop you a note when something new goes up. No digest, no
            noise — just a heads up when it's worth your time.
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
            You subscribed via{' '}
            <Link href="https://alexanderussell.com" style={link}>
              alexanderussell.com
            </Link>
            . Reply to this email if you'd like to be removed.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

NewsletterWelcome.PreviewProps = {};

export default NewsletterWelcome;

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
