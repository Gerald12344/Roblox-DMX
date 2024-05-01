import { Button, Modal, TextInput } from "@mantine/core";
import { useState } from "react";
import { v4 } from "uuid";

export default function NewProjectModal({
  refresh,
  open,
  close,
}: {
  refresh: () => void;
  open: boolean;
  close: () => void;
}) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  let createNew = () => {
    const projects = localStorage.getItem("projects");
    let newProjects = [];
    if (projects) {
      newProjects = JSON.parse(projects).projects;
    }
    newProjects.push({
      id: v4(),
      title,
      description,
    });
    localStorage.setItem("projects", JSON.stringify({ projects: newProjects }));
    refresh();
    close();
  };

  return (
    <Modal
      opened={open}
      onClose={close}
      title={<h1 className="text-xl">Create New Project</h1>}
    >
      <TextInput
        label="Project Title"
        required
        placeholder="Enter Project Title..."
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <TextInput
        label="Project Description"
        required
        className="mt-2"
        placeholder="Enter Project Description..."
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
      />

      <div className="mt-4 flex items-center justify-end">
        <Button color="green" className="" onClick={createNew}>
          Create Project
        </Button>
      </div>
    </Modal>
  );
}
