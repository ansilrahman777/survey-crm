import { Menu, Search, Bell } from "lucide-react";
import { initials } from "../../lib/utils";

export function Topbar({ title, onMenuClick }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-ink-100 bg-white px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-ink-500 hover:bg-ink-50 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="font-display text-[17px] font-semibold text-ink-950">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <input
            type="search"
            placeholder="Search enquiries, clients…"
            className="h-9 w-64 rounded-lg bg-ink-50 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 ring-1 ring-inset ring-transparent focus:bg-white focus:ring-signal-500"
          />
        </div>
        <button className="relative rounded-lg p-2 text-ink-500 hover:bg-ink-50" aria-label="Notifications">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-signal-500" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
          {initials("Ansil Rahman")}
        </div>
      </div>
    </header>
  );
}
