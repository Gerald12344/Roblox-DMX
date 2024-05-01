import { Button, Modal } from "@mantine/core";

export default function DeleteModal({
  deleteFunc,
  open,
  close,
}: {
  deleteFunc: () => void;
  open: boolean;
  close: () => void;
}) {
  return (
    <Modal
      opened={open}
      onClose={close}
      title={<h1 className="text-xl">Delete Project</h1>}
    >
      <p>Are you sure? This action is not recoverable!</p>
      <div className="mt-4 flex items-center justify-end">
        <Button color="red" className="" onClick={deleteFunc}>
          Delete Project
        </Button>
      </div>
    </Modal>
  );
}
