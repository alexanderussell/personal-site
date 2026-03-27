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
import { body, container, heading, paragraph, hr, footer, unsubscribe, link } from './styles';

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
