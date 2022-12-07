import { useInputState } from "../hooks/useInputState";
import { Button } from "./Button";
import { Input } from "./Input";

export function ConfigureToken() {
	const [value, onChange] = useInputState("");

	return (
		<form className="flex flex-col gap-4">
			<p>Configure your Vercel Access Token</p>
			<div className="flex flex-row gap-2">
				<Input placeholder="Token" value={value} onChange={onChange} />
				<Button>Set</Button>
			</div>
		</form>
	);
}
