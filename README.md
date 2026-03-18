# IUBIP Hub - Student Digital Hub

Website for the Student Digital Hub of Southern University (IUBiP), Rostov-on-Don.

## Technologies

- **Next.js 16.1.6** - React framework
- **React 19.1.0** - UI library
- **TypeScript 5** - type safety
- **Tailwind CSS 4.2.1** - styling
- **Zustand 5.0.11** - state management
- **Framer Motion 12.35.2** - animations
- **Swiper 12.1.2** - slider component

## Requirements

- Node.js 18+
- npm, yarn, pnpm or bun

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Fxshtro/webSiteForHub.git
cd webSiteForHub
```

2. Install dependencies:

```bash
npm install
```

## Running the Project

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Code Quality

```bash
npm run lint
npm run lint:fix
npm run format
```

## Project Structure

```
webSiteForHub/
├── app/
│   ├── auth/             # Authentication page
│   ├── components/       # React components
│   ├── main/             # Main page
│   ├── store/            # Zustand stores
│   ├── globals.css       # Global styles
│   └── favicon.ico
├── public/               # Static assets
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.ts    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## Deployment

The easiest way to deploy the project is to use the [Vercel Platform](https://vercel.com/new).

Learn more about Next.js deployment: [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)

## License

Private project — Southern University (IUBiP) © 2026
