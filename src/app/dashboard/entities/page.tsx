import { EmptyState } from "@/features/dashboard/empty-state";

const sampleRows = [
  { name: "Alpha Workspace", type: "Organization", status: "Active" },
  { name: "Beta Demo", type: "Project", status: "Draft" },
];

export default function EntitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Example page</p>
        <h1 className="font-display text-3xl font-semibold">Entities</h1>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <table className="w-full text-left">
          <thead className="border-b border-neutral-200 text-sm text-neutral-500">
            <tr>
              <th className="px-5 py-4 font-medium">Name</th>
              <th className="px-5 py-4 font-medium">Type</th>
              <th className="px-5 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sampleRows.map((row) => (
              <tr key={row.name} className="border-b border-neutral-100 last:border-0">
                <td className="px-5 py-4">{row.name}</td>
                <td className="px-5 py-4 text-neutral-600">{row.type}</td>
                <td className="px-5 py-4 text-neutral-600">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EmptyState
        title="No real entities connected yet"
        description="Replace this placeholder with your own module-specific data table, CRUD, or workflow screen."
      />
    </div>
  );
}
