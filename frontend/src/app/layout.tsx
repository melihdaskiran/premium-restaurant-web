import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

async function getSettings() {
  try {
    const res = await fetch("http://localhost:5092/api/settings", { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings?.name ? `${settings.name} | Premium Dining` : "L'Etoile | Premium Dining";
  return {
    title,
    description: `Experience the pinnacle of culinary excellence at ${settings?.name || "L'Etoile"}.`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  
  // Custom Color Override Logic
  let customStyle = "";
  if (settings?.primaryColor) {
    // Tailwind v4 uses standard CSS variables. We can simply override the --accent variable.
    // However, tailwind classes might expect OKLCH, but browsers will accept HEX for var(--accent) if we apply it to root.
    customStyle = `
      :root, .dark {
        --accent: ${settings.primaryColor} !important;
      }
    `;
  }

  return (
    <html lang="en" className={`dark ${inter.variable} ${playfair.variable}`}>
      <head>
        {customStyle && <style>{customStyle}</style>}
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        {children}
      </body>
    </html>
  );
}
