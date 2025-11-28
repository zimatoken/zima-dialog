import React from 'react';

export const FileCard: React.FC<{
  title: string;
  size?: string;
  thumb?: string;
  onOpen?: () => void;
}> = ({ title, size = '—', thumb, onOpen }) => {
  return (
    <div className="w-full bg-[var(--panel)] rounded-xl p-4 shadow-soft flex gap-4 items-center hover:bg-zima-deep/30 transition-colors">
      <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-zima-deep/40 flex items-center justify-center">
        {thumb ? (
          <img src={thumb} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-sm text-zima-ice font-bold">FILE</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-snow-white text-sm truncate">{title}</div>
        <div className="text-xs text-crystal-glow/80 mt-1">{size}</div>
      </div>
      <button
        className="px-3 py-1 rounded-lg border border-zima-ice text-zima-ice text-sm hover:bg-zima-ice hover:text-snow-white transition-colors"
        onClick={onOpen}
      >
        Открыть
      </button>
    </div>
  );
};