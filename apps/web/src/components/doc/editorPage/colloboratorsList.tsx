"use client"

import { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { socket } from "@/lib/socket"
import { Users, MoreVertical, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { InviteUserDialog } from "./inviteUserDialog"
import { Button } from "@/components/ui/button"

type User = {
  id: string
  name: string
  email: string
  isActive: boolean
}

type Props = {
  owner: boolean
  documentId: string
}

export function ColloboratorsList({ owner,documentId }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!open) return

    getActiveUsers()
  }, [open, socket])

  const getActiveUsers = () => {
    setLoading(true)

    socket.emit("document:get:activeUsers", {}, (res: any) => {
      if (res?.ok) {
        setUsers(res.users)
      }
      setLoading(false)
    })

  }

  const handleKick = (targetUserId: string) => {
    socket.emit("document:kick", { targetUserId },(res:any)=>{
      if(!res?.ok){
        toast.error("Failed to kick user: " + (res?.error ?? "Unknown error"))
      }else{
        toast.success("User kicked successfully")
        setUsers(prev => prev.filter(u => u.id !== targetUserId));
      }
    })

  }

  const handleLeave=()=>{
    socket.emit("document:leave",{},(res:any)=>{
      if(!res?.ok){
        toast.error("Failed to leave document: " + (res?.error ?? "Unknown error"))
      }else{
        toast.success("You have left the document")
      }
    })
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
          <Users className="h-4 w-4" />
          Collaborators
        </button>
      </SheetTrigger>

      <SheetContent className="flex flex-col p-0 sm:max-w-md ">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Collaborators</SheetTitle>
        </SheetHeader>

      <div className="px-4 flex items-center justify-end">
          <button
            onClick={getActiveUsers}
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
              Loading users...
            </p>
          )}

 
          {!loading && users.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No collaborators have joined this document yet.
            </p>
          )}

          
          {!loading && users.map((user) => {
            return (
              <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
              >
              <div className="flex items-center gap-3">
             
                {/* Avatar */}
                <div className="relative">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {user.name[0]}
                  </div>

                  {/* Online indicator */}
                  {user.isActive && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {/* Owner-only Kick Option */}
              {owner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-muted">
                      <MoreVertical size={16} />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleKick(user.id)}
                      className="text-red-500"
                      >
                      Kick User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
        
          )})} 
          
        </div>

        <div className="flex flex-col mb-4 items-center justify-center" >

        {
          owner ? (
            <InviteUserDialog documentId={documentId}/>
          ) :(
            <Button variant="destructive" className="cursor-pointer"
            onClick={handleLeave}>Leave Document</Button>
          )
        }
        </div>

      </SheetContent>
    </Sheet>
  )
}