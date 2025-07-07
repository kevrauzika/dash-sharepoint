// app/api/chamados/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { spfi, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Helper para adicionar o token de autenticação em cada chamada
const AuthBehavior = (accessToken: string) => {
  return (instance: SPFI): SPFI => {
    instance.on.pre(async (url, init) => {
      init.headers = { ...init.headers, 'Authorization': `Bearer ${accessToken}` };
      return [url, init];
    });
    return instance;
  };
};

export async function GET(request: NextRequest) {
  try {
    // 1. Pega o token que o frontend enviou no cabeçalho
    const authorization = request.headers.get("Authorization");
    if (!authorization) {
      return new NextResponse(JSON.stringify({ error: "Token de autorização não fornecido" }), { status: 401 });
    }
    const accessToken = authorization.split(" ")[1]; // Pega só o token, sem o "Bearer "

    const siteUrl = process.env.SHAREPOINT_SITE_URL!;
    const listId = process.env.SHAREPOINT_LIST_ID!;

    // 2. Usa o token do usuário para se conectar
    const sp = spfi(siteUrl).using(AuthBehavior(accessToken));

    const items = await sp.web.lists.getById(listId)
        .items
        .select("Id", "Title", "Status", "Created", "DataConclusao", "SquadResponsavel/Title", "ProdutoServico")
        .expand("SquadResponsavel")();

    return NextResponse.json({ items });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Um erro desconhecido ocorreu";
    console.error("Erro na API Route:", errorMessage);
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}