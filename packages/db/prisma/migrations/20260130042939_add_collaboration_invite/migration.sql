-- CreateEnum
CREATE TYPE "CollaborationInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "CollaborationInvite" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "status" "CollaborationInviteStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "CollaborationInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollaborationInvite_inviteeId_idx" ON "CollaborationInvite"("inviteeId");

-- CreateIndex
CREATE UNIQUE INDEX "CollaborationInvite_inviteeId_documentId_key" ON "CollaborationInvite"("inviteeId", "documentId");

-- AddForeignKey
ALTER TABLE "CollaborationInvite" ADD CONSTRAINT "CollaborationInvite_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationInvite" ADD CONSTRAINT "CollaborationInvite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationInvite" ADD CONSTRAINT "CollaborationInvite_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
