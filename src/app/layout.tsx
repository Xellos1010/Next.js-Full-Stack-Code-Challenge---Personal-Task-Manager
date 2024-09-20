// personal-task-manager/src/app/layout.tsx 
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AppProviders from '@/providers/app-providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blen Fullstack Challenge',
  description: 'A simple task management app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    < html lang="en" >
      < body className={inter.className} >
        < AppProviders > {children} </ AppProviders >
      </ body >
    </ html >
  );
}
