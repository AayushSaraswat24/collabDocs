"use client";

import { useEffect } from "react";
import * as Y from "yjs";
import { socket } from "@/lib/socket";
import { Awareness } from "y-protocols/awareness";
import {encodeAwarenessUpdate,applyAwarenessUpdate,removeAwarenessStates} from "y-protocols/awareness";
import { toast } from "sonner";

export function useYjsSocketSync(documentId:string ,ydoc:Y.Doc, setYdoc:React.Dispatch<React.SetStateAction<Y.Doc>>,awareness:Awareness) {

    useEffect(()=>{

        if(!documentId) return ;

        //update goes to server .
        const updateHandler=(update:Uint8Array,origin:any) =>{
            if(origin === "remote") return ;
            socket.emit("yjs:update",update)
        }
       
        // it passes the update as uint8Array already . remote is used to prevent infinte  server and client update loop .
        ydoc.on("update",updateHandler);

        const socketUpdateHandler=(update:Uint8Array)=>{
            const uint8Update = new Uint8Array(update); 
            if (uint8Update.length === 0) return;
            Y.applyUpdate(ydoc, uint8Update, "remote");
        }

        // if update comes from server.
        socket.on("yjs:update",socketUpdateHandler);

        // awareness listeners 

       const awarenessUpdateHandler = ({added,updated,removed}: any,origin:any) => {
        
        if(origin === "remote" ) return ;
        const changedClients = added.concat(updated).concat(removed);

        const update = encodeAwarenessUpdate(awareness, changedClients);

        socket.emit("document:awareness", update);
    };

        awareness.on('update', awarenessUpdateHandler);

        const socketAwarenessHandler = (update: Uint8Array) => {
            applyAwarenessUpdate(awareness, new Uint8Array(update), "remote");
        };

        socket.on("document:awareness", socketAwarenessHandler);

        const userJoinedHandler = ({ name }: { name: any }) => {
            toast(`${name} joined the document`);
        };

       socket.on("document:userJoined", userJoinedHandler);

       const removeAwarenessHandler = ({clientID}:{clientID:number}) => {
        removeAwarenessStates(awareness, [clientID], "remote");
      }

       socket.on("document:awareness:remove", removeAwarenessHandler);
        
        const userKickedHandler = ({ userName }: { userName: any }) => {
            toast(`${userName} was kicked from the document`);
        }

        const userLeftHandler = ({ userName }: { userName: any }) => {
            toast(`${userName} left the document`);
        }

        socket.on("document:userKicked", userKickedHandler);
        socket.on("document:userLeft", userLeftHandler);

        // hard reset listner here to create a new ydoc as the buffer is updated and it will fetch the new doc from there . also add toast .
        const revertHandler=({userName}: { userName: String })=>{
            const newDoc=new Y.Doc();
            setYdoc(newDoc);
            toast(`${userName} reverted the document to the selected version`);
        }

        socket.on("documentReverted", revertHandler);

        return () => {
          ydoc.off("update", updateHandler);
          awareness.off("update", awarenessUpdateHandler);
          socket.off("yjs:update", socketUpdateHandler);
          socket.off("document:awareness", socketAwarenessHandler);
          socket.off("document:userJoined", userJoinedHandler);
          socket.off("document:awareness:remove", removeAwarenessHandler);
          socket.off("document:userKicked", userKickedHandler);
          socket.off("document:userLeft", userLeftHandler);
          socket.off("documentReverted", revertHandler);
        } 

    },[documentId,ydoc,awareness]);

}