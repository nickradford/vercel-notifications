import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export type ButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

export function Button(props: ButtonProps) {
	return (
		<button
			type="submit"
			{...props}
			className={`p-2 px-4 rounded bg-neutral-800 ${props.className}`}
		/>
	);
}
