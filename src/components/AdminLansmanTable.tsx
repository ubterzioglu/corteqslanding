import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllRegistrations, updateRegistrationStatus } from "@/lib/lansman";
import type { LansmanRegistration, LansmanRegistrationStatus } from "@/types/lansman";

const statusLabels: Record<LansmanRegistrationStatus, string> = {
  pending: "Onay Bekliyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

const AdminLansmanTable = () => {
  const [rows, setRows] = useState<LansmanRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getAllRegistrations();
        if (!cancelled) {
          setRows(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Kayıtlar yüklenemedi.",
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
  }, []);

  const handleStatusUpdate = async (
    id: string,
    status: Extract<LansmanRegistrationStatus, "approved" | "rejected">,
  ) => {
    setUpdatingId(id);
    setError("");

    try {
      const updated = await updateRegistrationStatus(id, status);
      setRows((current) =>
        current.map((row) => (row.id === id ? updated : row)),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Durum güncellenemedi.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Lansman Kayıtları</h2>
        <p className="text-sm text-muted-foreground">
          Tüm kayıtları görüntüleyin ve durumlarını yönetin.
        </p>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Kayıtlar yükleniyor...</p> : null}
      {!loading && error ? <p className="text-sm text-destructive">{error}</p> : null}
      {!loading && !error && rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz kayıt bulunmuyor.</p>
      ) : null}

      {!loading && rows.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>LinkedIn</TableHead>
                <TableHead>Instagram</TableHead>
                <TableHead>X / Twitter</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const isUpdating = updatingId === row.id;
                return (
                  <TableRow key={row.id}>
                    <TableCell>{`${row.first_name} ${row.last_name}`}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.linkedin || "-"}</TableCell>
                    <TableCell>{row.instagram || "-"}</TableCell>
                    <TableCell>{row.twitter || "-"}</TableCell>
                    <TableCell>{row.website || "-"}</TableCell>
                    <TableCell>{row.description || "-"}</TableCell>
                    <TableCell>{statusLabels[row.status]}</TableCell>
                    <TableCell>
                      {new Date(row.created_at).toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => void handleStatusUpdate(row.id, "approved")}
                          disabled={isUpdating || row.status === "approved"}
                        >
                          Onayla
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => void handleStatusUpdate(row.id, "rejected")}
                          disabled={isUpdating || row.status === "rejected"}
                        >
                          Reddet
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </section>
  );
};

export default AdminLansmanTable;
