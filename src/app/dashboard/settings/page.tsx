import { EmptyState } from "@/features/dashboard/empty-state";

const settings = [
  { label: "Brand name", value: "AssetFlow" },
  { label: "Session policy", value: "JWT cookie" },
  { label: "Database", value: "Postgres" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Example page</p>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {settings.map((setting) => (
          <div key={setting.label} className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
            <p className="text-sm text-neutral-500">{setting.label}</p>
            <p className="mt-2 text-lg font-medium">{setting.value}</p>
          </div>
        ))}
      </div>

      <EmptyState
        title="Config surface ready"
        description="Add environment-driven toggles, team settings, billing, and any other generic SaaS options here."
      />
    </div>
  );
}
