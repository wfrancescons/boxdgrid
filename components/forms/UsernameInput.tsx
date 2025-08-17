import { Signal } from "@preact/signals";
import UserIcon from "../icons/UserIcon.tsx";

interface UsernameInputProps {
  apiError: string;
  value: Signal<string>;
}

export default function UsernameInput(
  { apiError, value }: UsernameInputProps,
) {
  return (
    <div class="flex flex-col gap-1">
      <label
        class={`input md:input-sm input-border ${
          apiError ? "input-error" : ""
        } flex max-w-none items-center gap-2`}
      >
        <UserIcon className="h-3 w-3 opacity-70 fill-current" />
        <input
          type="text"
          class="grow"
          name="letterboxd-username"
          placeholder={"Letterboxd username"}
          onInput={(
            e,
          ) => (value.value = (e.target as HTMLInputElement).value)}
        />
      </label>
    </div>
  );
}
