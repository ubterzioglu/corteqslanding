import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminAboutPage = () => (
  <Card>
    <CardHeader>
      <CardTitle>Admin Hakkında</CardTitle>
      <CardDescription>Bu panel üyeler ve referral yönetimini güvenli şekilde ölçeklemek için modülerleştirildi.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2 text-sm text-muted-foreground">
      <p>UTF-8 karakter bütünlüğü korunur.</p>
      <p>Members ekranı server-side pagination ve kolon bazlı filtreleme kullanır.</p>
      <p>Referral domain kaynak/tip/kod olarak normalize edilmiştir.</p>
    </CardContent>
  </Card>
);

export default AdminAboutPage;
