import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEnquiries } from "../hooks/useEnquiries";
import { StatusBadge } from "../components/ui/Badge";
import { StatCard } from "../components/ui/StatCard";
import { ConnectionBanner } from "../components/ui/ConnectionBanner";
import { Inbox, Clock, CalendarClock, CircleCheck } from "lucide-react";
import { formatDate } from "../lib/utils";

export default function DashboardPage() {
  const { enquiries, connected, refresh } = useEnquiries();

  const total = enquiries.length;
  const pending = enquiries.filter((e) => !["QUOTATION_DELIVERED", "SALES_ORDER_CREATED"].includes(e.currentStatus)).length;
  const withDeadline = enquiries.filter((e) => e.deadlineOfSubmission).length;
  const salesOrders = enquiries.filter((e) => e.currentStatus === "SALES_ORDER_CREATED").length;

  return (
    <div className="space-y-6">
      <ConnectionBanner connected={connected} onRetry={refresh} />

      <div>
        <h2 className="font-display text-xl font-semibold text-ink-950">Good to see you, Ansil</h2>
        <p className="mt-1 text-sm text-ink-400">Here's where the enquiry pipeline stands today.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total enquiries" value={total} icon={Inbox} />
        <StatCard label="Pending" value={pending} icon={Clock} accent />
        <StatCard label="With a deadline" value={withDeadline} icon={CalendarClock} />
        <StatCard label="Sales orders created" value={salesOrders} icon={CircleCheck} />
      </div>

      <div className="rounded-xl bg-white ring-1 ring-ink-100">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h3 className="font-display text-sm font-semibold text-ink-900">Recent enquiries</h3>
          <Link to="/enquiries" className="flex items-center gap-1 text-sm font-medium text-signal-600 hover:text-signal-700">
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ul className="divide-y divide-ink-50">
          {enquiries.slice(0, 6).map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-900">{e.customerName}</p>
                <p className="truncate font-mono text-xs text-ink-400">{e.enquiryNumber}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span className="hidden text-xs text-ink-400 md:block">{formatDate(e.dateOfEnquiry)}</span>
                <StatusBadge status={e.currentStatus} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
