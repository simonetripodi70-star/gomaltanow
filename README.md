This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Configure the private AI Writer

The prototype is available at `http://localhost:3000/admin/ai-writer`. It is protected with HTTP Basic Authentication and calls OpenAI only from the server-side route, so the API key is never sent to the browser.

Add these values to `.env.local` in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
AI_WRITER_ADMIN_USERNAME=admin
AI_WRITER_ADMIN_PASSWORD=choose-a-long-unique-password
```

Do not prefix the API key with `NEXT_PUBLIC_`: variables with that prefix can be included in browser code. `.env.local` is already ignored by Git.

After saving the file, stop and restart the development server with `npm run dev`. Open `/admin/ai-writer`, enter the admin credentials when prompted, then submit a topic, category, approved sources, instructions and language. The draft is displayed on screen only; this prototype does not save anything to Supabase.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
