import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { StatusBadge, ProjectStatusPill } from "../../components/ui/Badge";
import { formatDate, initials } from "../../lib/utils";

const columns = [
  "Enquiry Number",
  "Current Status",
  "Date of Enquiry",
  "Project Status",
  "Lead",
  "Name of Customer",
  "Scope of Activities",
  "Project Name",
  "Submission Deadline",
  "",
];

function scopeSummary(enquiry) {
  const projects = enquiry.projectInformations || [];
  const activities = projects.flatMap((p) => (p.scopeOfServices || []).map((s) => s.activityName)).filter(Boolean);
  if (!activities.length) return "—";
  if (activities.length <= 2) return activities.join(", ");
  return `${activities.slice(0, 2).join(", ")} +${activities.length - 2} more`;
}

function projectNameSummary(enquiry) {
  const projects = enquiry.projectInformations || [];
  if (!projects.length) return "—";
  if (projects.length === 1) return projects[0].projectName;
  return `${projects[0].projectName} +${projects.length - 1} more`;
}

export function EnquiryTable({ enquiries, onRowClick, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-ink-100">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs text-ink-400">
              {columns.map((col) => (
                <th key={col} className="whitespace-nowrap px-5 py-3 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry, i) => (
              <motion.tr
                key={enquiry.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i, 8) * 0.03 }}
                className="group cursor-pointer border-b border-ink-50 last:border-0 hover:bg-ink-50/60"
                onClick={() => onRowClick(enquiry)}
              >
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-medium text-ink-900">
                  {enquiry.enquiryNumber}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={enquiry.currentStatus} />
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-ink-500">{formatDate(enquiry.dateOfEnquiry)}</td>
                <td className="px-5 py-3.5">
                  <ProjectStatusPill status={enquiry.projectStatus} />
                </td>
                <td className="px-5 py-3.5">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-100 text-[10px] font-semibold text-ink-600"
                    title={enquiry.projectLead}
                  >
                    {initials(enquiry.projectLead || "No Lead")}
                  </div>
                </td>
                <td className="px-5 py-3.5 font-medium text-ink-900">{enquiry.customerName}</td>
                <td className="max-w-[220px] truncate px-5 py-3.5 text-ink-600">{scopeSummary(enquiry)}</td>
                <td className="max-w-[220px] truncate px-5 py-3.5 text-ink-600">{projectNameSummary(enquiry)}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-ink-400">
                  {enquiry.deadlineOfSubmission ? formatDate(enquiry.deadlineOfSubmission) : "—"}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(enquiry);
                      }}
                      className="rounded-md p-1.5 text-ink-400 hover:bg-white hover:text-ink-900"
                      aria-label={`Edit ${enquiry.enquiryNumber}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(enquiry);
                      }}
                      className="rounded-md p-1.5 text-ink-400 hover:bg-signal-50 hover:text-signal-600"
                      aria-label={`Delete ${enquiry.enquiryNumber}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
