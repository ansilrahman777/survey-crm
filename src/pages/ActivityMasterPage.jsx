import { useState } from "react";
import { Plus } from "lucide-react";
import { useActivities } from "../hooks/useActivities";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Field";
import { ConnectionBanner } from "../components/ui/ConnectionBanner";

export default function ActivityMasterPage() {
  const { activities, source, addActivity } = useActivities();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await addActivity(name.trim());
    setName("");
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ConnectionBanner connected={source === "api"} onRetry={() => {}} />
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-950">Activity master</h1>
        <p className="mt-1 text-sm text-ink-400">
          Populates the Activity Name dropdown on the enquiry's Scope of Services table.
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 rounded-xl bg-white p-4 ring-1 ring-ink-100">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bathymetric Survey" className="flex-1" />
        <Button type="submit" disabled={saving || !name.trim()}>
          <Plus className="h-4 w-4" />
          Add activity
        </Button>
      </form>

      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-ink-100">
        <ul className="divide-y divide-ink-50">
          {activities.map((a) => (
            <li key={a.activityId} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="font-medium text-ink-900">{a.activityName}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.active ? "bg-emerald-50 text-emerald-700" : "bg-ink-100 text-ink-400"}`}>
                {a.active ? "Active" : "Inactive"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
