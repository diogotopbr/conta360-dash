import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";

export default function Importacao() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewData] = useState([
    { data: "2024-01-15", descricao: "Pagamento Cliente XYZ", valor: 15000, tipo: "Entrada", categoria: "Vendas" },
    { data: "2024-01-14", descricao: "Fornecedor ABC", valor: -8500, tipo: "Saída", categoria: "Operacional" },
    { data: "2024-01-13", descricao: "Recebimento Fatura 123", valor: 22000, tipo: "Entrada", categoria: "Serviços" },
    { data: "2024-01-12", descricao: "Folha de Pagamento", valor: -45000, tipo: "Saída", categoria: "Pessoal" },
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    // Simulação de upload
    setTimeout(() => {
      setUploading(false);
      toast.success("Arquivo importado com sucesso! Revise os lançamentos abaixo.");
    }, 2000);
  };

  return (
    <DashboardLayout
      title="Importação de Extratos"
      subtitle="Importe extratos bancários em CSV, OFX ou PDF"
    >
      {/* Upload Area */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Selecione ou arraste o arquivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              dragging
                ? "border-primary bg-primary-light"
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary-light flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              
              <div>
                <p className="text-lg font-semibold mb-1">
                  {uploading ? "Processando arquivo..." : "Arraste e solte o arquivo aqui"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  ou clique para selecionar do seu computador
                </p>
              </div>

              <input
                type="file"
                id="file-upload"
                accept=".csv,.ofx,.pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={uploading}
              />
              
              <Button
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={uploading}
              >
                {uploading ? "Processando..." : "Selecionar Arquivo"}
              </Button>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">CSV</Badge>
                <Badge variant="outline">OFX</Badge>
                <Badge variant="outline">PDF</Badge>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-info-light rounded-lg border border-info">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-2">
                <p className="font-medium text-info">Formatos aceitos e instruções:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>CSV:</strong> Arquivos de texto separados por vírgula com colunas: Data, Descrição, Valor</li>
                  <li><strong>OFX:</strong> Formato padrão de extratos bancários (Open Financial Exchange)</li>
                  <li><strong>PDF:</strong> Extratos em PDF serão processados com OCR automático</li>
                </ul>
                <p className="text-info">Após o upload, você poderá revisar e editar as transações antes de confirmar.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Preview dos Lançamentos</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Modelo
              </Button>
              <Button size="sm">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmar Importação
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Data</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Descrição</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Valor</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Tipo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Categoria</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {previewData.map((item, index) => (
                    <tr key={index} className="hover:bg-accent/50 transition-colors">
                      <td className="px-4 py-3 text-sm">{item.data}</td>
                      <td className="px-4 py-3 text-sm font-medium">{item.descricao}</td>
                      <td className={`px-4 py-3 text-sm text-right font-semibold number-animation ${
                        item.valor > 0 ? "text-success" : "text-destructive"
                      }`}>
                        {item.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={item.tipo === "Entrada" ? "default" : "secondary"}>
                          {item.tipo}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{item.categoria}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              {previewData.length} transações encontradas
            </p>
            <div className="flex gap-4">
              <span className="text-success font-medium">
                Entradas: R$ 37.000,00
              </span>
              <span className="text-destructive font-medium">
                Saídas: R$ -53.500,00
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
