# AWS Cloud Club - SRMIST Website

Official website of AWS Cloud Club at SRM Institute of Science and Technology, built with Next.js 16.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── events/            # Events page
│   ├── gallery/           # Gallery page
│   ├── join/              # Join page
│   ├── resources/         # Resources page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── client-layout.tsx  # Client-side layout wrapper
│   └── page.tsx           # Home page
├── Components/            # Reusable React components
├── assets/               # Static assets (animations, images)
└── firebase.js           # Firebase configuration
```

## Features

- **Next.js 16** with App Router and Turbopack (5-10x faster builds!)
- **React 19** with modern hooks
- **TypeScript** support
- **Responsive Design** with Bootstrap
- **Animated Cursor** for desktop users
- **Firebase Integration**
- **Lottie Animations**
- **Image Gallery** with carousel
- **FAQ Section** with accordion
- **Team Profiles** and statistics

## Scripts

- `npm run dev` - Start development server (with Turbopack)
- `npm run build` - Build for production (with Turbopack)
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- Next.js 16 (with Turbopack)
- React 19
- TypeScript
- Bootstrap 5
- Firebase
- Lottie React
- React Icons
- React Image Gallery
- React Slick Carousel

## What's New in Next.js 16

- **Turbopack by Default**: 5-10x faster Fast Refresh and 2-5x faster production builds
- **Enhanced Caching**: Smart caching strategies for better performance
- **React 19 Integration**: Full support for React 19 features
- **Improved Developer Experience**: Better error messages and debugging tools

## Deployment

The project is configured for deployment on Vercel. Simply connect your repository to Vercel for automatic deployments.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request