import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import FormPage from "./pages/FormPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.tsx";
import DiasporaDetailPage from "./pages/DiasporaDetailPage.tsx";
import RadarPage from "./pages/RadarPage.tsx";
import CommercialIndexPage from "./pages/CommercialIndexPage.tsx";
import CommercialDocumentPage from "./pages/CommercialDocumentPage.tsx";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminMembersPage from "@/pages/admin/AdminMembersPage";
import AdminLansmanPage from "@/pages/AdminLansmanPage.tsx";
import AdminReferralPage from "@/pages/admin/AdminReferralPage";
import AdminReferralSourcesPage from "@/pages/admin/AdminReferralSourcesPage";
import AdminReferralGroupsPage from "@/pages/admin/AdminReferralGroupsPage";
import AdminReferralTypesPage from "@/pages/admin/AdminReferralTypesPage";
import AdminAboutPage from "@/pages/admin/AdminAboutPage";
import AdminMarqueePage from "@/pages/admin/AdminMarqueePage";
import AdminAdvisorLinksPage from "@/pages/admin/AdminAdvisorLinksPage";
import AdminSocialMediaLinksPage from "@/pages/admin/AdminSocialMediaLinksPage";
import AdminHomePage from "@/pages/admin/AdminHomePage";
import AdminWorkspaceHomePage from "@/pages/admin/workspace/AdminWorkspaceHomePage";
import AdminCommandCenterPage from "@/pages/admin/workspace/AdminCommandCenterPage";
import AdminResourcesPage from "@/pages/admin/workspace/AdminResourcesPage";
import AdminTodoWorkspacePage from "@/pages/admin/workspace/AdminTodoWorkspacePage";
import AdminMeetingNotesWorkspacePage from "@/pages/admin/workspace/AdminMeetingNotesWorkspacePage";
import AdminMvpWorkspacePage from "@/pages/admin/workspace/AdminMvpWorkspacePage";
import AdminWorkspaceDocPage from "@/pages/admin/workspace/AdminWorkspaceDocPage";
import { muhasebeRoutes } from "@/pages/admin/muhasebe/routes";
import Founding1000Page from "./pages/Founding1000Page.tsx";
import BloggerContestPage from "./pages/BloggerContestPage.tsx";
import VloggerContestPage from "./pages/VloggerContestPage.tsx";
import ScrollTopButton from "@/components/ScrollTopButton";
import PublicLayout from "@/components/PublicLayout";
import LansmanPage from "./pages/LansmanPage.tsx";
import FoundersPage from "./pages/FoundersPage.tsx";
import May19CampaignPage from "./pages/May19CampaignPage.tsx";
import May19MapPage from "./pages/May19MapPage.tsx";
import AddWhatsAppPage from "./pages/AddWhatsAppPage.tsx";
import AdminWhatsAppLandingsPage from "@/pages/admin/AdminWhatsAppLandingsPage";
import AIFormPage from "./pages/AIFormPage.tsx";
import AdminMay19IdeaPage from "@/pages/admin/AdminMay19IdeaPage";
import AdminMay19MomentPage from "@/pages/admin/AdminMay19MomentPage";

const queryClient = new QueryClient();

const WhatsAppGroupDetailRedirect = () => {
  const { id } = useParams<{ id: string }>();

  return <Navigate to={`/addwa?group=${encodeURIComponent(id ?? "")}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/hakkimizda" element={<AboutPage />} />
              <Route path="/founders" element={<FoundersPage />} />
              <Route path="/radar" element={<RadarPage />} />
              <Route path="/commercial" element={<CommercialIndexPage />} />
              <Route path="/commercial/:slug" element={<CommercialDocumentPage />} />
              <Route path="/diaspora/:slug" element={<DiasporaDetailPage />} />
              <Route path="/lansman" element={<LansmanPage />} />
              <Route path="/founding-1000" element={<Founding1000Page />} />
              <Route path="/blogger-yarismasi" element={<BloggerContestPage />} />
              <Route path="/vlogger-yarismasi" element={<VloggerContestPage />} />
              <Route path="/19051919" element={<May19CampaignPage />} />
              <Route path="/19051919/harita" element={<May19MapPage />} />
              <Route path="/addwa" element={<AddWhatsAppPage />} />
              <Route path="/aiform" element={<AIFormPage />} />
              <Route path="/form" element={<FormPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/whatsapp-groups" element={<Navigate to="/addwa" replace />} />
            <Route path="/whatsapp-groups/:id" element={<WhatsAppGroupDetailRedirect />} />
            <Route path="/contributor" element={<Navigate to="/commercial/contributor" replace />} />
            <Route path="/influencer-partner" element={<Navigate to="/commercial/influencer-partner" replace />} />
            <Route path="/strategic-partner" element={<Navigate to="/commercial/strategic-partner" replace />} />
            <Route path="/community-leader" element={<Navigate to="/commercial/community-leader" replace />} />
            <Route path="/ambassador" element={<Navigate to="/commercial/ambassador" replace />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
              <Route path="members" element={<AdminMembersPage />} />
              <Route path="lansman" element={<AdminLansmanPage />} />
              <Route path="referral" element={<AdminReferralPage />} />
              <Route path="referral/sources" element={<AdminReferralSourcesPage />} />
              <Route path="referral/groups" element={<AdminReferralGroupsPage />} />
              <Route path="referral/types" element={<AdminReferralTypesPage />} />
              <Route path="marquee" element={<AdminMarqueePage />} />
              <Route path="advisors">
                <Route index element={<Navigate to="/admin/advisors/consultant" replace />} />
                <Route path=":profile" element={<AdminAdvisorLinksPage />} />
              </Route>
              <Route path="social-media" element={<AdminSocialMediaLinksPage />} />
              <Route path="whatsapp-landings" element={<AdminWhatsAppLandingsPage />} />
              <Route path="may19/kelime" element={<AdminMay19IdeaPage />} />
              <Route path="may19/ani" element={<AdminMay19MomentPage />} />
              <Route path="about" element={<AdminAboutPage />} />
              <Route path="workspace" element={<AdminWorkspaceHomePage />} />
              <Route path="workspace/command-center" element={<AdminCommandCenterPage />} />
              <Route path="workspace/resources" element={<AdminResourcesPage />} />
              <Route path="workspace/resources/arge" element={<Navigate to="/admin/workspace/resources?section=arge" replace />} />
              <Route
                path="workspace/resources/insankaynaklari"
                element={<Navigate to="/admin/workspace/resources?section=insankaynaklari" replace />}
              />
              <Route path="workspace/todos" element={<AdminTodoWorkspacePage />} />
              <Route path="workspace/meeting-notes" element={<AdminMeetingNotesWorkspacePage />} />
              <Route path="workspace/mvp" element={<AdminMvpWorkspacePage />} />
              <Route path="workspace/docs/:slug" element={<AdminWorkspaceDocPage />} />
              {muhasebeRoutes}
            </Route>
          </Routes>
          <ScrollTopButton />
        </>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
