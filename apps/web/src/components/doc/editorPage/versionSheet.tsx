"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SaveVersionDialog from "./versionSaveDialogue";
import * as Y from "yjs";
import { History, RefreshCw } from "lucide-react";

interface Prop {
  status: "ready";
  documentId: string;
  role: "READ" | "WRITE";
  isOwner: boolean;
  docName: string;
}

interface OptionBarProps {
  joinState: Prop;
   ydoc: Y.Doc;
}

interface Version {
  id: string;
  name: string | null;
  createdAt: string;
}

export default function DocumentVersionSheet({ joinState,ydoc }: OptionBarProps) {

  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function fetchVersions() {
    try {
      setLoading(true);
 
      const res = await api.post("/api/fetchDocumentVersion", {
        documentId: joinState.documentId
      });

      setVersions(res.data.documentVersion);

    } catch (err:any) {

      toast.error(err?.response?.data?.message ?? "Failed to fetch versions");
      setVersions([]);
      console.error(err);

    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    if (!open) return;
    if (!joinState.documentId) return;

    fetchVersions();
  }, [open]);

  function formatVersion(v: Version) {
    if (v.name) return v.name;
    return new Date(v.createdAt).toLocaleString();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>

      <SheetTrigger asChild>
        <button className="gap-2 text-xs font-medium tracking-wide px-3 py-1.5 flex items-center 
          text-neutral-400 dark:text-neutral-600
          border border-dashed border-neutral-200 dark:border-neutral-700
          rounded-lg cursor-pointer
          hover:border-neutral-300 hover:text-neutral-600
          dark:hover:border-neutral-600 dark:hover:text-neutral-400
          transition-all duration-150
          font-['DM_Sans',sans-serif]">
          <History size={12} />
          History
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-105 [&>button]:cursor-pointer flex flex-col"  >

        <SheetHeader className="p-4 border-b">
          <SheetTitle>Document Versions</SheetTitle>
        </SheetHeader>

        <div className="px-4 flex items-center justify-end">
          <button
            onClick={fetchVersions}
            disabled={loading}
            className="flex items-center gap-1 cursor-pointer text-xs text-muted-foreground 
                      hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
       </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {loading && (
            <p className="text-sm text-muted-foreground">
              Loading versions...
            </p>
          )}

          {!loading && versions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No versions exist
            </p>
          )}

          {versions.map(v => (
            <div
              key={v.id}
              className="border rounded-md p-3 text-sm"
            >
              {formatVersion(v)}
            </div>
          ))}

        </div>

        <div className="flex flex-col mb-4 items-center justify-center" >

            {joinState.role === "WRITE" && (
                <SaveVersionDialog joinState={joinState} ydoc={ydoc} fetchVersion={fetchVersions} />
            )}

        </div>

      </SheetContent>
    </Sheet>
  );
}