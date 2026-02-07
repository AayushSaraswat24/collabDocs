"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {api} from "@/lib/api";
import {DocumentCard,DocumentItem} from "@/components/doc/documentCard";
import { CreateDocumentDialog } from "@/components/doc/createDocument";
import { InvitesInbox } from "@/components/doc/invite/inviteInbox";


export default function DocsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  
  useEffect(() => {

    fetchDocs();
  }, []);

  const fetchDocs = async () => {
      try {
        const res = await api.get("api/fetchDocument");
        setDocuments(res.data.documents);
      } catch (error:any) {
        console.log(`error -- `,error.response.data)
        setError(true);
      } finally {
        setLoading(false);
      }

    };


  const onCreated=async (doc:DocumentItem) => {
    // if still ui is not working perfectly for docs operations then just add the fetch function calling here .
    setDocuments(prev => {
      const exists = prev.some(d => d.id === doc.id);

      if (exists) {
        return prev.map(d => (d.id === doc.id ? doc : d));
      }

      return [...prev, doc];
    });

  }

  const deleteDocument=async (docId:string) =>  {
    try{
     const response=await api.delete("api/deleteDocument",{
        data:{docId}
     })

     setDocuments((prevDoc)=> prevDoc.filter((doc)=> doc.id!==docId));
  
    }catch(error){
      console.log(`Error `,error);
      throw error;
    }
  }


  if (loading) {
    return (
     <div className="p-6 text-sm text-neutral-500">
        Loading documents...
      </div>
    );
  }

  if(error){
    return (
      <div className="p-6 text-sm text-neutral-500">
        Failed to load documents. Please try again later.
      </div>
    );
  }

  return (
    <div className="sm:p-6 p-4 flex-1">

      <div className="mb-4 gap-2 flex items-center justify-between ">
        <h1 className="sm:text-lg  font-semibold">
          Your Documents
        </h1>

        <div className="flex sm:gap-4 gap-3">
        <InvitesInbox />
        <CreateDocumentDialog onCreated={onCreated} />
        </div>

      </div>
  
      {documents.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No documents yet.
        </p>
      ) : (
        <div className="grid bg-red-200 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onClick={() => router.push(`/docs/${doc.id}`)}
              onDelete={deleteDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
}

