import { JSX } from "preact";

export default function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  const { disabled, className = "", ...rest } = props;

  const baseClass = `
    w-full px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
    ${
    disabled
      ? "bg-gray-500 text-gray-300 opacity-50 cursor-not-allowed"
      : "bg-gray-700 hover:bg-gray-600 text-white"
  }
  `;

  return (
    <button
      {...rest}
      disabled={disabled}
      class={`${baseClass} ${className}`}
    >
      {props.children}
    </button>
  );
}
