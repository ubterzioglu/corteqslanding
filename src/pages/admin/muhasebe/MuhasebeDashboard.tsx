// src/pages/admin/muhasebe/MuhasebeDashboard.tsx
// Ana muhasebe dashboard — Excel'deki "Dashboard" sekmesinin karşılığı

import { useMemo } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  Clock,
  CircleDollarSign,
  Receipt,
} from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { KpiCard } from '@/components/admin/muhasebe/KpiCard';
import {
  useCashflowMonthly,
  useCategorySummary,
  useKpiSummary,
  usePersonSummary,
} from '@/hooks/useMuhasebe';
import { formatCurrency } from '@/lib/muhasebe-format';
import {
  CATEGORY_COLORS,
  EXPENSE_CATEGORY_LABELS,
  MONTH_LABELS_TR,
  PERSON_LABELS,
  type ExpenseCategory,
  type PersonType,
} from '@/types/muhasebe';

export default function MuhasebeDashboard() {
  const { data: kpi, isLoading: kpiLoading } = useKpiSummary();
  const { data: byPerson = [], isLoading: personLoading } = usePersonSummary();
  const { data: byCategory = [], isLoading: catLoading } = useCategorySummary();
  const { data: cashflow = [], isLoading: cashflowLoading } = useCashflowMonthly();

  // Tüm kişileri her zaman göster (kayıt olmasa bile satır görünsün)
  const personRows = useMemo(() => {
    const all: PersonType[] = ['burak', 'baris', 'ortak'];
    return all.map((p) => {
      const found = byPerson.find((r) => r.person === p);
      return (
        found ?? {
          person: p,
          record_count: 0,
          total_try: 0,
          paid_try: 0,
          pending_try: 0,
        }
      );
    });
  }, [byPerson]);

  // Tüm gider kategorilerini her zaman göster
  const categoryRows = useMemo(() => {
    const all = Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[];
    return all.map((c) => {
      const found = byCategory.find((r) => r.category === c);
      return (
        found ?? {
          category: c,
          record_count: 0,
          total_try: 0,
        }
      );
    });
  }, [byCategory]);

  // Chart data — recharts formatına dönüştür
  const chartData = useMemo(() => {
    return cashflow.map((row) => ({
      month: MONTH_LABELS_TR[row.month_num - 1],
      Gelir: row.income_try,
      Gider: row.expense_try,
      Net: row.net_try,
    }));
  }, [cashflow]);

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          CorteQS — Finansal Takip Paneli
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Şirket kurulana kadar geçici muhasebe · Burak &amp; Barış
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          title="Toplam Gider"
          subtitle="Tüm Zamanlar / TRY"
          icon={TrendingDown}
          amount={kpi?.total_expense_try ?? 0}
          tone="negative"
          isLoading={kpiLoading}
        />
        <KpiCard
          title="Toplam Gelir"
          subtitle="Tüm Zamanlar / TRY"
          icon={TrendingUp}
          amount={kpi?.total_income_try ?? 0}
          tone="positive"
          isLoading={kpiLoading}
        />
        <KpiCard
          title="Net Pozisyon"
          subtitle="Gelir − Gider / TRY"
          icon={Wallet}
          amount={kpi?.net_position_try ?? 0}
          isLoading={kpiLoading}
        />
        <KpiCard
          title="Bekleyen Gider"
          subtitle="Henüz ödenmeyen / TRY"
          icon={Clock}
          amount={kpi?.pending_expense_try ?? 0}
          tone="warning"
          isLoading={kpiLoading}
        />
        <KpiCard
          title="Bekleyen Tahsilat"
          subtitle="Henüz tahsil edilmeyen / TRY"
          icon={CircleDollarSign}
          amount={kpi?.pending_income_try ?? 0}
          tone="warning"
          isLoading={kpiLoading}
        />
        <KpiCard
          title="Toplam Kayıt"
          subtitle="Gider + Gelir girişi"
          icon={Receipt}
          amount={kpi?.total_records ?? 0}
          displayAsCount
          isLoading={kpiLoading}
        />
      </div>

      {/* Chart — Aylık Nakit Akışı */}
      <Card>
        <CardHeader>
          <CardTitle>Aylık Nakit Akışı</CardTitle>
          <CardDescription>
            Yalnızca TRY işlemleri üzerinden hesaplanmaktadır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cashflowLoading ? (
            <div className="h-[320px] animate-pulse rounded bg-muted" />
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) =>
                      new Intl.NumberFormat('tr-TR', {
                        notation: 'compact',
                        maximumFractionDigits: 1,
                      }).format(v as number)
                    }
                  />
                  <Tooltip
                    formatter={(v) => formatCurrency(v as number, 'TRY')}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Gelir" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Gider" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="Net"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kişi + Kategori Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kişi Bazlı Giderler */}
        <Card>
          <CardHeader>
            <CardTitle>👤 Kişi Bazlı Giderler</CardTitle>
            <CardDescription>TRY cinsinden toplam ve ödendi durumu</CardDescription>
          </CardHeader>
          <CardContent>
            {personLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kişi</TableHead>
                    <TableHead className="text-right">Toplam Gider</TableHead>
                    <TableHead className="text-right">Ödendi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personRows.map((row) => (
                    <TableRow key={row.person}>
                      <TableCell className="font-medium">
                        {PERSON_LABELS[row.person]}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(row.total_try, 'TRY')}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(row.paid_try, 'TRY')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Kategori Bazlı Giderler */}
        <Card>
          <CardHeader>
            <CardTitle>📂 Kategori Bazlı Giderler</CardTitle>
            <CardDescription>TRY cinsinden toplam ve kayıt sayısı</CardDescription>
          </CardHeader>
          <CardContent>
            {catLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : (
              <div className="max-h-[360px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-right">Toplam</TableHead>
                      <TableHead className="text-right">Kayıt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryRows.map((row, idx) => (
                      <TableRow key={row.category}>
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor:
                                  CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                              }}
                            />
                            {EXPENSE_CATEGORY_LABELS[row.category]}
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(row.total_try, 'TRY')}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {row.record_count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center pt-4">
        Gider ve Gelir sekmelerine veri girerek bu paneli güncel tutun.
      </p>
    </div>
  );
}
