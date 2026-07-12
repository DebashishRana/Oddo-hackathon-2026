import Link from "next/link";

const featureCards = [
  {
    title: "Employees",
    copy: "Keep people, departments, and access levels in one place.",
    tint: "from-indigo-500 to-blue-500",
  },
  {
    title: "Assets",
    copy: "Track equipment, assignments, and handoffs without heavy setup.",
    tint: "from-cyan-500 to-sky-500",
  },
  {
    title: "Requests",
    copy: "Capture service requests and approvals with clean starter flows.",
    tint: "from-emerald-500 to-teal-500",
  },
  {
    title: "Reports",
    copy: "Add dashboards and exports when your first workflow is ready.",
    tint: "from-slate-700 to-slate-950",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
            AF
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">AssetFlow</p>
            <p className="text-xs text-slate-500">ERP starter for assets and resources</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#deploy">Deploy</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200/70" href="/auth/signin">
            Log in
          </Link>
          <Link className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-indigo-500 hover:to-blue-500" href="/auth/signup">
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-20 pt-12 text-center lg:px-8 lg:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
          Ready-made auth, dashboard, and database plumbing
        </div>

        <h1 className="mt-8 max-w-5xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-[84px] lg:leading-[0.96]">
          Asset management
          <span className="block text-slate-500">without the heavy lift.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
          AssetFlow gives you a clean starting point for employee auth, Google sign-in, email verification, password reset, and a dashboard shell you can ship from.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:from-indigo-500 hover:to-blue-500" href="/auth/signup">
            Create account
          </Link>
          <Link className="rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100" href="/auth/signin">
            Sign in
          </Link>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">What&apos;s included</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">A starter that already feels like a product.</h2>
          </div>
          <Link href="/dashboard" className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 lg:inline-flex">
            Open dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {featureCards.map((card) => (
            <article key={card.title} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
              <div className="p-6">
                <p className="text-sm text-slate-500">{card.title}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{card.copy}</h3>
              </div>
              <div className={`min-h-[240px] bg-gradient-to-br ${card.tint} p-6`}>
                <div className="h-full rounded-[24px] border border-white/20 bg-white/90 p-5 text-left shadow-xl backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Template preview</p>
                  <div className="mt-3 text-2xl font-semibold text-slate-950">Plug in your own modules</div>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-700">
                    The auth, dashboard, and database layers are already wired, so your first feature can start from a clean shell.
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-[32px] bg-slate-950 px-6 py-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Workflow</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Ship from employee signup to live dashboard.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                Use the same app structure to add approvals, inventory, maintenance, procurement, or anything else your team needs next.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {["Auth", "Dashboard", "Modules"].map((item, index) => (
                <div key={item} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">{item}</p>
                  <p className="mt-4 text-3xl font-semibold">{index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer id="deploy" className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-950">AssetFlow</p>
            <p className="mt-2 text-sm text-slate-500">A clean starter for hackathons and SaaS apps.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-500">
            <Link href="/auth/signin" className="rounded-full border border-slate-200 px-4 py-2 transition hover:bg-slate-100">
              Sign in
            </Link>
            <Link href="/auth/signup" className="rounded-full border border-slate-200 px-4 py-2 transition hover:bg-slate-100">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
