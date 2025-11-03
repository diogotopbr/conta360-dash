import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar, DollarSign, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";

const contasReceber = [
  { id: 1, cliente: "Cliente Premium Ltda", valor: 28000, vencimento: "2024-01-18", categoria: "Serviços", status: "Pendente" },
  { id: 2, cliente: "Empresa Tech Solutions", valor: 15500, vencimento: "2024-01-12", categoria: "Consultoria", status: "Vencido" },
  { id: 3, cliente: "Comércio Nacional S.A.", valor: 42000, vencimento: "2024-01-08", categoria: "Produtos", status: "Recebido" },
  { id: 4, cliente: "Indústria Master", valor: 19000, vencimento: "2024-01-20", categoria: "Serviços", status: "Pendente" },
  { id: 5, cliente: "Startup Digital", valor: 8500, vencimento: "2024-01-22", categoria: "Assinatura", status: "Agendado" },
];

export default function ContasReceber() {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", icon: any, className?: string }> = {
      Pendente: { variant: "secondary", icon: Clock },
      Vencido: { variant: "destructive", icon: AlertCircle },
      Recebido: { variant: "default", icon: CheckCircle2, className: "bg-success text-success-foreground" },
      Agendado: { variant: "outline", icon: Calendar },
    };
    const config = variants[status] || variants.Pendente;
    
    return (
      <Badge variant={config.variant} className={`gap-1 ${config.className || ""}`}>
        <config.icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <DashboardLayout
      title="Contas a Receber"
      subtitle="Acompanhe seus recebíveis e mantenha o fluxo de caixa saudável"
    >
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard
          title="Total a Receber"
          value="R$ 113.000,00"
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Vencendo em 7 dias"
          value="R$ 47.000,00"
          icon={Clock}
          trend="neutral"
          className="border-warning"
        />
        <MetricCard
          title="Em Atraso"
          value="R$ 15.500,00"
          icon={AlertCircle}
          trend="down"
          className="border-destructive"
        />
        <MetricCard
          title="Recebido este mês"
          value="R$ 42.000,00"
          icon={CheckCircle2}
          trend="up"
          className="border-success"
        />
      </div>

      {/* Actions and Filters */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por cliente, categoria..." className="pl-10" />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Recebível
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas a Receber</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contasReceber.map((conta) => (
              <div
                key={conta.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-4"
              >
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{conta.cliente}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Venc: {conta.vencimento}
                    </span>
                    <span>•</span>
                    <span>{conta.categoria}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-semibold text-success number-animation">
                      {conta.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  
                  {getStatusBadge(conta.status)}
                  
                  <Button variant="outline" size="sm">
                    {conta.status === "Recebido" ? "Ver Detalhes" : "Registrar"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
