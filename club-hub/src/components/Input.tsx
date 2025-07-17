import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
        props.className ?? ''
      }`}
    />
  );
}
