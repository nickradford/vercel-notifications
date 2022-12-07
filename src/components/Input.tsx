import { DetailedHTMLProps, InputHTMLAttributes } from "react";

type InputProps = DetailedHTMLProps<
	InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	icon: React.ReactNode;
};

export function Input(props: InputProps) {
	return (
		<span className="relative w-full">
			<input
				{...props}
				className={`w-full h-full p-2 pl-8 rounded outline-none bg-neutral-800 focus:bg-neutral-700 focus:ring focus:ring-neutral-600 ${props.className}`}
			/>
			{props.icon && props.icon}
		</span>
	);
}
