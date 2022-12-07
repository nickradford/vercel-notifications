import { DetailedHTMLProps, InputHTMLAttributes } from "react";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={`w-full p-2 pl-8 rounded outline-none bg-neutral-800 focus:bg-neutral-700 focus:ring focus:ring-neutral-600 ${props.className}`}
    />
  );
}
