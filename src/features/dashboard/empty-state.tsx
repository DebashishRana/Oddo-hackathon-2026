type Props = {
  title: string;
  description: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionLabel }: Props) {
  return (
    <div className="rounded-[28px] border border-dashed border-neutral-200 bg-white p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
      <h2 className="text-xl font-semibold text-neutral-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-500">{description}</p>
      {actionLabel ? (
        <div className="mt-6 inline-flex rounded-full border border-[#1677ff]/20 bg-[#1677ff]/10 px-4 py-2 text-sm text-[#1677ff]">
          {actionLabel}
        </div>
      ) : null}
    </div>
  );
}
