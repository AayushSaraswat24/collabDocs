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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import SaveVersionDialog from "./versionSaveDialogue";
import * as Y from "yjs";
import { History, RefreshCw } from "lucide-react";
import { backendApi } from "@/lib/backendApi";


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
   isWrite: boolean;
}

interface Version {
  id: string;
  name: string | null;
  createdAt: string;
}

export default function DocumentVersionSheet({ joinState,ydoc ,isWrite }: OptionBarProps) {

  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reverting, setreverting] = useState(false);

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

  const onRevert=async (versionId: string)=>{
    try{
      setreverting(true);

      const res= await backendApi.post("/api/revert",{
         docId: joinState.documentId, 
         versionId : versionId
      })

      if(res.data.success){
        toast.success("Document reverted successfully");
        setOpen(false);
      }
    }catch(err:any){
      toast.error(err?.response?.data?.message ?? "Failed to revert version");
    }finally{
      setreverting(false);
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
        <button
  className="
  flex items-center gap-1 sm:gap-2
  px-2 sm:px-3 py-1.5
  text-xs font-medium tracking-wide
  text-neutral-400 dark:text-neutral-600
  border border-dashed border-neutral-200 dark:border-neutral-700
  rounded-lg cursor-pointer
  hover:border-neutral-300 hover:text-neutral-600
  dark:hover:border-neutral-600 dark:hover:text-neutral-400
  transition-all duration-150
  font-['DM_Sans',sans-serif]
">
  <History className="h-4 w-4" />
  <span className="hidden sm:inline">History</span>
</button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col [&>button]:cursor-pointer"  >

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

          {!loading && versions.map(v => (
            <div
              key={v.id}
              className="border flex justify-between rounded-md p-3 text-sm"
            >
              <div className="">
              {formatVersion(v)}
              </div>

                {isWrite && (

                  <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                          <button
                            className=" p-1 rounded hover:bg-muted cursor-pointer"
                            >
                            <MoreVertical size={16} />
                          </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-36">

                          <DropdownMenuItem
                            onClick={() => onRevert(v.id)}
                            className="cursor-pointer"
                            >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Revert
                          </DropdownMenuItem>

                    </DropdownMenuContent>

                  </DropdownMenu>
                      
                )}             
            
              
          </div>

          ))}

        </div>

        <div className="flex flex-col mb-4 items-center justify-center" >

            {isWrite && (
                <SaveVersionDialog joinState={joinState} ydoc={ydoc} fetchVersion={fetchVersions} />
            )}

        </div>

      </SheetContent>
    </Sheet>
  );
}