"use client";

import { useState } from "react";
import * as Y from "yjs";
import { api } from "@/lib/api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Prop {
  status: "ready";
  documentId: string;
  role: "READ" | "WRITE";
  isOwner: boolean;
  docName: string;
}

interface SaveVersionDialogProps {
  joinState: Prop;
  ydoc: Y.Doc;
  fetchVersion : () => void;
}

export default function SaveVersionDialog({ joinState, ydoc, fetchVersion }: SaveVersionDialogProps) {

  const [open, setOpen] = useState(false);
  const [versionName, setVersionName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    try {

      setLoading(true);

      const update = Y.encodeStateAsUpdate(ydoc);

      const base64 = Buffer.from(update).toString("base64");

      await api.post("/api/documentVersion", {
        update: base64,
        docId: joinState.documentId,
        name: versionName || null,
      });

      toast.success("Version saved");

      setVersionName("");
      setOpen(false);
      fetchVersion();
      
    } catch (err: any) {

      toast.error(err?.response?.data?.message ?? "Failed to save version");

    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">Save Version</Button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Save Document Version</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-3">

          <Input
            placeholder="Version name (optional)"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
          />

        </div>

        <DialogFooter className="mt-4">

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            disabled={loading}
            onClick={handleSave}
            className="cursor-pointer"
          >
            {loading ? "Saving..." : "Save"}
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
}