# alexanderrussell.com

Personal site and portfolio of Alex Russell — notes, guides, and experiments on design, engineering, and the things in between.

Built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), and [MDX](https://mdxjs.com/).

## Structure

```
src/
  content/
    notes/         # Short-form writing
    guides/        # Long-form tutorials and walkthroughs
    experiments/   # Interactive demos (Bricklayer, Generative Logo, Hold to Provision)
  components/      # Astro components including experiment renderers
  layouts/         # Base and post layouts
  pages/           # Route pages
  styles/          # Global CSS and Tailwind config
public/
  fonts/           # Self-hosted typefaces (Inter, JetBrains Mono)
  images/          # Static images
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Stack

- **Framework**: Astro 5
- **Styling**: Tailwind CSS 4 + @tailwindcss/typography
- **Content**: MDX with Shiki syntax highlighting
- **Fonts**: Inter (sans), JetBrains Mono (mono)
- **Analytics**: Vercel Analytics + Speed Insights
- **Hosting**: Vercel
