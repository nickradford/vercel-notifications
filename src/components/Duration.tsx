import pretty from "pretty-ms";

export function Duration({ start, end }: { start: number; end: number }) {
  return (
    <time className="text-neutral-500">
      {pretty(Math.round((end - start) / 1000) * 1000, { compact: false })}
    </time>
  );
}
