import React from 'react';

/** Props accepted by the shared `Button` component. */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Styled button with orange primary variant and disabled styling.
 * Accepts all native button attributes.
 */
export default function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50 ${
        props.className ?? ''
      }`}
    />
  );
}
