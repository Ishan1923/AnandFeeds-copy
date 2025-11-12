import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import SessionWrapper from "./SessionWrapper";
import FirebaseAuthHandler from "./FirebaseAuthHandler";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "ANAND FEEDS",
  description: "Anand Feeds",
};

export default function RootLayout({ children }) {
  return (
    // <html lang="en">
    //   <body className={inter.className}>{children}</body>
    // </html>
    <SessionWrapper>
      <FirebaseAuthHandler>
        <html lang="en" suppressHydrationWarning>
          <head />
          <body

            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable
            )}
          >
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </body>
        </html>
      </FirebaseAuthHandler>
    </SessionWrapper>
  );
}
