import { Link } from "react-router-dom";
import { Globe, Users, ExternalLink, Plus, MessageSquare, Bot, Bell, Phone, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockGroups = [
  { id: 1, name: "Berlin Türk Profesyoneller", members: 256, category: "İş", joined: true },
  { id: 2, name: "Almanya Gayrimenkul Ağı", members: 189, category: "Gayrimenkul", joined: true },
  { id: 3, name: "Avrupa Türk Girişimciler", members: 412, category: "İş", joined: false },
  { id: 4, name: "Berlin Türk Aileleri", members: 324, category: "Yaşam", joined: true },
  { id: 5, name: "ODTÜ Mezunları Avrupa", members: 178, category: "Mezun", joined: false },
];

const corteqsFeatures = [
  { icon: Bell, label: "Bildirimler", desc: "Platform bildirimleri anlık olarak WhatsApp'ınıza gelir" },
  { icon: MessageSquare, label: "Mesajlar", desc: "Danışman ve işletmelerden gelen mesajları takip edin" },
  { icon: Phone, label: "RFQ & Teklifler", desc: "Hizmet talepleri ve teklifleriniz hakkında anında haberdar olun" },
  { icon: Bot, label: "CorteQS Bot", desc: "Hesap bilgileri, ödemeler ve destek için 1'e 1 görüşme" },
];

const WhatsAppGroupsTab = () => (
  <div className="space-y-6">
    {/* CorteQS WhatsApp İletişim */}
    <div className="rounded-2xl border-2 border-success/30 bg-success/5 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-success/20 flex items-center justify-center">
          <Bot className="h-6 w-6 text-success" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-base">CorteQS WhatsApp</h3>
          <p className="text-xs text-muted-foreground">Bildirimler, mesajlar ve destek tek bir yerde</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {corteqsFeatures.map((f, i) => (
          <div key={i} className="flex items-start gap-2.5 rounded-lg bg-background/60 border border-border p-3">
            <f.icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <a
          href="https://wa.me/4915200000000?text=Merhaba%20CorteQS%2C%20hesabımı%20bağlamak%20istiyorum"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full gap-2 bg-success hover:bg-success/90 text-white">
            <Bot className="h-4 w-4" /> CorteQS Bot ile Bağlan
          </Button>
        </a>
        <a
          href="https://whatsapp.com/channel/0029VbCUnsN6GcGHZvUypo13"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="outline" className="w-full gap-2 border-success/40 text-success hover:bg-success/10">
            <Megaphone className="h-4 w-4" /> CorteQS Kanalını Takip Et
          </Button>
        </a>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        WhatsApp ile bağlanarak bildirimlerinizi, mesajlarınızı ve RFQ güncellemelerinizi anlık olarak alabilirsiniz.
      </p>
    </div>

    {/* WhatsApp Grupları */}
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-foreground flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-success" /> WhatsApp Grupları
      </h3>
      <div className="flex gap-2">
        <Link to="/whatsapp-groups">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Globe className="h-3.5 w-3.5" /> Tüm Grupları Keşfet
          </Button>
        </Link>
        <Link to="/whatsapp-groups">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Grup Ekle
          </Button>
        </Link>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockGroups.map((g) => (
        <Card key={g.id} className="border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{g.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> {g.members} üye
                  </p>
                </div>
              </div>
              <Badge variant={g.joined ? "default" : "outline"} className="shrink-0">
                {g.joined ? "Katıldın" : "Katıl"}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-3">
              <Badge variant="secondary" className="text-[10px]">{g.category}</Badge>
              {g.joined && (
                <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">
                  <ExternalLink className="h-3 w-3" /> Gruba Git
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
      <p className="text-sm text-muted-foreground mb-2">Şehrindeki ve ilgi alanındaki tüm WhatsApp gruplarını keşfet</p>
      <Link to="/whatsapp-groups">
        <Button variant="outline" className="gap-1.5">
          <Globe className="h-4 w-4" /> WhatsApp Grupları Sayfası
        </Button>
      </Link>
    </div>
  </div>
);

export default WhatsAppGroupsTab;