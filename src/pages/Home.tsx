import { FormEvent, useCallback, useEffect, useState } from "react";
import { ConfigureToken } from "../components/ConfigureToken";
import { ProjectRow } from "../components/ProjectRow";
import { useInputState } from "../hooks/useInputState";

import { useInvoke } from "../hooks/useInvoke";

function App() {
	const [projectName, setProjectName, clearProjectName] = useInputState("");
	const [hasToken, setHasToken] = useState(false);
	const invoke = useInvoke();

	const [projects, setProjects] = useState([
		"nickradford-dev",
		"relay-sms",
		"williamroach",
		"api-nickradford-dev",
	]);

	console.log({ projectName });

	useEffect(() => {
		invoke<string[]>("get_projects").then((projects) => {
			setProjects(projects);
		});
	}, []);

	useEffect(() => {
		invoke<string>("get_token").then((token) => {
			setHasToken(!!token);
		});
	}, []);

	const addProject = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (projectName.length === 0 || projects.includes(projectName)) {
				return;
			}
			setProjects([...projects, projectName.trim()]);
			clearProjectName();
		},
		[projects, projectName]
	);

	return (
		<div className="flex flex-col w-full">
			{hasToken ? (
				<>
					<form className="flex max-w-md gap-2 pt-4 pb-8" onSubmit={addProject}>
						<div className="relative flex-1">
							<span className="absolute top-1 left-2.5 text-neutral-500 text-2xl pointer-events-none">
								&#9206;
							</span>
							<input
								className="w-full p-2 pl-8 rounded outline-none bg-neutral-800 focus:bg-neutral-700 focus:ring focus:ring-neutral-600"
								placeholder="Project name "
								onChange={setProjectName}
								value={projectName}
							/>
						</div>
						<button className="p-2 px-4 rounded bg-neutral-800" type="submit">
							Add
						</button>
					</form>
					<div className="space-y-2">
						{projects.map((name) => (
							<ProjectRow projectName={name} interval={90} key={name} />
						))}
					</div>
				</>
			) : (
				<ConfigureToken />
			)}
		</div>
	);
}

export default App;
