"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import NewProjectModal from "./components/newProjectModal";
import ProjectCard from "./components/projectCard";

export default function Choose() {
  const [scenarios, setScenarios] = useState<
    {
      id: string;
      title: string;
      description: string;
    }[]
  >([]);

  const [open, setOpen] = useState(false);

  let loadScenarios = () => {
    const scenarios = localStorage.getItem("projects");
    if (scenarios) {
      setScenarios(JSON.parse(scenarios).projects);
    }
  };

  useEffect(() => {
    loadScenarios();
  }, []);

  return (
    <div className="flex items-center justify-center w-[100vw] h-[100vh] flex-col">
      <h1 className="text-3xl">Choose a Project:</h1>
      <div>
        {scenarios.map((scenario) => (
          <ProjectCard
            key={scenario.id}
            card={scenario}
            refresh={loadScenarios}
          />
        ))}
      </div>
      <NewProjectModal
        close={() => setOpen(false)}
        open={open}
        refresh={loadScenarios}
      />
      <div>
        <button
          className="bg-green-600 hover:bg-green-700 cursor-pointer p-2 rounded-lg mt-4"
          onClick={() => setOpen(true)}
        >
          New Scenario
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer p-2 rounded-lg mt-4 ml-2"
          onClick={() => {}}
        >
          Load Scenario
        </button>
      </div>
    </div>
  );
}
