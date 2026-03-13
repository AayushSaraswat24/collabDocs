import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/providers/session";
import {ThemeProvider} from "@/providers/themeProvider";
import { Navbar } from "@/components/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CollabDocs",
    template: "%s | CollabDocs",
  },
  description:
    "CollabDocs is a real-time collaborative document editor with live cursors, AI-powered writing tools, and seamless multi-user editing.",

  applicationName: "CollabDocs",

  keywords: [
    "collaborative editor",
    "real-time editing",
    "yjs",
    "tiptap editor",
    "collaboration tool",
  ],

  authors: [{ name: "Aayush Saraswat" }],

  creator: "Aayush Saraswat",


  openGraph: {
    title: "CollabDocs",
    description:
      "A real-time collaborative document editor with AI tools and live cursor presence.",
    siteName: "CollabDocs",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CollabDocs",
    description:
      "Real-time collaborative editor with AI tools and live cursors.",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  }

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  `}
      >
        <div className="flex h-screen flex-col ">

        <ThemeProvider>

        <Provider>

          <Navbar />

        <div className="flex flex-col flex-1 min-h-0  ">

         {children}

        </div>
        
          <Toaster 
          position="top-center"
          richColors
          closeButton
          duration={2000}
          />
        </Provider>

        </ThemeProvider>

        </div>

      </body>
    </html>
  );
}
