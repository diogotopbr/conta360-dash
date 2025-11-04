import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { parse } from "https://deno.land/std@0.168.0/encoding/csv.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ParsedRow {
  date: string;
  description: string;
  amount_cents: number;
  currency: string;
  external_id?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text = await file.text();
    const rows = parse(text, { skipFirstRow: true });

    const parsed: ParsedRow[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    rows.forEach((row: any, index: number) => {
      try {
        // Expected CSV format: date, description, amount
        // Adjust these indices based on your actual CSV format
        const dateStr = row[0] || row.date || "";
        const description = row[1] || row.description || "Sem descrição";
        const amountStr = row[2] || row.amount || "0";

        // Parse date (support multiple formats)
        let date = "";
        if (dateStr) {
          const dateObj = new Date(dateStr);
          if (!isNaN(dateObj.getTime())) {
            date = dateObj.toISOString().split('T')[0];
          } else {
            // Try DD/MM/YYYY format
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              date = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          }
        }

        if (!date) {
          errors.push(`Linha ${index + 1}: Data inválida`);
          return;
        }

        // Parse amount (support comma and dot decimals)
        const amountFloat = parseFloat(amountStr.replace(/[^\d.,-]/g, '').replace(',', '.'));
        if (isNaN(amountFloat)) {
          errors.push(`Linha ${index + 1}: Valor inválido`);
          return;
        }

        const amount_cents = Math.round(amountFloat * 100);

        parsed.push({
          date,
          description: description.trim(),
          amount_cents,
          currency: "BRL",
          external_id: `${date}-${description.substring(0, 20)}-${amount_cents}`,
        });
      } catch (e) {
        errors.push(`Linha ${index + 1}: ${e instanceof Error ? e.message : "Erro desconhecido"}`);
      }
    });

    if (parsed.length === 0 && errors.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Nenhuma transação válida encontrada",
          errors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const preview = parsed.slice(0, 20);

    return new Response(
      JSON.stringify({
        preview,
        total: parsed.length,
        errors,
        warnings,
        all_rows: parsed,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in import-parse:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
