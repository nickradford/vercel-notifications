import { ChangeEvent, useState } from "react";

/**
 * @description A wrapper around useState to simplify <input /> state management
 */
export function useInputState(
	initialState: string
): [string, (e: ChangeEvent<HTMLInputElement>) => void, () => void] {
	const [state, setState] = useState(initialState);

	// Because calling onChange={e => e.target.value} is annyoing to do inside of components
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setState(e.target.value);
	};

	const unset = () => {
		setState("");
	};

	return [state, onChange, unset];
}
