import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, FileText, Send, Clock, MapPin, DollarSign, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { value: "yasam-relokasyon", label: "Yaşam ve Relokasyon", subcategories: ["Taşınma Danışmanlığı", "Entegrasyon", "Dil Desteği", "Konut Arama"] },
  { value: "finans", label: "Finans", subcategories: ["Vergi Danışmanlığı", "Yatırım", "Bankacılık", "Sigorta"] },
  { value: "hukuk", label: "Hukuk", subcategories: ["İş Hukuku", "Aile Hukuku", "Sözleşme", "Vatandaşlık"] },
  { value: "sirket-kurulusu", label: "Şirket Kuruluşu", subcategories: ["GmbH Kuruluşu", "Freelance", "Muhasebe", "Ticari Danışmanlık"] },
  { value: "vize-gocmenlik", label: "Vize / Göçmenlik", subcategories: ["Çalışma Vizesi", "Mavi Kart", "Aile Birleşimi", "Oturma İzni"] },
  { value: "gayrimenkul", label: "Gayrimenkul", subcategories: ["Kiralama", "Satın Alma", "Yatırım", "Değerleme"] },
];

const URGENCY_OPTIONS = [
  { value: "low", label: "Acil Değil", color: "bg-muted text-muted-foreground" },
  { value: "normal", label: "Normal", color: "bg-primary/10 text-primary" },
  { value: "high", label: "Acil", color: "bg-gold/10 text-gold" },
  { value: "urgent", label: "Çok Acil", color: "bg-destructive/10 text-destructive" },
];

interface ServiceRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ServiceRequestForm = ({ onSuccess, onCancel }: ServiceRequestFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    country: "",
    budgetMin: "",
    budgetMax: "",
    preferredTime: "",
    urgency: "normal",
  });

  const selectedCategory = CATEGORIES.find(c => c.value === category);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !form.title || !form.description) {
      toast({ title: "Eksik bilgi", description: "Kategori, başlık ve açıklama zorunludur.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Giriş yapmalısınız", variant: "destructive" });
        return;
      }

      // Upload files
      const attachmentUrls: string[] = [];
      for (const file of files) {
        const filePath = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("service-attachments")
          .upload(filePath, file);
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("service-attachments")
            .getPublicUrl(filePath);
          attachmentUrls.push(urlData.publicUrl);
        }
      }

      const { error } = await supabase.from("service_requests").insert({
        user_id: user.id,
        category: selectedCategory?.label || category,
        subcategory: subcategory || null,
        title: form.title,
        description: form.description,
        city: form.city || null,
        country: form.country || null,
        budget_min: form.budgetMin ? parseFloat(form.budgetMin) : null,
        budget_max: form.budgetMax ? parseFloat(form.budgetMax) : null,
        preferred_time: form.preferredTime || null,
        urgency: form.urgency,
        attachment_urls: attachmentUrls,
      });

      if (error) throw error;

      toast({ title: "Talep oluşturuldu!", description: "Danışmanlar tekliflerini gönderecektir." });
      onSuccess?.();
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Kategori *</Label>
          <Select value={category} onValueChange={(v) => { setCategory(v); setSubcategory(""); }}>
            <SelectTrigger><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory */}
        <div className="space-y-2">
          <Label>Alt Kategori</Label>
          <Select value={subcategory} onValueChange={setSubcategory} disabled={!selectedCategory}>
            <SelectTrigger><SelectValue placeholder="Alt kategori seçin" /></SelectTrigger>
            <SelectContent>
              {selectedCategory?.subcategories.map(sc => (
                <SelectItem key={sc} value={sc}>{sc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label>Talep Başlığı *</Label>
        <Input
          placeholder="Örn: Almanya'da GmbH kurulumu hakkında danışmanlık"
          value={form.title}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          maxLength={200}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Detaylı Açıklama *</Label>
        <Textarea
          placeholder="Hizmet talebinizi detaylı açıklayın..."
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          rows={4}
          maxLength={2000}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Şehir</Label>
          <Input placeholder="Örn: Berlin" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label>Ülke</Label>
          <Input placeholder="Örn: Almanya" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Budget */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> Min Bütçe (€)</Label>
          <Input type="number" placeholder="100" value={form.budgetMin} onChange={e => setForm(p => ({ ...p, budgetMin: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Max Bütçe (€)</Label>
          <Input type="number" placeholder="500" value={form.budgetMax} onChange={e => setForm(p => ({ ...p, budgetMax: e.target.value }))} />
        </div>

        {/* Preferred Time */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Tercih Edilen Zaman</Label>
          <Select value={form.preferredTime} onValueChange={v => setForm(p => ({ ...p, preferredTime: v }))}>
            <SelectTrigger><SelectValue placeholder="Zaman seçin" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="weekday-morning">Hafta İçi Sabah</SelectItem>
              <SelectItem value="weekday-afternoon">Hafta İçi Öğleden Sonra</SelectItem>
              <SelectItem value="weekday-evening">Hafta İçi Akşam</SelectItem>
              <SelectItem value="weekend">Hafta Sonu</SelectItem>
              <SelectItem value="flexible">Esnek</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Urgency */}
      <div className="space-y-2">
        <Label>Aciliyet</Label>
        <div className="flex flex-wrap gap-2">
          {URGENCY_OPTIONS.map(u => (
            <Badge
              key={u.value}
              className={`cursor-pointer transition-all ${form.urgency === u.value ? u.color + " ring-2 ring-ring" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
              onClick={() => setForm(p => ({ ...p, urgency: u.value }))}
            >
              {u.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5"><Upload className="h-3.5 w-3.5" /> Dosya Ekle (max 5)</Label>
        <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors">
          <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Dosya seçmek için tıklayın</p>
            <p className="text-xs text-muted-foreground/60 mt-1">PDF, DOC, JPG, PNG · Max 5 dosya</p>
          </label>
        </div>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((file, i) => (
              <Badge key={i} variant="outline" className="gap-1.5 pr-1">
                <FileText className="h-3 w-3" />
                <span className="max-w-[120px] truncate text-xs">{file.name}</span>
                <button type="button" onClick={() => removeFile(i)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="gap-2 flex-1 md:flex-none">
          <Send className="h-4 w-4" /> {loading ? "Gönderiliyor..." : "Talebi Gönder"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>İptal</Button>
        )}
      </div>
    </form>
  );
};

export default ServiceRequestForm;
