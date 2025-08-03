import { JSX } from "preact";

export default function TextInput(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full p-2 text-sm text-white rounded-md bg-neutral-300/30 font-medium"
      type="text"
    />
  );
}
