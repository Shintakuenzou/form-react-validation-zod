import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  w?: string;
}

export function Input(props: InputProps) {
  const { register } = useFormContext();
  return (
    <input
      type="text"
      className={` ${
        props.w ? `w-${props.w}` : ""
      } flex-1 h-10 bg-zinc-100 shadow-sm border border-zinc-300 rounded px-2 py-2  focus:outline-none focus:ring-2 focus:ring-indigo-800`}
      {...props}
      {...register(props.name)}
    />
  );
}
