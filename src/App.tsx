import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import AdminReferralPage from "@/pages/admin/AdminReferralPage";
import AdminReferralSourcesPage from "@/pages/admin/AdminReferralSourcesPage";
import AdminReferralGroupsPage from "@/pages/admin/AdminReferralGroupsPage";
import AdminReferralTypesPage from "@/pages/admin/AdminReferralTypesPage";
import AdminAboutPage from "@/pages/admin/AdminAboutPage";
import AdminMarqueePage from "@/pages/admin/AdminMarqueePage";
import AdminAdvisorLinksPage from "@/pages/admin/AdminAdvisorLinksPage";
import AdminSocialMediaLinksPage from "@/pages/admin/AdminSocialMediaLinksPage";
import { muhasebeRoutes } from "@/pages/admin/muhasebe/routes";
import Founding1000Page from "./pages/Founding1000Page.tsx";
import BloggerContestPage from "./pages/BloggerContestPage.tsx";
import VloggerContestPage from "./pages/VloggerContestPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/radar" element={<RadarPage />} />
          <Route path="/commercial" element={<CommercialIndexPage />} />
          <Route path="/commercial/:slug" element={<CommercialDocumentPage />} />
          <Route path="/diaspora/:slug" element={<DiasporaDetailPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/members" replace />} />
            <Route path="members" element={<AdminMembersPage />} />
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
            <Route path="about" element={<AdminAboutPage />} />
            {muhasebeRoutes}
          </Route>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/form"         element={<FormPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/founding-1000" element={<Founding1000Page />} />
          <Route path="/blogger-yarismasi" element={<BloggerContestPage />} />
          <Route path="/vlogger-yarismasi" element={<VloggerContestPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
