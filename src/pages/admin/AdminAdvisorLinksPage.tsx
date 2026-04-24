import AdminResourceLinksPage from "@/pages/admin/AdminResourceLinksPage";

const AdminAdvisorLinksPage = () => (
  <AdminResourceLinksPage
    tableName="advisor_social_media_links"
    title="Danışman/SM Linkleri"
    description="Danışman ve sosyal medya odaklı kaynak linklerini yönetin."
    emptyMessage="Henüz danışman/SM kaydı yok."
  />
);

export default AdminAdvisorLinksPage;
