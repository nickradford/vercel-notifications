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
        className="flex gap-2 max-w-md pb-8"
        onSubmit={(e) => {
          e.preventDefault();
          setProjects((projects) => [...projects, projectName]);
          setProjectName("");
        }}
      >
        <div className="flex-1 relative">
          <span className="absolute top-1 left-2.5 text-neutral-500 text-2xl pointer-events-none">
            &#9206;
          </span>
          <input
            className="bg-neutral-800 pl-8 p-2 rounded focus:bg-neutral-700 w-full focus:ring focus:ring-neutral-600 outline-none"
            placeholder="Project name "
            onChange={(e) => setProjectName(e.target.value)}
            value={projectName}
          />
        </div>
        <button className="bg-neutral-800 p-2 px-4 rounded" type="submit">
          Add
        </button>
      </form>
      {projects.map((name) => (
        <ProjectRow projectName={name} interval={90} key={name} />
      ))}
    </div>
  );
}

export default App;
