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
