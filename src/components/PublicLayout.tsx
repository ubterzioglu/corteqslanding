import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";

export default function PublicLayout() {
  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
}
