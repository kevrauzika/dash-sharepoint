"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Package, TrendingUp, Clock, ExternalLink, BarChart3, Activity } from "lucide-react"
import { format, isWeekend, parseISO, eachDayOfInterval, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  AreaChart,
} from "recharts"

// Dados mockados simulando a lista do SharePoint
const mockData = [
  {
    id: 1,
    titulo: "Sistema de login não funciona",
    status: "Aberto",
    dataAbertura: "2024-01-15T08:30:00",
    dataConclusao: null,
    squadResponsavel: "Squad Frontend",
    produtoServico: "Portal Web",
  },
  {
    id: 2,
    titulo: "Erro na integração de pagamento",
    status: "Em Andamento",
    dataAbertura: "2024-01-14T14:20:00",
    dataConclusao: null,
    squadResponsavel: "Squad Backend",
    produtoServico: "API Pagamentos",
  },
  {
    id: 3,
    titulo: "Relatório não gera PDF",
    status: "Concluído",
    dataAbertura: "2024-01-13T09:15:00",
    dataConclusao: "2024-01-14T16:45:00",
    squadResponsavel: "Squad Reports",
    produtoServico: "Sistema Relatórios",
  },
  {
    id: 4,
    titulo: "App mobile crashando",
    status: "Pendente",
    dataAbertura: "2024-01-13T11:00:00",
    dataConclusao: null,
    squadResponsavel: "Squad Mobile",
    produtoServico: "App Mobile",
  },
  {
    id: 5,
    titulo: "Base de dados lenta",
    status: "Em Andamento",
    dataAbertura: "2024-01-12T16:30:00",
    dataConclusao: null,
    squadResponsavel: "Squad Infra",
    produtoServico: "Banco de Dados",
  },
  {
    id: 6,
    titulo: "Email não enviando",
    status: "Concluído",
    dataAbertura: "2024-01-12T10:20:00",
    dataConclusao: "2024-01-13T14:30:00",
    squadResponsavel: "Squad Backend",
    produtoServico: "Serviço Email",
  },
  {
    id: 7,
    titulo: "Interface quebrada no Safari",
    status: "Aberto",
    dataAbertura: "2024-01-14T13:45:00",
    dataConclusao: null,
    squadResponsavel: "Squad Frontend",
    produtoServico: "Portal Web",
  },
  {
    id: 8,
    titulo: "Backup falhou",
    status: "Cancelado",
    dataAbertura: "2024-01-11T22:00:00",
    dataConclusao: null,
    squadResponsavel: "Squad Infra",
    produtoServico: "Sistema Backup",
  },
  {
    id: 9,
    titulo: "Performance lenta na API",
    status: "Concluído",
    dataAbertura: "2024-01-10T15:20:00",
    dataConclusao: "2024-01-11T10:15:00",
    squadResponsavel: "Squad Backend",
    produtoServico: "API Core",
  },
  {
    id: 10,
    titulo: "Erro de validação no formulário",
    status: "Aberto",
    dataAbertura: "2024-01-09T09:30:00",
    dataConclusao: null,
    squadResponsavel: "Squad Frontend",
    produtoServico: "Portal Web",
  },
  {
    id: 11,
    titulo: "Notificações push não funcionam",
    status: "Em Andamento",
    dataAbertura: "2024-01-08T14:45:00",
    dataConclusao: null,
    squadResponsavel: "Squad Mobile",
    produtoServico: "App Mobile",
  },
  {
    id: 12,
    titulo: "Sincronização de dados falhou",
    status: "Concluído",
    dataAbertura: "2024-01-07T11:20:00",
    dataConclusao: "2024-01-08T16:30:00",
    squadResponsavel: "Squad Infra",
    produtoServico: "Sistema Sync",
  },
]

const statusColors = {
  Aberto: "bg-blue-100 text-blue-800 border-blue-200",
  "Em Andamento": "bg-gray-100 text-gray-800 border-gray-200",
  Pendente: "bg-black text-white border-black",
  Concluído: "bg-white text-black border-black",
  Cancelado: "bg-gray-50 text-gray-600 border-gray-300",
}

export default function SharePointDashboard() {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroSquad, setFiltroSquad] = useState<string>("todos")
  const [filtroProduto, setFiltroProduto] = useState<string>("todos")
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("7dias")

  // Filtrar dados baseado nos filtros selecionados
  const dadosFiltrados = useMemo(() => {
    let dados = mockData

    if (filtroStatus !== "todos") {
      dados = dados.filter((item) => item.status === filtroStatus)
    }

    if (filtroSquad !== "todos") {
      dados = dados.filter((item) => item.squadResponsavel === filtroSquad)
    }

    if (filtroProduto !== "todos") {
      dados = dados.filter((item) => item.produtoServico === filtroProduto)
    }

    // Filtro de período
    if (filtroPeriodo === "7dias") {
      const seteDiasAtras = new Date()
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)
      dados = dados.filter((item) => new Date(item.dataAbertura) >= seteDiasAtras)
    } else if (filtroPeriodo === "30dias") {
      const trintaDiasAtras = new Date()
      trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30)
      dados = dados.filter((item) => new Date(item.dataAbertura) >= trintaDiasAtras)
    }

    return dados
  }, [filtroStatus, filtroSquad, filtroProduto, filtroPeriodo])

  // Calcular KPIs
  const kpis = useMemo(() => {
    const chamadosAbertos = dadosFiltrados.filter((item) => item.status !== "Concluído" && item.status !== "Cancelado")
    const chamadosFimSemana = dadosFiltrados.filter((item) => isWeekend(parseISO(item.dataAbertura)))
    const diasUnicos = new Set(dadosFiltrados.map((item) => format(parseISO(item.dataAbertura), "yyyy-MM-dd"))).size
    const mediaDiaria = diasUnicos > 0 ? (dadosFiltrados.length / diasUnicos).toFixed(1) : "0"

    return {
      mediaDiaria,
      totalFimSemana: chamadosFimSemana.length,
      totalAbertos: chamadosAbertos.length,
      totalChamados: dadosFiltrados.length,
    }
  }, [dadosFiltrados])

  // Dados para gráfico de linha temporal
  const dadosTemporais = useMemo(() => {
    const dias = eachDayOfInterval({
      start: subDays(new Date(), 14),
      end: new Date(),
    })

    return dias.map((dia) => {
      const diaStr = format(dia, "yyyy-MM-dd")
      const chamadosAbertos = dadosFiltrados.filter(
        (item) => format(parseISO(item.dataAbertura), "yyyy-MM-dd") === diaStr,
      ).length

      const chamadosConcluidos = dadosFiltrados.filter(
        (item) => item.dataConclusao && format(parseISO(item.dataConclusao), "yyyy-MM-dd") === diaStr,
      ).length

      return {
        data: format(dia, "dd/MM"),
        abertos: chamadosAbertos,
        concluidos: chamadosConcluidos,
        acumulado: chamadosAbertos - chamadosConcluidos,
      }
    })
  }, [dadosFiltrados])

  // Dados para gráficos por categoria
  const dadosPorSquad = useMemo(() => {
    const contagem = dadosFiltrados.reduce(
      (acc, item) => {
        acc[item.squadResponsavel] = (acc[item.squadResponsavel] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(contagem).map(([squad, count]) => ({
      squad: squad.replace("Squad ", ""),
      count,
    }))
  }, [dadosFiltrados])

  const dadosPorProduto = useMemo(() => {
    const contagem = dadosFiltrados.reduce(
      (acc, item) => {
        acc[item.produtoServico] = (acc[item.produtoServico] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(contagem)
      .map(([produto, count]) => ({ produto, count }))
      .sort((a, b) => b.count - a.count)
  }, [dadosFiltrados])

  const chamadosAtivos = dadosFiltrados.filter((item) => item.status !== "Concluído" && item.status !== "Cancelado")

  const squads = [...new Set(mockData.map((item) => item.squadResponsavel))]
  const produtos = [...new Set(mockData.map((item) => item.produtoServico))]
  const statusList = [...new Set(mockData.map((item) => item.status))]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-3">Dashboard de Chamados</h1>
          <p className="text-blue-100 text-lg">Painel interativo para análise e visualização de chamados de suporte</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Filtros de Análise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Período</label>
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="todos">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {statusList.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Squad</label>
              <Select value={filtroSquad} onValueChange={setFiltroSquad}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  {squads.map((squad) => (
                    <SelectItem key={squad} value={squad}>
                      {squad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Produto</label>
              <Select value={filtroProduto} onValueChange={setFiltroProduto}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {produtos.map((produto) => (
                    <SelectItem key={produto} value={produto}>
                      {produto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-600 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Média Diária de Chamados</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{kpis.mediaDiaria}</div>
              <p className="text-xs text-gray-600 mt-1">chamados por dia</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-black shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Chamados Fim de Semana</CardTitle>
              <Calendar className="h-5 w-5 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{kpis.totalFimSemana}</div>
              <p className="text-xs text-gray-600 mt-1">sábados e domingos</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-400 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Chamados Abertos</CardTitle>
              <Clock className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{kpis.totalAbertos}</div>
              <p className="text-xs text-gray-600 mt-1">aguardando resolução</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-600 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total de Chamados</CardTitle>
              <Package className="h-5 w-5 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{kpis.totalChamados}</div>
              <p className="text-xs text-gray-600 mt-1">no período selecionado</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Linha Temporal */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Tendência de Chamados - Últimos 15 Dias
            </CardTitle>
            <CardDescription className="text-gray-600">
              Comparação entre chamados abertos e concluídos ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dadosTemporais}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="data" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="abertos" fill="#3b82f6" name="Chamados Abertos" />
                  <Line
                    type="monotone"
                    dataKey="concluidos"
                    stroke="#1f2937"
                    strokeWidth={3}
                    name="Chamados Concluídos"
                    dot={{ fill: "#1f2937", strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos de Análise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chamados por Squad - Gráfico de Área */}
          <Card className="shadow-lg border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Chamados por Squad
              </CardTitle>
              <CardDescription className="text-gray-600">
                Distribuição de carga de trabalho entre as equipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dadosPorSquad}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="squad" stroke="#666" fontSize={11} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                      name="Chamados"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Chamados por Produto - Gráfico de Linha */}
          <Card className="shadow-lg border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2 text-black" />
                Chamados por Produto/Serviço
              </CardTitle>
              <CardDescription className="text-gray-600">Produtos que geram mais chamados de suporte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosPorProduto}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="produto" stroke="#666" fontSize={10} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#1f2937"
                      strokeWidth={3}
                      name="Chamados"
                      dot={{ fill: "#1f2937", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Chamados Ativos */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <ExternalLink className="h-5 w-5 mr-2 text-blue-600" />
              Chamados Ativos
            </CardTitle>
            <CardDescription className="text-gray-600">
              Chamados que precisam de atenção (excluindo concluídos e cancelados)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 font-bold text-gray-900">ID</th>
                    <th className="text-left p-3 font-bold text-gray-900">Título</th>
                    <th className="text-left p-3 font-bold text-gray-900">Status</th>
                    <th className="text-left p-3 font-bold text-gray-900">Data Abertura</th>
                    <th className="text-left p-3 font-bold text-gray-900">Squad</th>
                    <th className="text-left p-3 font-bold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {chamadosAtivos.map((chamado, index) => (
                    <tr
                      key={chamado.id}
                      className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="p-3">
                        <Button variant="link" className="p-0 h-auto font-bold text-blue-600 hover:text-blue-800">
                          #{chamado.id}
                        </Button>
                      </td>
                      <td className="p-3 font-medium text-gray-900">{chamado.titulo}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[chamado.status]}`}
                        >
                          {chamado.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700">
                        {format(parseISO(chamado.dataAbertura), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </td>
                      <td className="p-3 text-gray-700">{chamado.squadResponsavel}</td>
                      <td className="p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {chamadosAtivos.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhum chamado ativo encontrado</p>
                  <p className="text-sm">Tente ajustar os filtros selecionados.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
