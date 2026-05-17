import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LuminaSkin | AI Skincare Consultant',
  description: 'Professional skincare curated by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Toaster position="bottom-right" /> 
          {children}
        </CartProvider>
      </body>
    </html>
  );
}