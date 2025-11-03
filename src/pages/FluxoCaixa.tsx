import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

const cashFlowData = [
  { month: "Jul", entradas: 45000, saidas: 32000, saldo: 13000 },
  { month: "Ago", entradas: 52000, saidas: 38000, saldo: 14000 },
  { month: "Set", entradas: 48000, saidas: 35000, saldo: 13000 },
  { month: "Out", entradas: 61000, saidas: 42000, saldo: 19000 },
  { month: "Nov", entradas: 55000, saidas: 39000, saldo: 16000 },
  { month: "Dez", entradas: 67000, saidas: 45000, saldo: 22000 },
];

const projectionData = [
  { month: "Jan", real: 22000, projetado: 22000 },
  { month: "Fev", real: null, projetado: 24000 },
  { month: "Mar", real: null, projetado: 26500 },
  { month: "Abr", real: null, projetado: 28000 },
  { month: "Mai", real: null, projetado: 30000 },
  { month: "Jun", real: null, projetado: 32000 },
];

export default function FluxoCaixa() {
  return (
    <DashboardLayout
      title="Fluxo de Caixa"
      subtitle="Análise detalhada de entradas, saídas e projeções financeiras"
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Select defaultValue="semestre">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mes">Último Mês</SelectItem>
            <SelectItem value="trimestre">Último Trimestre</SelectItem>
            <SelectItem value="semestre">Último Semestre</SelectItem>
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
            Exportar DRE
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="hover-lift border-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Entradas
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success number-animation">R$ 328.000,00</div>
            <p className="text-xs text-muted-foreground mt-2">Últimos 6 meses</p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Saídas
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive number-animation">R$ 231.000,00</div>
            <p className="text-xs text-muted-foreground mt-2">Últimos 6 meses</p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Líquido
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold number-animation">R$ 97.000,00</div>
            <p className="text-xs text-success mt-2">+42.0% vs período anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart */}
      <Card className="hover-lift mb-6">
        <CardHeader>
          <CardTitle>Evolução do Fluxo de Caixa</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number) =>
                  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                }
              />
              <Legend />
              <Bar dataKey="entradas" fill="hsl(142, 76%, 36%)" name="Entradas" radius={[8, 8, 0, 0]} />
              <Bar dataKey="saidas" fill="hsl(0, 72%, 51%)" name="Saídas" radius={[8, 8, 0, 0]} />
              <Bar dataKey="saldo" fill="hsl(218, 70%, 32%)" name="Saldo" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Projection Chart */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Projeção de Saldo - Próximos 6 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number) =>
                  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                }
              />
              <Legend />
              <ReferenceLine y={0} stroke="hsl(var(--border))" />
              <Line
                type="monotone"
                dataKey="real"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={3}
                name="Real"
                dot={{ fill: "hsl(142, 76%, 36%)", r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="projetado"
                stroke="hsl(218, 70%, 32%)"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Projetado"
                dot={{ fill: "hsl(218, 70%, 32%)", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            * Projeção baseada na média dos últimos 6 meses e tendências históricas
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
