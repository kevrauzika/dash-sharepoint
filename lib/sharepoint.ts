// lib/sharepoint.ts

// A função agora aceita um token para enviar para a API
export const getChamados = async (accessToken: string): Promise<any[]> => {
    try {
        const response = await fetch('/api/chamados', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro no servidor da API');
        }
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Erro ao buscar chamados:", error);
        throw error;
    }
};