import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";

type Role = "READ" | "WRITE";

export function InviteUserDialog({ documentId }: { documentId: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("READ");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();

    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/sentInvite", {
        email: email.trim().toLowerCase(),
        documentId,
        role,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "User invited successfully");
        resetForm();
        setOpen(false);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to invite user");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEmail("");
    setRole("READ");
    setError(null);
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">Invite Users</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Invite a user to collaborate on this document.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Invitee Email</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(value: Role) => setRole(value)}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value="READ">Read</SelectItem>
                  <SelectItem value="WRITE">Write</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Inviting..." : "Invite User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}