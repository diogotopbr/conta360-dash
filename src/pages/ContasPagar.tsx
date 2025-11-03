import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar, DollarSign, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";

const contasPagar = [
  { id: 1, fornecedor: "Fornecedor ABC Ltda", valor: 15000, vencimento: "2024-01-20", categoria: "Operacional", status: "Pendente" },
  { id: 2, fornecedor: "Energia Elétrica S.A.", valor: 3200, vencimento: "2024-01-15", categoria: "Utilidades", status: "Vencido" },
  { id: 3, fornecedor: "Aluguel Comercial", valor: 12000, vencimento: "2024-01-10", categoria: "Imóveis", status: "Pago" },
  { id: 4, fornecedor: "Internet e Telefonia", valor: 890, vencimento: "2024-01-18", categoria: "Tecnologia", status: "Pendente" },
  { id: 5, fornecedor: "Material de Escritório", valor: 2400, vencimento: "2024-01-22", categoria: "Operacional", status: "Pendente" },
  { id: 6, fornecedor: "Contador Mensal", valor: 5000, vencimento: "2024-01-25", categoria: "Serviços", status: "Agendado" },
];

export default function ContasPagar() {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", icon: any }> = {
      Pendente: { variant: "secondary", icon: Clock },
      Vencido: { variant: "destructive", icon: AlertCircle },
      Pago: { variant: "default", icon: CheckCircle2 },
      Agendado: { variant: "outline", icon: Calendar },
    };
    const { variant, icon: Icon } = variants[status] || variants.Pendente;
    
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <DashboardLayout
      title="Contas a Pagar"
      subtitle="Gerencie todas as despesas e compromissos financeiros"
    >
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard
          title="Total a Pagar"
          value="R$ 38.490,00"
          icon={DollarSign}
          trend="neutral"
        />
        <MetricCard
          title="Vencendo em 7 dias"
          value="R$ 18.290,00"
          icon={Clock}
          trend="neutral"
          className="border-warning"
        />
        <MetricCard
          title="Vencidas"
          value="R$ 3.200,00"
          icon={AlertCircle}
          trend="down"
          className="border-destructive"
        />
        <MetricCard
          title="Pagas este mês"
          value="R$ 12.000,00"
          icon={CheckCircle2}
          trend="up"
        />
      </div>

      {/* Actions and Filters */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por fornecedor, categoria..." className="pl-10" />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Conta
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contasPagar.map((conta) => (
              <div
                key={conta.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-4"
              >
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{conta.fornecedor}</h4>
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
                    <p className="text-xl font-semibold number-animation">
                      {conta.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  
                  {getStatusBadge(conta.status)}
                  
                  <Button variant="outline" size="sm">
                    {conta.status === "Pago" ? "Ver Comprovante" : "Pagar"}
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
