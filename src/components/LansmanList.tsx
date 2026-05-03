import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { getPendingRegistrations } from "@/lib/lansman";
import type { LansmanPendingPublicRow } from "@/types/lansman";

interface LansmanListProps {
  refreshToken?: number;
}

const LansmanList = ({ refreshToken = 0 }: LansmanListProps) => {
  const [rows, setRows] = useState<LansmanPendingPublicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getPendingRegistrations();
        if (!cancelled) {
          setRows(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Liste yüklenemedi.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Onay Bekleyenler</h2>
        <p className="text-sm text-muted-foreground">
          Sadece baş harfler ve durum gösterilir.
        </p>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Liste yükleniyor...</p> : null}

      {!loading && error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      {!loading && !error && rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz bekleyen kayıt yok.</p>
      ) : null}

      {!loading && !error && rows.length > 0 ? (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2"
            >
              <span className="font-semibold text-foreground">
                {row.initials || "--"}
              </span>
              <Badge variant="secondary">Onay Bekliyor</Badge>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};

export default LansmanList;
