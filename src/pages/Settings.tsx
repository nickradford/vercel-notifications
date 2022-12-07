import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Page } from "../components/Page";
import { TriangleUpIcon } from "../components/TriangleUpIcon";
import { useInputState } from "../hooks/useInputState";
import { useInvoke } from "../hooks/useInvoke";

export default function SettingsPage() {
	const [storedToken, setStoredToken] = useState("");
	const [value, onChange] = useInputState(storedToken);
	const invoke = useInvoke();

	useEffect(() => {
		invoke<string>("get_token").then((token) => {
			setStoredToken(token);
		});
	}, []);

	const setToken = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			console.log("setToken: ", value);

			e.preventDefault();
			invoke<boolean>("set_token", { token: value }).then((success) => {
				console.log("success: ", success);
			});
		},
		[invoke, value]
	);

	return (
		<Page>
			<Link to="/">Back</Link>
			<h1 className="mb-8">Settings</h1>
			<form onSubmit={setToken}>
				<label>
					<span className="mb-2">Vercel Auth Token</span>
					<div className="flex gap-2 py-1">
						<Input
							icon={<TriangleUpIcon className="top-1.5" />}
							value={value || storedToken}
							onChange={onChange}
							className="font-mono text-sm tracking-wide"
						/>
						<Button>Set</Button>
					</div>
				</label>
			</form>
		</Page>
	);
}
