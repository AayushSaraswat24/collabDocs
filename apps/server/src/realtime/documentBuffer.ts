import {prisma} from "@collabdoc/db";

type DocumentBuffer={
    content:string;
    debounceTimer:NodeJS.Timeout | null;
    lastSavedAt:number;
}

const documentBuffers=new Map<string,DocumentBuffer>();

const DEBOUNCE_MS=2000;
const FORCE_SAVE_MS=20_000;

export function bufferDocumentUpdate(documentId:string,content:string){

    const now=Date.now(); 
    let buffer=documentBuffers.get(documentId);

    if(!buffer){
        buffer={
            content,
            debounceTimer:null,
            lastSavedAt:now,
        };
        documentBuffers.set(documentId,buffer);
    }


    buffer.content=content;

    if(buffer.debounceTimer){
        clearTimeout(buffer.debounceTimer);
    }

    buffer.debounceTimer=setTimeout(()=>{
        flushDocument(documentId);
    },DEBOUNCE_MS);

    if(now-buffer.lastSavedAt>=FORCE_SAVE_MS){
        flushDocument(documentId);
    }

}

export async function flushDocument(documentId:string){
    const buffer=documentBuffers.get(documentId);
    if(!buffer){
        return;
    }

    try{
        await prisma.document.update({
            where:{id:documentId},
            data:{content:buffer.content},
        });
        buffer.lastSavedAt=Date.now();
    }catch(err){
        console.error(`Failed to flush document ${documentId}:`,err);
    }

}

export async function flushAndClearDocument(documentId:string){
    const buffer=documentBuffers.get(documentId);

    if(!buffer) return ;

    try{
        await prisma.document.update({
            where:{id:documentId},
            data:{content:buffer.content},
        });
    }catch(err){
        console.error(`Failed to flush and clear document ${documentId}:`,err);
    }finally{
        documentBuffers.delete(documentId);
    }

}