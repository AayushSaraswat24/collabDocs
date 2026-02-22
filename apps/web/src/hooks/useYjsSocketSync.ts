"use client";

import { useEffect } from "react";
import * as Y from "yjs";
import { socket } from "@/lib/socket";
import { Awareness } from "y-protocols/awareness";
import {encodeAwarenessUpdate,applyAwarenessUpdate} from "y-protocols/awareness";

export function useYjsSocketSync(documentId:string ,ydoc:Y.Doc, awareness:Awareness,user:{id:string,name:string,color:string}) {

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

        awareness.on("update", awarenessUpdateHandler);

        const socketAwarenessHandler = (update: Uint8Array) => {
    
            applyAwarenessUpdate(awareness, new Uint8Array(update), "remote");
        };

        socket.on("document:awareness", socketAwarenessHandler);

            if(user?.id && user?.name){
                awareness.setLocalStateField("user", {
                    id: user.id,
                    name: user.name,
                    color: user.color,
                });
            }

        return () => {
          ydoc.off("update", updateHandler);
          awareness.off("update", awarenessUpdateHandler);
          socket.off("yjs:update", socketUpdateHandler);
          socket.off("document:awareness", socketAwarenessHandler);
        
        };

    },[documentId,ydoc,awareness]);

}