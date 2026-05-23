import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminRolesDraftPage = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Roller (Taslak)</CardTitle>
          <CardDescription>
            Bu alan, üye rollerini ve yetki modelini kademeli olarak netleştirmek için taslak çalışma sayfasıdır.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Planlanan kapsam:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Bireysel kullanıcı rolleri</li>
            <li>Admin alt rol kırılımları</li>
            <li>Route ve işlem bazlı yetki matrisi</li>
            <li>Geçiş/migrasyon adımları</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolesDraftPage;
