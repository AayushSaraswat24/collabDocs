"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocumentItem } from "./documentCard";

type CreateDocumentDialogProps = {
  onCreated: (doc:DocumentItem) => void;
};

export function CreateDocumentDialog({
  onCreated,
}: CreateDocumentDialogProps) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);

    if (!name.trim()) {
      setError("Document name is required");
      return;
    }

    try {

      setLoading(true);
        if(name.trim().length===0){
            setError("Document name cannot be empty");
            return;
        }

        const response= await api.post("/api/createDocument", {
            name: name.trim(),
        });

        setOpen(false);
        setName("");
        const doc=response.data.document;
        console.log(`new Doc ${JSON.stringify(doc)}`)
        onCreated({...doc,isOwner:true});

    } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to create document");
    } finally {
      setLoading(false);
    }

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button >Create Document</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new document</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="name">Document name</Label>
          <Input
            id="name"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
