"use client";

import { useMemo } from "react";
import { Plus, Loader2 } from "lucide-react";

type AvatarTemplate = {
  id: string;
  imageUrl: string;
  label?: string;
};

type Props = {
  templates: AvatarTemplate[];
  selectedId?: string | null;
  pendingId?: string | null; // show per-item spinner while assigning
  onSelect: (tpl: AvatarTemplate) => void;
  // Optional “add/upload” slots like in the screenshot
  showAddSlots?: number; // e.g. 0, 1, or 2
  onAddClick?: () => void;
  className?: string;
  title?: string;
};

export default function AvatarTemplateSelector({
  templates,
  selectedId,
  pendingId,
  onSelect,
  showAddSlots = 0,
  onAddClick,
  className,
  title = "Select Your Avatar",
}: Props) {
  // In case you want to sort/filter beforehand:
  const items = useMemo(() => templates, [templates]);

  return (
    <section className={className}>
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">
        {title}
      </h2>

      {/* Dynamic responsive grid:
         auto-fit as many 7.5rem cells as will fit the row */}
      <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))]">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          const isPending = pendingId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => !isPending && onSelect(item)}
              disabled={isPending}
              aria-pressed={isSelected}
              className={[
                "relative isolate flex flex-col items-center",
                "rounded-2xl p-3 bg-white border border-gray-200 shadow-sm",
                "transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500",
                isPending ? "opacity-60 cursor-wait" : "",
              ].join(" ")}
            >
              {/* Circular avatar preview */}
              <div
                className={[
                  "relative aspect-square w-full max-w-[7.5rem] overflow-hidden rounded-full",
                  "bg-gray-100",
                  isSelected
                    ? "ring-4 ring-indigo-600"
                    : "ring-2 ring-transparent group-hover:ring-indigo-200",
                ].join(" ")}
              >
                <img
                  src={item.imageUrl}
                  alt={item.label ?? `Template ${item.id}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />

                {/* Pending overlay */}
                {isPending && (
                  <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-[1px]">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-700" />
                  </div>
                )}
              </div>

              {/* Label / ID */}
              <div className="mt-2 w-full text-center">
                <span
                  className="block truncate text-sm font-medium text-gray-900"
                  title={item.label ?? item.id}
                >
                  {item.label ?? `Avatar ${item.id}`}
                </span>
              </div>
            </button>
          );
        })}

        {/* Optional “add/upload” placeholders like in the screenshot */}
        {Array.from({ length: showAddSlots }).map((_, i) => (
          <button
            key={`add-slot-${i}`}
            type="button"
            onClick={onAddClick}
            className={[
              "relative flex flex-col items-center rounded-2xl p-3",
              "bg-white border border-gray-200 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500",
            ].join(" ")}
          >
            <div className="relative aspect-square w-full max-w-[7.5rem] rounded-full bg-emerald-300/70 grid place-items-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-rose-400" />
              <Plus className="h-7 w-7 text-rose-600" />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">Add</span>
          </button>
        ))}
      </div>
    </section>
  );
}
