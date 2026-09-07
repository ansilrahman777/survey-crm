import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

function titleFor(pathname) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/enquiries/new")) return "Enquiry registration";
  if (pathname.match(/\/enquiries\/.+\/edit/)) return "Edit enquiry";
  if (pathname.match(/\/enquiries\/.+/)) return "Enquiry view";
  if (pathname.startsWith("/enquiries")) return "Enquiries";
  if (pathname.startsWith("/requests/")) return "Site visit request";
  if (pathname.startsWith("/requests")) return "Internal requests";
  if (pathname.startsWith("/activities")) return "Activity master";
  return "Surveyor CRM";
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={titleFor(pathname)} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
