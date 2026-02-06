import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export interface DocumentItem {
  id: string;
  name: string;
  isOwner: boolean;
}

interface DocumentCardProps {
  doc: DocumentItem;
  onClick: () => void;
  onDelete: (docId: string) => void;
}

export function DocumentCard({ doc, onClick, onDelete }: DocumentCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-lg border bg-card p-4 shadow-sm transition hover:shadow-md hover:border-primary/50"
    >

      {doc.isOwner && (
        <span className="absolute left-2 top-2 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">
          OWNER
        </span>
      )}


      <h3 className="truncate text-sm font-medium pt-6 pr-8">
        {doc.name}
      </h3>

      {/* Delete Button - Only visible for owners */}
      {doc.isOwner && (

            <AlertDialog>
          <AlertDialogTrigger asChild>

            <button
              onClick={(e) => e.stopPropagation()}
              className="absolute hover:cursor-pointer right-2 top-2 rounded-md p-1.5 text-muted-foreground  group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 size={16} />
            </button>
            
          </AlertDialogTrigger>

          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete document?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The document and all its data will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              {/* CLOSE / CANCEL */}
              <AlertDialogCancel>
                Close
              </AlertDialogCancel>

              {/* DELETE */}
              <AlertDialogAction
                onClick={() => onDelete(doc.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      )}
    </div>
  );
}

