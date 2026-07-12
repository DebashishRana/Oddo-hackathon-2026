import { EmptyState } from "@/features/dashboard/empty-state";

const metrics = [
  { label: "Page views", value: "12,450", delta: "+15.8%" },
  { label: "Active users", value: "3,218", delta: "+8.3%" },
  { label: "Bounce rate", value: "86.5%", delta: "-24.2%" },
];

const workflow = [
  { name: "Onboarding", progress: 86 },
  { name: "Billing", progress: 72 },
  { name: "Support", progress: 48 },
  { name: "Growth", progress: 91 },
];

const bars = [18, 34, 22, 58, 28, 40, 62, 38, 76, 52, 92, 64];

export default function DashboardHomePage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
            <p className="text-sm text-neutral-500">{metric.label}</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div className="text-4xl font-semibold tracking-tight">{metric.value}</div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">{metric.delta}</div>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.9fr]">
        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Sales overview</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">$9,257.51</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-neutral-200 px-3 py-2 text-sm text-neutral-600">Filter</button>
              <button className="rounded-full border border-neutral-200 px-3 py-2 text-sm text-neutral-600">Sort</button>
            </div>
          </div>

          <div className="mt-6 flex h-[300px] items-end gap-3 rounded-[24px] bg-neutral-50 px-4 py-5">
            {bars.map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                <div className="w-full rounded-[16px] bg-gradient-to-t from-[#5b5af7] via-[#7a82ff] to-[#79e3ff]" style={{ height: `${height}%` }} />
                <div className="text-xs text-neutral-400">{index % 3 === 0 ? "Mon" : ""}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Task mix</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">24,473</h2>
            </div>
            <button className="rounded-full border border-neutral-200 px-3 py-2 text-sm text-neutral-600">Weekly</button>
          </div>

          <div className="mt-6 space-y-4">
            {workflow.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-neutral-700">{item.name}</span>
                  <span className="font-medium text-neutral-950">{item.progress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-[#1677ff]" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-neutral-500">Quick actions</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Add your modules here</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["Projects", "Messages", "Billing", "Analytics"].map((item) => (
              <div key={item} className="rounded-[22px] border border-neutral-200 bg-neutral-50 px-4 py-5 text-sm font-medium text-neutral-800">
                {item}
              </div>
            ))}
          </div>
        </section>

        <EmptyState
          title="No custom modules yet"
          description="Use this shell for the first version of your own product. The auth, layout, and database plumbing are already in place."
          actionLabel="Start with src/features and server/src/modules"
        />
      </div>
    </div>
  );
}
