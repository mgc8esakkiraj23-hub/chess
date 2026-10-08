import { useEffect, useRef } from 'react';
import type { MoveEntryWithCaptured } from '@/hooks/useChessGame';

interface MoveHistoryProps {
  history: MoveEntryWithCaptured[];
}

export default function MoveHistory({ history }: MoveHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length]);

  const pairs: { white?: MoveEntryWithCaptured; black?: MoveEntryWithCaptured }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      white: history[i],
      black: history[i + 1],
    });
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-amber-200/80 uppercase tracking-wider">
        Move History
      </h3>
      <div
        ref={scrollRef}
        className="max-h-[200px] overflow-y-auto rounded-lg bg-stone-900/40 border border-stone-700/30"
      >
        {pairs.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-stone-500">
            No moves yet. Make your first move!
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {pairs.map((pair, idx) => (
                <tr
                  key={idx}
                  className="border-b border-stone-800/40 last:border-0 hover:bg-stone-800/30 transition-colors"
                >
                  <td className="px-3 py-1.5 text-stone-500 font-mono text-xs w-10">
                    {idx + 1}.
                  </td>
                  <td className="px-2 py-1.5 text-stone-200 font-mono text-xs">
                    {pair.white?.san || ''}
                  </td>
                  <td className="px-2 py-1.5 text-stone-400 font-mono text-xs">
                    {pair.black?.san || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
