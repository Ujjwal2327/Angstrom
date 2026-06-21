// components/forms/ProfileForm/shared/DeleteDialog.js

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";

export function DeleteDialog({ category, deleteHandler }) {
  return (
    <Dialog>
      <DialogTrigger
        type="button"
        className="text-muted-foreground hover:text-destructive transition-colors"
        aria-label={`remove ${category.toLowerCase()}`}
      >
        <Trash className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            {category.toLowerCase()} from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-5">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="flex-1 rounded-none"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={deleteHandler}
            variant="destructive"
            className="flex-1 rounded-none"
            aria-label={`remove ${category.toLowerCase()}`}
          >
            Delete {category}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
