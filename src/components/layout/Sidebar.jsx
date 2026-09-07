import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair,
  Inbox,
  FolderKanban,
  CalendarRange,
  MapPin,
  PencilRuler,
  Receipt,
  Database,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";

const GROUPS = [
  {
    label: "Enquiry & Sales",
    icon: Inbox,
    items: [
      { label: "Enquiry Registration", to: "/enquiries" },
      { label: "Sales Quotation", to: "/coming-soon/sales-quotation" },
      { label: "Sales Orders", to: "/coming-soon/sales-orders" },
      { label: "Direct Sales", to: "/coming-soon/direct-sales" },
      { label: "Sales Follow Up", to: "/coming-soon/sales-follow-up" },
      { label: "Internal Requests", to: "/requests" },
    ],
  },
  {
    label: "Project Management",
    icon: FolderKanban,
    items: [
      { label: "Project Dashboard", to: "/coming-soon/project-dashboard" },
      { label: "Register Comments", to: "/coming-soon/register-comments" },
      { label: "Generate Completion Letter", to: "/coming-soon/completion-letter" },
      { label: "Resource Manager", to: "/coming-soon/resource-manager-projects" },
    ],
  },
  {
    label: "Planning Management",
    icon: CalendarRange,
    items: [
      { label: "Project Dashboard", to: "/coming-soon/planning-dashboard" },
      { label: "Resource Manager", to: "/coming-soon/resource-manager-planning" },
    ],
  },
  {
    label: "Site Management",
    icon: MapPin,
    items: [
      { label: "Today's Schedules", to: "/coming-soon/todays-schedules" },
      { label: "Site Visit Log", to: "/coming-soon/site-visit-log" },
      { label: "Material Request", to: "/coming-soon/material-request" },
      { label: "Monthly & Weekly Hiring", to: "/coming-soon/hiring" },
    ],
  },
  {
    label: "Design Management",
    icon: PencilRuler,
    items: [
      { label: "Projects Dashboard", to: "/coming-soon/design-dashboard" },
      { label: "Cloud Point Register", to: "/coming-soon/cloud-point-register" },
      { label: "Setting-Out Register", to: "/coming-soon/setting-out-register" },
      { label: "QA/QC Register", to: "/coming-soon/qaqc-register" },
      { label: "Production Manager", to: "/coming-soon/production-manager" },
      { label: "Create Certificates", to: "/coming-soon/create-certificates" },
    ],
  },
  {
    label: "Billing Management",
    icon: Receipt,
    items: [
      { label: "Invoice Requests", to: "/coming-soon/invoice-requests" },
      { label: "Payment Tracking", to: "/coming-soon/payment-tracking" },
    ],
  },
  {
    label: "Masters",
    icon: Database,
    items: [
      { label: "Customer Master", to: "/coming-soon/customer-master" },
      { label: "Activity Master", to: "/activities" },
      { label: "UOM", to: "/coming-soon/uom-master" },
      { label: "Resource Master", to: "/coming-soon/resource-master" },
      { label: "Quotation Master", to: "/coming-soon/quotation-master" },
      { label: "Survey Report Master", to: "/coming-soon/survey-report-master" },
      { label: "Benchmark Master", to: "/coming-soon/benchmark-master" },
      { label: "Project Master", to: "/coming-soon/project-master" },
    ],
  },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-600">
        <Crosshair className="h-[18px] w-[18px] text-white" strokeWidth={2.25} />
      </div>
      <div className="leading-none">
        <p className="font-display text-[15px] font-semibold tracking-tight text-white">Surveyor</p>
        <p className="text-[11px] text-ink-400">Survey Ops CRM</p>
      </div>
    </div>
  );
}

function NavGroups({ onNavigate }) {
  const { pathname } = useLocation();
  const [openGroup, setOpenGroup] = useState(() => {
    const activeGroup = GROUPS.find((g) => g.items.some((i) => pathname.startsWith(i.to.split("/:")[0]) && i.to !== "/coming-soon"));
    return activeGroup?.label ?? GROUPS[0].label;
  });

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
      {GROUPS.map((group) => {
        const isOpen = openGroup === group.label;
        return (
          <div key={group.label}>
            <button
              onClick={() => setOpenGroup(isOpen ? null : group.label)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 transition-colors hover:bg-ink-900/60 hover:text-white"
            >
              <group.icon className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1 text-left">{group.label}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <div className="ml-[27px] space-y-0.5 border-l border-ink-800 py-1 pl-3">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.label}
                        to={item.to}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          cn(
                            "block rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                            isActive ? "bg-ink-900 text-white" : "text-ink-400 hover:bg-ink-900/60 hover:text-white",
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col bg-ink-950 lg:flex">
      <Brand />
      <NavGroups />
      <div className="border-t border-ink-800 px-5 py-4">
        <p className="text-[11px] leading-relaxed text-ink-500">Falcon Group survey division · field-to-office enquiry handling</p>
      </div>
    </aside>
  );
}

export function MobileSidebar({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div className="absolute inset-0 bg-ink-950/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="relative flex h-full w-72 flex-col bg-ink-950"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
          >
            <div className="flex items-center justify-between">
              <Brand />
              <button onClick={onClose} className="mr-4 rounded-lg p-1.5 text-ink-400 hover:bg-ink-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavGroups onNavigate={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
