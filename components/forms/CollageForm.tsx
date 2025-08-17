import { ComponentChildren } from "preact";

interface CollageFormProps {
  children: ComponentChildren;
}

export default function CollageForm(
  {
    children,
  }: CollageFormProps,
) {
  return (
    <div className="card-body">
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <span class="flex items-center gap-2 md:text-sm font-medium">
          Create your collage
        </span>
        {children}
      </form>
    </div>
  );
}
