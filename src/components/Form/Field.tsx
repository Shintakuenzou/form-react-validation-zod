import { HtmlHTMLAttributes } from "react";

interface FieldProps extends HtmlHTMLAttributes<HTMLDivElement> {}

export function Field(props: FieldProps) {
  return <div className="flex flex-col gap-1" {...props} />;
}
