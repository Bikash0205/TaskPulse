import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { OrganizationProvider } from "@/context/OrganizationContext";

export const metadata: Metadata = {
  title: "TaskPulse | Task Synchronization & Workload Platform",
  description: "Unified enterprise task synchronization and colleague visibility dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#F8FAFF] dark:bg-[#0B0F19] text-[#002055] dark:text-[#F8FAFC] transition-colors duration-200 selection:bg-[#756EF3]/20 selection:text-[#756EF3]">
        <ThemeProvider>
          <AuthProvider>
            <OrganizationProvider>{children}</OrganizationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
