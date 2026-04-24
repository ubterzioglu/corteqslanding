// src/pages/admin/muhasebe/NakitAkisiPage.tsx
// Aylık nakit akışı — Excel'deki "Nakit Akışı" sekmesinin karşılığı

import { useMemo, useState, Fragment } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useCashflowMonthly } from '@/hooks/useMuhasebe';
import { formatCurrency } from '@/lib/muhasebe-format';
import { MONTH_LABELS_TR } from '@/types/muhasebe';

// Pivot tablodaki satır tanımı
type RowKey =
  | 'income_try'
  | 'expense_try'
  | 'net_try'
  | 'burak_try'
  | 'baris_try'
  | 'ortak_try'
  | 'expense_paid_try'
  | 'expense_pending_try'
  | 'income_collected_try'
  | 'income_pending_try';

interface RowDef {
  key: RowKey;
  label: string;
  section: 'summary' | 'persons' | 'expense_status' | 'income_status';
  emphasize?: boolean;
}

const ROW_DEFS: RowDef[] = [
  { key: 'income_try',           label: 'Toplam Gelir (TRY)',  section: 'summary' },
  { key: 'expense_try',          label: 'Toplam Gider (TRY)',  section: 'summary' },
  { key: 'net_try',              label: 'Net Nakit Akışı',     section: 'summary', emphasize: true },
  { key: 'burak_try',            label: 'Burak Giderleri',     section: 'persons' },
  { key: 'baris_try',            label: 'Barış Giderleri',     section: 'persons' },
  { key: 'ortak_try',            label: 'Ortak Giderler',      section: 'persons' },
  { key: 'expense_paid_try',     label: 'Ödendi (Gider)',      section: 'expense_status' },
  { key: 'expense_pending_try',  label: 'Bekliyor (Gider)',    section: 'expense_status' },
  { key: 'income_collected_try', label: 'Tahsil Edildi (Gelir)', section: 'income_status' },
  { key: 'income_pending_try',   label: 'Bekliyor (Gelir)',    section: 'income_status' },
];

const SECTION_LABELS: Record<RowDef['section'], string | null> = {
  summary: null,
  persons: 'Kişi Bazlı Giderler',
  expense_status: 'Gider Durumu',
  income_status: 'Gelir Durumu',
};

export default function NakitAkisiPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const { data: cashflow = [], isLoading } = useCashflowMonthly(selectedYear);

  // Seçilebilecek yıllar: mevcut yıl ± 2
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = currentYear - 2; y <= currentYear + 1; y++) years.push(y);
    return years;
  }, [currentYear]);

  // Her ay için bir obje; eksik aylar 0 ile doldurulur
  const monthlyData = useMemo(() => {
    const base = Array.from({ length: 12 }, (_, i) => ({
      month_num: i + 1,
      income_try: 0,
      expense_try: 0,
      net_try: 0,
      burak_try: 0,
      baris_try: 0,
      ortak_try: 0,
      expense_paid_try: 0,
      expense_pending_try: 0,
      income_collected_try: 0,
      income_pending_try: 0,
    }));
    cashflow.forEach((row) => {
      const idx = row.month_num - 1;
      if (idx >= 0 && idx < 12) {
        base[idx] = { ...row };
      }
    });
    return base;
  }, [cashflow]);

  const totals = useMemo(() => {
    const t = {} as Record<RowKey, number>;
    ROW_DEFS.forEach((def) => {
      t[def.key] = monthlyData.reduce((sum, m) => sum + (m[def.key] ?? 0), 0);
    });
    return t;
  }, [monthlyData]);

  const chartData = useMemo(
    () =>
      monthlyData.map((m) => ({
        month: MONTH_LABELS_TR[m.month_num - 1],
        Gelir: m.income_try,
        Gider: m.expense_try,
        Net: m.net_try,
      })),
    [monthlyData],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nakit Akışı</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aylık özet · Yalnızca TRY işlemleri üzerinden hesaplanır
          </p>
        </div>

        <Select
          value={String(selectedYear)}
          onValueChange={(v) => setSelectedYear(Number(v))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aylık Trend</CardTitle>
          <CardDescription>Gelir, gider ve net nakit akışı</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
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

      <Card>
        <CardHeader>
          <CardTitle>Pivot Tablo</CardTitle>
          <CardDescription>
            {selectedYear} yılı için aylık dökümü
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">
                    Kalem
                  </TableHead>
                  {MONTH_LABELS_TR.map((m) => (
                    <TableHead key={m} className="text-right whitespace-nowrap">
                      {m}
                    </TableHead>
                  ))}
                  <TableHead className="text-right whitespace-nowrap font-bold bg-muted/50">
                    TOPLAM
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROW_DEFS.map((def, idx) => {
                  const sectionLabel = SECTION_LABELS[def.section];
                  const prevSection = idx > 0 ? ROW_DEFS[idx - 1].section : null;
                  const showSectionHeader =
                    sectionLabel && def.section !== prevSection;

                  return (
                    <Fragment key={def.key}>
                      {showSectionHeader && (
                        <TableRow key={`${def.key}-sep`} className="hover:bg-transparent">
                          <TableCell
                            colSpan={14}
                            className="bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2"
                          >
                            {sectionLabel}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow className={def.emphasize ? 'font-semibold' : ''}>
                        <TableCell className="sticky left-0 bg-background z-10 whitespace-nowrap">
                          {def.label}
                        </TableCell>
                        {monthlyData.map((m) => {
                          const value = m[def.key] ?? 0;
                          return (
                            <TableCell
                              key={`${def.key}-${m.month_num}`}
                              className="text-right tabular-nums whitespace-nowrap"
                            >
                              {value === 0 ? (
                                <span className="text-muted-foreground">—</span>
                              ) : (
                                formatCurrency(value, 'TRY', {
                                  minimumFractionDigits: 0,
                                })
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right tabular-nums whitespace-nowrap font-semibold bg-muted/50">
                          {totals[def.key] === 0 ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            formatCurrency(totals[def.key], 'TRY', {
                              minimumFractionDigits: 0,
                            })
                          )}
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        * Nakit akışı yalnızca TRY işlemleri üzerinden hesaplanmaktadır. USD/EUR için
        ayrı sütun eklenebilir.
      </p>
    </div>
  );
}
