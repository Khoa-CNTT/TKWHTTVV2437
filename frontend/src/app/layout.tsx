import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import { AuthProvider } from "./contexts/AuthContext";
import { CheckoutProvider } from "./contexts/CheckoutContext";
import { ReservationProvider } from "./contexts/ReservationContext";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Love Trip",
  description: "Nơi tìm kiếm những khoảnh khắc đáng nhớ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <CheckoutProvider>
          <ReservationProvider>
            <body className={`font-roboto antialiased `}>
              <Header />
              <div>
                {children}{" "}
                <ToastContainer position="top-right" autoClose={3000} />
              </div>
            </body>
          </ReservationProvider>
        </CheckoutProvider>
      </AuthProvider>
    </html>
  );
}
