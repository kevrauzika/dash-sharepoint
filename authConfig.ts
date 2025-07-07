// authConfig.ts

import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
    auth: {
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
        authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_TENANT_ID}`,
        redirectUri: "/"
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

// Permissões que vamos pedir ao usuário. "User.Read" é o básico.
// A outra é a permissão para ler os dados do SharePoint em nome do usuário.
export const loginRequest = {
    scopes: ["User.Read", "https://tmbeducacao.sharepoint.com/Sites.Read.All"]
};