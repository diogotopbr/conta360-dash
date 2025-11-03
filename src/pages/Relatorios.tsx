import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, PieChart, BarChart3, FileBarChart } from "lucide-react";

const reports = [
  {
    title: "DRE - Demonstração do Resultado",
    description: "Relatório completo de receitas, despesas e resultado do período",
    icon: FileBarChart,
    color: "text-primary",
    bgColor: "bg-primary-light",
  },
  {
    title: "Balancete Contábil",
    description: "Posição de contas patrimoniais e de resultado",
    icon: BarChart3,
    color: "text-accent",
    bgColor: "bg-accent-light",
  },
  {
    title: "Análise de Despesas",
    description: "Distribuição e evolução das despesas por categoria",
    icon: PieChart,
    color: "text-warning",
    bgColor: "bg-warning-light",
  },
  {
    title: "Relatório de Fluxo de Caixa",
    description: "Entradas, saídas e projeções futuras detalhadas",
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-success-light",
  },
  {
    title: "Contas a Pagar e Receber",
    description: "Situação dos compromissos e recebíveis",
    icon: FileText,
    color: "text-info",
    bgColor: "bg-info-light",
  },
  {
    title: "Relatório Personalizado",
    description: "Crie relatórios customizados conforme sua necessidade",
    icon: FileText,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
];

export default function Relatorios() {
  return (
    <DashboardLayout
      title="Relatórios"
      subtitle="Gere relatórios contábeis e financeiros completos"
    >
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Relatórios Gerados</p>
                <p className="text-2xl font-bold mt-1">24</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold mt-1">8</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agendados</p>
                <p className="text-2xl font-bold mt-1">3</p>
              </div>
              <Download className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, index) => (
          <Card key={index} className="hover-lift group cursor-pointer">
            <CardHeader>
              <div className={`h-12 w-12 rounded-lg ${report.bgColor} flex items-center justify-center mb-4`}>
                <report.icon className={`h-6 w-6 ${report.color}`} />
              </div>
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <CardDescription className="text-sm">
                {report.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full group-hover:bg-primary-hover">
                <Download className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Relatórios Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "DRE - Janeiro 2024", date: "15/01/2024", size: "2.3 MB" },
              { name: "Balancete - Dezembro 2023", date: "02/01/2024", size: "1.8 MB" },
              { name: "Fluxo de Caixa - 4º Trimestre", date: "28/12/2023", size: "3.1 MB" },
            ].map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.date} • {file.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
