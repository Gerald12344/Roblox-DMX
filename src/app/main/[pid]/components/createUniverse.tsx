import { Button, Input, Modal, TextInput } from "@mantine/core";
import { ProjectSettings } from "../page";
import { useState } from "react";

export default function CreateUniverseModal({
  refresh,
  open,
  close,
  universes,
}: {
  refresh: () => void;
  open: boolean;
  close: () => void;
  universes: ProjectSettings | undefined;
}) {
  const [name, setName] = useState<string>("");
  let create = () => {
    let data = localStorage.getItem("projects");
    let projects = [];
    if (data) {
      projects = JSON.parse(data).projects;
    }
    // get our
    let project = projects.find((x: any) => x.id === universes?.id);
    if (!project) return;
    project.universes.push({
      name: name + " - " + (universes?.universes.length ?? 0),
      id: universes?.universes.length ?? 0,
    });
    localStorage.setItem("projects", JSON.stringify({ projects }));
    close();
    refresh();
  };

  return (
    <Modal
      opened={open}
      onClose={close}
      title={<h1 className="text-xl">Create Universe</h1>}
    >
      <TextInput
        label="Universe Id:"
        contentEditable="false"
        disabled
        value={universes?.universes.length ?? 0}
      />
      <TextInput
        label="Name:"
        placeholder="Enter Universe Name..."
        onChange={(e) => setName(e.currentTarget.value)}
        required
      />
      <div className="mt-4 flex items-center justify-end">
        <Button color="green" className="" onClick={create}>
          Create Universe
        </Button>
      </div>
    </Modal>
  );
}
