interface ApiErrorLabelProps {
  errorMessage: string;
}

export default function ApiErrorLabel({ errorMessage }: ApiErrorLabelProps) {
  if (!errorMessage) return null;

  return (
    <div className="label flex-none">
      <span className="label-text-alt text-error md:text-xs">
        {errorMessage}
      </span>
    </div>
  );
}
