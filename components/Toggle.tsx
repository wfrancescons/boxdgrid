import { JSX } from "preact";

export default function Toggle(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        {...props}
        type="checkbox"
        className="toggle sr-only peer"
      />
    </label>
  );
}
