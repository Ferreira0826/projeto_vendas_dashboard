import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Target,
  Users, AlertTriangle, Sparkles, Award, Store, Globe, BarChart3,
} from "lucide-react";
import type { Sale } from "../lib/sales-data";
import { useSalesData } from "../hooks/useSalesData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { formatNumber, formatBRL } from "../lib/utils";

const META_MENSAL = 50000;

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "TechNova — Dashboard Executivo de Vendas" },
      { name: "description", content: "Painel executivo TechNova: KPIs, ranking de vendedores, forecast e desempenho por categoria." },
    ],
  }),
});

const MONTHS = [
  "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
  "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
  "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06",
  "2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12",
] as const;
const MONTH_LABEL: Record<string, string> = {
  "2025-01": "Jan/25",
  "2025-02": "Fev/25",
  "2025-03": "Mar/25",
  "2025-04": "Abr/25",
  "2025-05": "Mai/25",
  "2025-06": "Jun/25",
  "2025-07": "Jul/25",
  "2025-08": "Ago/25",
  "2025-09": "Set/25",
  "2025-10": "Out/25",
  "2025-11": "Nov/25",
  "2025-12": "Dez/25",
  "2026-01": "Jan/26",
  "2026-02": "Fev/26",
  "2026-03": "Mar/26",
  "2026-04": "Abr/26",
  "2026-05": "Mai/26",
  "2026-06": "Jun/26",
  "2026-07": "Jul/26",
  "2026-08": "Ago/26",
  "2026-09": "Set/26",
  "2026-10": "Out/26",
  "2026-11": "Nov/26",
  "2026-12": "Dez/26",
};

const CHART_COLORS = [
  "#4f46e5",
  "#7c3aed",
  "#0ea5e9",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#f59e0b",
];

function ym(d: string) { return d.slice(0, 7); }

function formatBRLCompact(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function Dashboard() {
const { salesData, loading } = useSalesData();

const [periodo, setPeriodo] = useState<string>("all");
const [categoria, setCategoria] = useState<string>("all");
const [vendedor, setVendedor] = useState<string>("all");
const [canal, setCanal] = useState<string>("all");

const categorias = useMemo(() => Array.from(new Set(salesData.map(s => s.categoria))).sort(), [salesData]);
const vendedores = useMemo(() => Array.from(new Set(salesData.map(s => s.vendedor))).sort(), [salesData]);

const filtered: Sale[] = useMemo(() => salesData.filter(s =>
  (periodo === "all" || ym(s.data) === periodo) &&
  (categoria === "all" || s.categoria === categoria) &&
  (vendedor === "all" || s.vendedor === vendedor) &&
  (canal === "all" || s.canal === canal)
), [salesData, periodo, categoria, vendedor, canal]);

// 👇 AQUI sim
  // KPIs
  const receitaTotal = filtered.reduce((a, s) => a + Number(s.receita), 0);
  const totalPedidos = filtered.length;
  const totalProdutos = filtered.reduce((a, s) => a + (Number(s.vendas) || 0), 0);
  const ticketMedio = totalPedidos ? receitaTotal / totalPedidos : 0;

  // Receita por mês (sempre todos os meses para tendência) com filtros aplicados
  const receitaPorMes = useMemo(() => {
    const map: Record<string, { receita: number; pedidos: number; unidades: number }> = {};
    filtered.forEach(s => {
      const m = ym(s.data);
      if (!map[m]) map[m] = { receita: 0, pedidos: 0, unidades: 0 };
      map[m].receita += Number(s.receita);
      map[m].pedidos += 1;
      map[m].unidades += Number(s.vendas);
    });
    return MONTHS.map(m => ({ mes: MONTH_LABEL[m], key: m, receita: map[m]?.receita ?? 0, pedidos: map[m]?.pedidos ?? 0, unidades: map[m]?.unidades ?? 0 }));
  }, [filtered]);

  // Crescimento percentual mensal (último vs anterior)
  const ultimo = receitaPorMes[receitaPorMes.length - 1]?.receita ?? 0;
  const anterior = receitaPorMes[receitaPorMes.length - 2]?.receita ?? 0;
  const crescimento = anterior ? ((ultimo - anterior) / anterior) * 100 : 0;

  // Forecast simples: média + tendência linear
  const valores = receitaPorMes.map(r => r.receita);
  const media = valores.reduce((a, b) => a + b, 0) / (valores.length || 1);
  const tendencia = valores.length >= 2 ? (valores[valores.length - 1] - valores[0]) / (valores.length - 1) : 0;
  const forecast = Math.max(0, media + tendencia);
  const serieComForecast = [
    ...receitaPorMes.map(r => ({ mes: r.mes, Receita: r.receita, Forecast: null as number | null })),
    { mes: "Abr/26 (forecast)", Receita: null as number | null, Forecast: Math.round(forecast) },
  ];

  // Receita por categoria
  const porCategoria = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(s => { map[s.categoria] = (map[s.categoria] ?? 0) + Number(s.receita); });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  // Ranking vendedores
  const ranking = useMemo(() => {
    const map: Record<string, { receita: number; pedidos: number; unidades: number }> = {};
    filtered.forEach(s => {
      if (!map[s.vendedor]) map[s.vendedor] = { receita: 0, pedidos: 0, unidades: 0 };
      map[s.vendedor].receita += Number(s.receita);
      map[s.vendedor].pedidos += 1;
      map[s.vendedor].unidades += s.vendas;
    });
    return Object.entries(map).map(([nome, v]) => ({ nome, ...v })).sort((a, b) => b.receita - a.receita);
  }, [filtered]);

  // Top / bottom produtos
  const ordenadosPorReceita = [...filtered].sort(
  (a, b) => (Number(b.receita) || 0) - (Number(a.receita) || 0)
);
  const topProdutos = ordenadosPorReceita.slice(0, 5);
  const bottomProdutos = [...filtered].sort((a, b) => a.receita - b.receita).slice(0, 5);

  // Estoque
  const estoque = [...filtered].sort((a, b) => b.estoque - a.estoque).slice(0, 10);

  // Canal distribution
  const porCanal = useMemo(() => {
  const map: Record<string, number> = { Online: 0, Fisico: 0 };

  filtered.forEach((s) => {
    const canalNormalizado =
      s.canal === "Online" ? "Online" : "Fisico";

    map[canalNormalizado] += Number(s.receita) || 0;
  });

  return [
    { name: "Online", value: map.Online },
    { name: "Loja Física", value: map.Fisico },
  ];
}, [filtered]);

if (loading) {
  return <p>Carregando dados...</p>;
}

  // Meta vs Realizado (por mês)
  const metaVsReal = receitaPorMes.map(r => ({ mes: r.mes, Realizado: r.receita, Meta: META_MENSAL }));
  const mesesAtingidos = metaVsReal.filter(m => m.Realizado >= META_MENSAL).length;
  const mesesNaoAtingidos = metaVsReal.filter(m => m.Realizado < META_MENSAL && m.Realizado > 0);

  // Insights
  const melhorVendedor = ranking[0];
  const produtoCampeao = ordenadosPorReceita[0];
  const categoriaLider = porCategoria[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">TechNova — Dashboard Executivo</h1>
              <p className="text-xs text-muted-foreground">Performance comercial • Q1 2026</p>
            </div>
          </div>
          <Badge variant="secondary" className="hidden md:inline-flex">Atualizado em tempo real</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-8 space-y-8">
        {/* Filtros */}
        <Card className="border-border/60">
          <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <FilterSelect label="Período" value={periodo} onChange={setPeriodo}
              options={[{ value: "all", label: "Todos os meses" }, ...MONTHS.map(m => ({ value: m, label: MONTH_LABEL[m] }))]} />
            <FilterSelect label="Categoria" value={categoria} onChange={setCategoria}
              options={[{ value: "all", label: "Todas as categorias" }, ...categorias.map(c => ({ value: c, label: c }))]} />
            <FilterSelect label="Vendedor" value={vendedor} onChange={setVendedor}
              options={[{ value: "all", label: "Todos os vendedores" }, ...vendedores.map(c => ({ value: c, label: c }))]} />
            <FilterSelect label="Canal" value={canal} onChange={setCanal}
              options={[{ value: "all", label: "Todos os canais" }, { value: "Online", label: "Online" }, { value: "Fisico", label: "Loja Física" }]} />
          </CardContent>
        </Card>

        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard icon={DollarSign} label="Receita Total" value={formatBRLCompact(receitaTotal)} accent />
          <KpiCard icon={ShoppingCart} label="Total de Pedidos" value={formatNumber(totalPedidos)} />
          <KpiCard icon={Package} label="Produtos Vendidos" value={formatNumber(totalProdutos)} />
          <KpiCard icon={Target} label="Ticket Médio" value={formatBRL(ticketMedio)} />
          <KpiCard icon={Award} label="Meta Mensal" value={formatBRL(META_MENSAL)} hint={`${mesesAtingidos}/${metaVsReal.filter(m=>m.Realizado>0).length} meses atingidos`} />
          <KpiCard icon={crescimento >= 0 ? TrendingUp : TrendingDown} label="Crescimento Mensal"
            value={`${crescimento >= 0 ? "+" : ""}${crescimento.toFixed(1)}%`}
            tone={crescimento >= 0 ? "success" : "destructive"} />
        </section>

        {/* Insights & Alertas */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <InsightCard
            icon={Sparkles}
            title="Insight automático"
            lines={[
              melhorVendedor && `🏆 Melhor vendedor: ${melhorVendedor.nome} (${formatBRL(melhorVendedor.receita)})`,
              produtoCampeao && `🚀 Produto campeão: ${produtoCampeao.produto}`,
              categoriaLider && `📈 Categoria líder: ${categoriaLider.name}`,
            ].filter(Boolean) as string[]}
          />
          <InsightCard
            icon={AlertTriangle}
            tone="warning"
            title="Alertas de meta"
            lines={mesesNaoAtingidos.length
              ? mesesNaoAtingidos.map(m => `⚠️ ${m.mes}: ${formatBRL(m.Realizado)} (${((m.Realizado/META_MENSAL)*100).toFixed(0)}% da meta)`)
              : ["✅ Todas as metas do período foram atingidas."]}
          />
          <InsightCard
            icon={TrendingUp}
            tone="success"
            title="Forecast próximo mês"
            lines={[
              `Projeção: ${formatBRL(forecast)}`,
              forecast >= META_MENSAL ? "✅ Tendência de bater a meta" : `⚠️ ${((forecast/META_MENSAL)*100).toFixed(0)}% da meta projetada`,
            ]}
          />
        </section>

        {/* Vendas ao longo do tempo + Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas ao longo do tempo</CardTitle>
            <CardDescription>Receita mensal realizada e projeção para o próximo mês</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={serieComForecast}>
                <defs>
                  <linearGradient id="fillReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                    content={<ChartTooltip />}
                    wrapperStyle={{ zIndex: 9999, pointerEvents: "none" }}
                  />
                <Legend />
                <ReferenceLine y={META_MENSAL} stroke="var(--warning)" strokeDasharray="4 4" label={{ value: "Meta", fill: "var(--warning)", fontSize: 11, position: "right" }} />
                <Area type="monotone" dataKey="Receita" stroke="#4f46e5" strokeWidth={2.5} fill="url(#fillReceita)" />
                <Area type="monotone" dataKey="Forecast" stroke="#7c3aed" strokeWidth={2.5} strokeDasharray="6 4" fill="url(#fillForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Categoria + Canal */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Receita por categoria</CardTitle>
              <CardDescription>Distribuição da receita no período filtrado</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={porCategoria} layout="vertical" margin={{ left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={12} width={110} />
                  <Tooltip
                    content={<ChartTooltip />}
                    wrapperStyle={{ zIndex: 9999, pointerEvents: "none" }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {porCategoria.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Canal de vendas</CardTitle>
              <CardDescription>Online vs Loja Física</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={porCanal} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                    <Cell fill="#4f46e5" />
                    <Cell fill="var(--chart-2)" />
                  </Pie>
                  <Tooltip
                    content={<ChartTooltip />}
                    wrapperStyle={{ zIndex: 9999, pointerEvents: "none" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-around text-sm mt-2">
                <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" />{formatBRL(porCanal[0].value)}</div>
                <div className="flex items-center gap-2"><Store className="h-4 w-4" style={{ color: "var(--chart-2)" }} />{formatBRL(porCanal[1].value)}</div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Meta vs Realizado */}
        <Card>
          <CardHeader>
            <CardTitle>Meta vs Realizado</CardTitle>
            <CardDescription>Comparativo mensal contra a meta de {formatBRL(META_MENSAL)}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metaVsReal}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                    content={<ChartTooltip />}
                    wrapperStyle={{ zIndex: 9999, pointerEvents: "none" }}
                  />
                <Legend />
                <Bar dataKey="Meta" fill="var(--muted)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Realizado" radius={[6, 6, 0, 0]}>
                  {metaVsReal.map((m, i) => (
                    <Cell key={i} fill={m.Realizado >= META_MENSAL ? "var(--success)" : "var(--chart-1)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ranking + Top produtos */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> Ranking de vendedores</CardTitle>
              <CardDescription>Receita total por vendedor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ranking.map((r, i) => {
                const max = ranking[0]?.receita || 1;
                const pct = (r.receita / max) * 100;
                return (
                  <div key={r.nome} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="h-7 w-7 rounded-full bg-accent text-accent-foreground text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                        <span className="font-medium">{r.nome}</span>
                        <Badge variant="outline" className="text-xs">{r.pedidos} pedidos</Badge>
                      </div>
                      <span className="font-semibold">{formatBRL(r.receita)}</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
              {!ranking.length && <p className="text-sm text-muted-foreground">Sem dados para os filtros aplicados.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Produtos mais vendidos</CardTitle>
              <CardDescription>Top 5 por receita</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductTable rows={topProdutos} />
            </CardContent>
          </Card>
        </section>

        {/* Bottom + Estoque */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingDown className="h-4 w-4" /> Menor desempenho</CardTitle>
              <CardDescription>Produtos com menor receita no período</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductTable rows={bottomProdutos} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="h-4 w-4" /> Estoque por produto</CardTitle>
              <CardDescription>Top 10 maiores estoques</CardDescription>
            </CardHeader>
            <CardContent className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={estoque} layout="vertical" margin={{ left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis type="category" dataKey="produto" stroke="var(--muted-foreground)" fontSize={11} width={150} />
                  <Tooltip
                    content={<ChartTooltip />}
                    wrapperStyle={{ zIndex: 9999, pointerEvents: "none" }}
                  />
                  <Bar dataKey="estoque" fill="var(--chart-3)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <footer className="text-center text-xs text-muted-foreground py-6">
          TechNova © 2026 — Dashboard executivo gerado para apresentação
        </footer>
      </main>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, hint, tone, accent }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; hint?: string;
  tone?: "success" | "destructive"; accent?: boolean;
}) {
  const toneColor =
    tone === "success" ? "text-success" :
    tone === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <Card
      className="relative overflow-hidden border-border/60"
      style={accent ? { background: "var(--gradient-card)", boxShadow: "var(--shadow-elegant)" } : undefined}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <Icon className="h-4 w-4 text-accent-foreground" />
          </div>
        </div>
        <p className={`mt-3 text-2xl font-bold tracking-tight ${toneColor}`}>{value}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function InsightCard({ icon: Icon, title, lines, tone }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; lines: string[]; tone?: "success" | "warning";
}) {
  const bg =
    tone === "warning" ? "bg-warning/10 border-warning/30" :
    tone === "success" ? "bg-success/10 border-success/30" :
    "bg-primary/5 border-primary/20";
  const iconColor =
    tone === "warning" ? "text-warning" :
    tone === "success" ? "text-success" : "text-primary";
  return (
    <Card className={`border ${bg}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {lines.map((l, i) => <p key={i} className="text-sm text-foreground/90">{l}</p>)}
      </CardContent>
    </Card>
  );
}

function ProductTable({ rows }: { rows: Sale[] }) {
  if (!rows.length) return <p className="text-sm text-muted-foreground">Sem dados.</p>;
  return (
    <div className="space-y-2">
      {rows.map(r => (
        <div key={`${r.id}-${r.sku}`} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/60 hover:bg-accent/40 transition">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{r.produto}</p>
            <p className="text-xs text-muted-foreground">{r.categoria} • {r.vendedor} • {r.canal === "Fisico" ? "Loja Física" : "Online"}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold">{formatBRL(r.receita)}</p>
            <p className="text-xs text-muted-foreground">{r.vendas} un.</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => p.value != null && (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{typeof p.value === "number" && p.value > 1000 ? formatBRL(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
}
