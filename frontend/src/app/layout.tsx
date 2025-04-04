import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import { AuthProvider } from "./contexts/AuthContext";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`font-roboto antialiased`}>
          <Header />
          <div className="bg-gray-100 ">{children}</div>
        </body>
      </AuthProvider>
    </html>
  );
}
