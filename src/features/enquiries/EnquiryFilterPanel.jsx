import { useState } from "react";
import { Checkbox } from "../../components/ui/Checkbox";
import { Button } from "../../components/ui/Button";
import { ENQUIRY_FILTER_TASKS } from "../../lib/constants";

export function EnquiryFilterPanel({ activeTasks, onApply, onClose }) {
  const [draft, setDraft] = useState(activeTasks);

  const toggle = (key) => {
    setDraft((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  return (
    <div className="w-64 shrink-0 rounded-xl bg-white p-4 ring-1 ring-ink-100">
      <p className="mb-3 text-xs font-semibold tracking-wide text-ink-400">Filter by task</p>
      <div className="space-y-2.5">
        {ENQUIRY_FILTER_TASKS.map((task) => (
          <Checkbox key={task.key} label={task.label} checked={draft.includes(task.key)} onChange={() => toggle(task.key)} />
        ))}
      </div>
      <p className="mt-4 text-xs italic text-ink-400">
        *Default filter view: pending enquiries — sales quotations not yet submitted.
      </p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" onClick={() => onApply(draft)}>
          Apply
        </Button>
        <Button size="sm" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
