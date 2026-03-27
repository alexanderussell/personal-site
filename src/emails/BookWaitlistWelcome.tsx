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
            I'm building a framework for making UX decisions in the era of AI —
            part book, part course, part hands-on toolkit. It's rooted in the
            workflows and skills I use every day to ship real products with AI.
          </Text>
          <Text style={paragraph}>
            This is still taking shape, and your interest helps me know it's
            worth building. I'll reach out when there's something concrete — no
            spam, no filler.
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
