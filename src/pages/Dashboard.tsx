import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Download,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Dados de exemplo
const cashFlowData = [
  { month: "Jan", entrada: 45000, saida: 32000 },
  { month: "Fev", entrada: 52000, saida: 38000 },
  { month: "Mar", entrada: 48000, saida: 35000 },
  { month: "Abr", entrada: 61000, saida: 42000 },
  { month: "Mai", entrada: 55000, saida: 39000 },
  { month: "Jun", entrada: 67000, saida: 45000 },
];

const categoryData = [
  { name: "Operacional", value: 45, color: "hsl(218, 70%, 32%)" },
  { name: "Pessoal", value: 30, color: "hsl(174, 100%, 21%)" },
  { name: "Marketing", value: 15, color: "hsl(142, 76%, 36%)" },
  { name: "Outros", value: 10, color: "hsl(220, 13%, 70%)" },
];

const recentTransactions = [
  { id: 1, description: "Pagamento Fornecedor A", value: -15000, date: "2024-01-15", category: "Operacional", status: "Conciliado" },
  { id: 2, description: "Recebimento Cliente B", value: 22000, date: "2024-01-14", category: "Vendas", status: "Conciliado" },
  { id: 3, description: "Salários Janeiro", value: -45000, date: "2024-01-10", category: "Pessoal", status: "Pendente" },
  { id: 4, description: "Venda Produto C", value: 8500, date: "2024-01-09", category: "Vendas", status: "Conciliado" },
  { id: 5, description: "Aluguel Janeiro", value: -12000, date: "2024-01-05", category: "Operacional", status: "Conciliado" },
];

export default function Dashboard() {
  return (
    <DashboardLayout
      title="Visão Geral"
      subtitle="Acompanhe as principais métricas financeiras da sua empresa"
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Select defaultValue="todos">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecionar Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Clientes</SelectItem>
            <SelectItem value="empresa-a">Empresa A</SelectItem>
            <SelectItem value="empresa-b">Empresa B</SelectItem>
            <SelectItem value="empresa-c">Empresa C</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="mes">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semana">Última Semana</SelectItem>
            <SelectItem value="mes">Último Mês</SelectItem>
            <SelectItem value="trimestre">Último Trimestre</SelectItem>
            <SelectItem value="ano">Último Ano</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Personalizar
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard
          title="Saldo Total"
          value="R$ 124.500,00"
          change={12.5}
          changeLabel="vs. mês anterior"
          icon={Wallet}
          trend="up"
        />
        <MetricCard
          title="Entradas"
          value="R$ 67.000,00"
          change={8.2}
          changeLabel="vs. mês anterior"
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          title="Saídas"
          value="R$ 45.000,00"
          change={3.1}
          changeLabel="vs. mês anterior"
          icon={TrendingDown}
          trend="down"
        />
        <MetricCard
          title="Projeção 30 dias"
          value="R$ 98.200,00"
          changeLabel="baseado no histórico"
          icon={DollarSign}
          trend="neutral"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Cash Flow Chart */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Fluxo de Caixa</span>
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="entrada"
                  stroke="hsl(142, 76%, 36%)"
                  fillOpacity={1}
                  fill="url(#colorEntrada)"
                  name="Entradas"
                />
                <Area
                  type="monotone"
                  dataKey="saida"
                  stroke="hsl(0, 72%, 51%)"
                  fillOpacity={1}
                  fill="url(#colorSaida)"
                  name="Saídas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transações Recentes</span>
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.value > 0 ? "bg-success-light" : "bg-destructive-light"
                    }`}
                  >
                    {transaction.value > 0 ? (
                      <TrendingUp className="h-5 w-5 text-success" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <span>{transaction.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-semibold number-animation ${
                      transaction.value > 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {transaction.value > 0 ? "+" : ""}
                    {transaction.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      transaction.status === "Conciliado"
                        ? "bg-success-light text-success"
                        : "bg-warning-light text-warning"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="mt-6 border-warning bg-warning-light/10">
        <CardContent className="flex items-start gap-4 pt-6">
          <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <h4 className="font-semibold text-warning mb-1">Atenção: 3 contas a vencer</h4>
            <p className="text-sm text-muted-foreground">
              Você tem 3 contas a pagar que vencem nos próximos 7 dias. Clique aqui para revisar.
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
