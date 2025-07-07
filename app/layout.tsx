// app/layout.tsx

"use client"; // Precisa ser um client component para usar o provedor

import "./globals.css";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../authConfig"; // Importa nossa configuração

const msalInstance = new PublicClientApplication(msalConfig);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MsalProvider instance={msalInstance}>
          {children}
        </MsalProvider>
      </body>
    </html>
  );
}