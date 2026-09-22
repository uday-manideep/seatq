import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SeatQ",
  description: "Restaurant virtual queue platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
