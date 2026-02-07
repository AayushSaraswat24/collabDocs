"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type InviteItemProps = {
  inviteId: string;
  inviterName?: string | null;
  inviterEmail: string;
  inviterImage?: string | null;
  documentName: string;
  role: "READ" | "WRITE";
  onAccept: (inviteId: string) => void;
  onReject: (inviteId: string) => void;
  loading?: boolean;
};

export function InviteItem({
  inviteId,
  inviterName,
  inviterEmail,
  inviterImage,
  documentName,
  role,
  onAccept,
  onReject,
  loading = false,
}: InviteItemProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border p-3">
      <div className="flex gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={inviterImage ?? undefined} />
          <AvatarFallback>
            {inviterName?.[0] ?? inviterEmail[0]}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <p className="text-sm font-medium">
            {inviterName ?? inviterEmail}
          </p>
          <p className="text-xs text-muted-foreground">
            invited you to{" "}
            <span className="font-medium text-foreground">
              {documentName}
            </span>{" "}
            ({role})
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => onReject(inviteId)}
        >
          Reject
        </Button>
        <Button
          size="sm"
          disabled={loading}
          onClick={() => onAccept(inviteId)}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
