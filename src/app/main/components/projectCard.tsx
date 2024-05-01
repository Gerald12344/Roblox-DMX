import { Button } from "@mantine/core";
import { useState } from "react";
import DeleteModal from "./deleteModal";
import Link from "next/link";

export default function ProjectCard({
  card,
  refresh,
}: {
  card: { id: string; title: string; description: string };
  refresh: () => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteFunc = () => {
    const projects = localStorage.getItem("projects");
    let newProjects = [];
    if (projects) {
      newProjects = JSON.parse(projects).projects;
    }
    newProjects = newProjects.filter((project: any) => project.id !== card.id);
    localStorage.setItem("projects", JSON.stringify({ projects: newProjects }));
    refresh();
  };

  return (
    <div className="border-2 rounded-lg border-neutral-700 p-2 m-2 flex items-center justify-center flex-col min-w-[200px]">
      <h1 className="text-2xl">
        <strong>{card.title}</strong>
      </h1>
      <p className="flex-grow min-h-[150px]">{card.description}</p>
      <div className="flex flex-row items-center justify-around w-full">
        <Link href={`/main/${card.id}`}>
          <Button>Open</Button>
        </Link>

        <Button color="red" onClick={() => setDeleteOpen(true)}>
          Delete
        </Button>
      </div>
      <DeleteModal
        close={() => setDeleteOpen(false)}
        open={deleteOpen}
        deleteFunc={deleteFunc}
      />
    </div>
  );
}
