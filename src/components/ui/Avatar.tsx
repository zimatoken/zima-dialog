import React from 'react';

type Props = {
  src?: string;
  alt?: string;
  size?: 32 | 48 | 64;
  showBorder?: boolean;
};

export const Avatar: React.FC<Props> = ({ src, alt = 'avatar', size = 48, showBorder = true }) => {
  const px = `${size}px`;
  return (
    <div
      style={{ width: px, height: px }}
      className={
        showBorder
          ? 'rounded-full border-2 border-zima-deep overflow-hidden'
          : 'rounded-full overflow-hidden'
      }
    >
      {src ? (
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div className="w-full h-full bg-zima-deep flex items-center justify-center text-snow-white">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};