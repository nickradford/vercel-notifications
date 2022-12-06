import { useState } from "react";
import { ProjectRow } from "../components/ProjectRow";

function App() {
  const [projectName, setProjectName] = useState("");

  const [projects, setProjects] = useState([
    "nickradford-dev",
    "relay-sms",
    "williamroach",
    "api-nickradford-dev",
  ]);

  return (
    <div className="flex flex-col w-full">
      <form
        className="flex max-w-md gap-2 pb-8"
        onSubmit={(e) => {
          e.preventDefault();
          setProjects((projects) => [...projects, projectName]);
          setProjectName("");
        }}
      >
        <div className="relative flex-1">
          <span className="absolute top-1 left-2.5 text-neutral-500 text-2xl pointer-events-none">
            &#9206;
          </span>
          <input
            className="w-full p-2 pl-8 rounded outline-none bg-neutral-800 focus:bg-neutral-700 focus:ring focus:ring-neutral-600"
            placeholder="Project name "
            onChange={(e) => setProjectName(e.target.value)}
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
    </div>
  );
}

export default App;
