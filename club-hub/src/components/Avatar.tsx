import React from 'react';

/** Props for displaying a user or club avatar. */
interface AvatarProps {
  avatar?: string | null;
  size?: number; // pixel size
}

/**
 * Circular avatar image with fallback emoji. Accepts base64 image data.
 */
export default function Avatar({ avatar, size = 32 }: AvatarProps) {
  const dimension = { width: size, height: size } as React.CSSProperties;
  return (
    <div
      style={dimension}
      className="rounded-full overflow-hidden flex items-center justify-center bg-orange-100"
    >
      {avatar ? (
        <img
          src={`data:image/png;base64,${avatar}`}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-lg">👤</span>
      )}
    </div>
  );
}
