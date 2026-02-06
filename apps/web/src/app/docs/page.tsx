"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {api} from "@/lib/api";
import {DocumentCard,DocumentItem} from "@/components/doc/documentCard";
import { CreateDocumentDialog } from "@/components/doc/createDocument";


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
    setDocuments((prevDocs)=>[...prevDocs,doc]);
  }

  const deleteDocument=async (docId:string) =>  {
    try{
     const response=await api.delete("api/deleteDocument",{
        data:{docId}
     })
     
     setDocuments((prevDoc)=> prevDoc.filter((doc)=> doc.id!==docId));
     // show pop_up on success ,needs to update the ui too that element is gone .
    }catch(error){
      console.log(`Error `,error);
      // instead of error i want a pop_up here .
      setError(true);
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

      <div className="mb-4 flex items-center justify-between ">
        <h1 className="sm:text-lg  font-semibold">
          Your Documents
        </h1>

        <CreateDocumentDialog onCreated={onCreated} />
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

// document card alert dialog box implemented only responsive test is due for that i need to make ui to add document first and after adding 2-3 doc i need to test the responsiveness apart from that i need to implement a kind of aleart that doc is deleted or some other actions too . after that i need to implement invites . we will add shadcn sonner .