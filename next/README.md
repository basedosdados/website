This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First: Use docker compose, or source .env and follow steps below.

run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Translation (also called i18n)

We are using the lib next-18next which is based on i18next. Here is how to use it:


0 - If your component is a page-level components: See https://github.com/i18next/next-i18next?tab=readme-ov-file#serversidetranslations

1- In your component import the function `t` by calling 

    import { useTranslation } from 'next-i18next'
    ...
    function Component() {
        const { t } = useTranslate(namespace)
        ....

where namespace is the namespace of the translation (see more below).
Do NOT use the useTranslation export of react-i18next, but ONLY use the one from next-i18next!

2-  Add your translations at the namespace file located public/locales/{namespace}.json

3- Test by going to http://localhost:3000/en

### Advanced stuff

Dealing with plurals: https://www.i18next.com/translation-function/plurals
Dealing with interpolations: https://www.i18next.com/translation-function/interpolation

https://www.i18next.com/translation-function/plurals

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
