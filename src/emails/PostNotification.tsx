import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Hr,
  Link,
  Button,
  Markdown,
} from '@react-email/components';
import * as React from 'react';
import { body, container, heading, paragraph, hr, footer, unsubscribe, link } from './styles';

interface PostNotificationProps {
  title: string;
  type: 'log' | 'guide' | 'experiment';
  description: string;
  content?: string;
  url: string;
}

export function PostNotification({
  title = 'New Post',
  type = 'log',
  description = '',
  content,
  url = 'https://alexanderussell.com',
}: PostNotificationProps) {
  const isExperiment = type === 'experiment';
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <Html lang="en">
      <Head />
      <Preview>{title} — new {type} from Alex Russell</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={typeTag}>{typeLabel}</Text>
          <Text style={heading}>{title}</Text>

          {isExperiment ? (
            <>
              <Text style={paragraph}>{description}</Text>
              <Button href={url} style={ctaButton}>
                View Experiment
              </Button>
            </>
          ) : (
            <>
              {content ? (
                <Markdown markdownContainerStyles={markdownContainer} markdownCustomStyles={markdownStyles}>
                  {content}
                </Markdown>
              ) : (
                <Text style={paragraph}>{description}</Text>
              )}
              <Hr style={hr} />
              <Text style={{ ...paragraph, fontSize: '13px', opacity: 0.7 }}>
                <Link href={url} style={link}>Read on the site →</Link>
              </Text>
            </>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            — Alex
            {'  '}
            <Link href="https://alexanderussell.com" style={link}>
              alexanderussell.com
            </Link>
          </Text>
          <Text style={unsubscribe}>
            You're getting this because you subscribed to the logs newsletter.
            Reply to this email if you'd like to be removed.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const typeTag: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", "Courier New", monospace',
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#a09a8f',
  margin: '0 0 8px',
};

const ctaButton: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", "Courier New", monospace',
  fontSize: '12px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  backgroundColor: '#1c1a17',
  color: '#ffffff',
  padding: '10px 24px',
  borderRadius: '4px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 0',
};

const markdownContainer: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: '#555047',
};

const markdownStyles = {
  p: { margin: '0 0 16px' },
  h1: { fontSize: '20px', fontWeight: '600', color: '#1c1a17', margin: '24px 0 12px' },
  h2: { fontSize: '18px', fontWeight: '600', color: '#1c1a17', margin: '20px 0 10px' },
  h3: { fontSize: '16px', fontWeight: '600', color: '#1c1a17', margin: '16px 0 8px' },
  a: { color: '#0d9b6d', textDecoration: 'none' },
  code: { fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', backgroundColor: '#f0ede8', padding: '2px 5px', borderRadius: '3px' },
  blockquote: { borderLeft: '3px solid #e0dbd3', paddingLeft: '16px', margin: '0 0 16px', color: '#777066' },
  ul: { margin: '0 0 16px', paddingLeft: '20px' },
  ol: { margin: '0 0 16px', paddingLeft: '20px' },
  li: { margin: '0 0 4px' },
  img: { maxWidth: '100%', borderRadius: '6px' },
};

PostNotification.PreviewProps = {
  title: 'We Swapped the Motor',
  type: 'log' as const,
  description: 'A story about fixing what was broken.',
  content: 'This is the **full post content** rendered as markdown.\n\nIt supports headings, lists, and code.',
  url: 'https://alexanderussell.com/logs/we-swapped-the-motor',
};

export default PostNotification;
