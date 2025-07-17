import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

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
