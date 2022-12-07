import classNames from "classnames";
import { State, StateEnum } from "../types/deployments";

function titleCaseState(state: State) {
	return state[0].toUpperCase() + state.substring(1).toLowerCase();
}

export function StatusIndicator({ state }: { state: State }) {
	const lightClasses = classNames("h-2 w-2 rounded-full", {
		"bg-yellow-500": state === StateEnum.BUILDING,
		"bg-green-500": state === StateEnum.READY,
		"bg-red-500": state === StateEnum.ERROR || state === StateEnum.CANCELED,
		"bg-neutral-500":
			state === StateEnum.QUEUED || state === StateEnum.INITIALIZING,
	});
	return (
		<div className="flex gap-2 items-center text-neutral-500 w-20">
			<span className={lightClasses}></span>
			<span>{titleCaseState(state)}</span>
		</div>
	);
}
