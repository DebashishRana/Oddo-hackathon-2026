import Link from "next/link";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const statCards = [
  { label: "Employees", value: "128", tone: "from-indigo-600 to-violet-600" },
  { label: "Assets", value: "2,348", tone: "from-cyan-500 to-sky-500" },
  { label: "Requests", value: "36 open", tone: "from-emerald-500 to-teal-500" },
];

export function AuthShell({ eyebrow, title, subtitle, children }: Props) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-xl">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                AF
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight">AssetFlow</p>
                <p className="text-sm text-slate-500">ERP for assets and resources</p>
              </div>
            </Link>

            <div className="mt-14 text-center lg:mt-20">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">{eyebrow}</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
              <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-500">{subtitle}</p>
            </div>

            <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-8">
              {children}
            </div>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,_#5b5ef7_0,_#4338ca_28%,_#312e81_72%,_#1e1b4b_100%)] text-white lg:flex lg:flex-col lg:justify-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-10 top-10 h-44 w-44 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute right-12 top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute bottom-10 left-24 h-60 w-60 rounded-full bg-indigo-300/20 blur-3xl" />
          </div>

          <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-10 px-10 py-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">Operations, simplified</p>
              <h2 className="mt-6 max-w-xl text-5xl font-semibold leading-tight tracking-tight">
                Effortlessly manage your team and assets.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-white/75">
                Capture requests, assign work, and keep your workspace moving with a clean starter that already knows how to authenticate users.
              </p>
            </div>

            <div className="relative rounded-[32px] border border-white/15 bg-white/10 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.28)] backdrop-blur">
              <div className="rounded-[28px] bg-slate-50 p-5 text-slate-900">
                <div className="grid gap-4 sm:grid-cols-3">
                  {statCards.map((card) => (
                    <div key={card.label} className={`rounded-[24px] bg-gradient-to-br ${card.tone} p-[1px]`}>
                      <div className="rounded-[23px] bg-white/96 px-4 py-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                        <p className="mt-3 text-2xl font-semibold tracking-tight">{card.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
                  <div className="rounded-[24px] bg-slate-950 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-white/55">Asset intake</p>
                        <p className="mt-2 text-lg font-semibold">Today&apos;s dashboard</p>
                      </div>
                      <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Live
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {[72, 54, 86, 41].map((value, index) => (
                        <div key={index}>
                          <div className="mb-1 flex items-center justify-between text-xs text-white/60">
                            <span>Workspace {index + 1}</span>
                            <span>{value}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10">
                            <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400" style={{ width: `${value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-950">Recent activity</p>
                      <p className="text-xs text-slate-500">Today</p>
                    </div>

                    <div className="mt-4 space-y-3">
                      {["Laptop issued", "Seat reassigned", "New hire added"].map((item, index) => (
                        <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-xs font-semibold text-white">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-950">{item}</p>
                            <p className="text-xs text-slate-500">AssetFlow update</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
