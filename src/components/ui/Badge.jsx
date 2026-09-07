import { STATUS_STYLES, STATUS_LABEL, PROJECT_STATUS_LABEL } from "../../lib/constants";
import { cn } from "../../lib/utils";

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status] ?? STATUS_STYLES.SELECT,
        className,
      )}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function ProjectStatusPill({ status }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-600 ring-1 ring-inset ring-ink-100">
      {PROJECT_STATUS_LABEL[status] ?? status}
    </span>
  );
}
