import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const startDate = url.searchParams.get("start") || new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
    const endDate = url.searchParams.get("end") || new Date().toISOString().split('T')[0];

    // Fetch transactions for the period
    const { data: transactions, error: transError } = await supabaseClient
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", startDate)
      .lte("date", endDate);

    if (transError) throw transError;

    // Calculate totals
    const income = transactions
      ?.filter((t) => t.amount_cents > 0)
      .reduce((sum, t) => sum + t.amount_cents, 0) || 0;

    const expense = transactions
      ?.filter((t) => t.amount_cents < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount_cents), 0) || 0;

    const balance = income - expense;

    // Group by category
    const byCategory: Record<string, number> = {};
    transactions?.forEach((t) => {
      const categoryName = t.category_id || "Sem categoria";
      byCategory[categoryName] = (byCategory[categoryName] || 0) + Math.abs(t.amount_cents);
    });

    const categoryArray = Object.entries(byCategory).map(([category, amount]) => ({
      category,
      amount_cents: amount,
    }));

    // Fetch bills summary
    const { data: bills, error: billsError } = await supabaseClient
      .from("bills")
      .select("*")
      .eq("user_id", user.id)
      .gte("due_date", startDate)
      .lte("due_date", endDate);

    if (billsError) throw billsError;

    const totalPayable = bills
      ?.filter((b) => b.type === "payable" && b.status === "open")
      .reduce((sum, b) => sum + (b.amount_cents || 0), 0) || 0;

    const totalReceivable = bills
      ?.filter((b) => b.type === "receivable" && b.status === "open")
      .reduce((sum, b) => sum + (b.amount_cents || 0), 0) || 0;

    const summary = {
      total_income_cents: income,
      total_expense_cents: expense,
      balance_cents: balance,
      total_payable_cents: totalPayable,
      total_receivable_cents: totalReceivable,
      by_category: categoryArray,
      period: { start: startDate, end: endDate },
    };

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in dashboard-summary:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
