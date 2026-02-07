"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { InviteItem } from "./inviteItem";
import { api } from "@/lib/api";
import { Inbox } from "lucide-react";

type Invite = {
  id: string;
  role: "READ" | "WRITE";
  document: {
    name: string;
  };
  inviter: {
    name: string | null;
    email: string;
    image: string | null;
  };
};

export function InvitesInbox() {
  const [open, setOpen] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/api/fetchInvite");
      setInvites(res.data.data ?? []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Failed to fetch invites"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchInvites();
    }
  }, [open]);

  const handleInviteAction = async (
    inviteId: string,
    isAccepted: boolean
  ) => {
    try {
      setActionLoadingId(inviteId);

      await api.post("/api/acceptInvite", {
        inviteId,
        isAccepted,
      });

      // Optimistically remove invite from UI
      setInvites((prev) =>
        prev.filter((invite) => invite.id !== inviteId)
      );
    } catch (err) {
      console.error("Invite action failed", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Inbox className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Invites</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          {loading && (
            <p className="text-sm text-muted-foreground">
              Loading invites…
            </p>
          )}

          {!loading && error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && invites.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No pending invites
            </p>
          )}

          {!loading &&
            !error &&
            invites.map((invite) => (
              <InviteItem
                key={invite.id}
                inviteId={invite.id}
                inviterName={invite.inviter.name}
                inviterEmail={invite.inviter.email}
                inviterImage={invite.inviter.image}
                documentName={invite.document.name}
                role={invite.role}
                loading={actionLoadingId === invite.id}
                onAccept={(id) =>
                  handleInviteAction(id, true)
                }
                onReject={(id) =>
                  handleInviteAction(id, false)
                }
              />
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
