"use client";

import { useEffect } from "react";
import * as Y from "yjs";
import { socket } from "@/lib/socket";
import { Awareness } from "y-protocols/awareness";
import {encodeAwarenessUpdate,applyAwarenessUpdate} from "y-protocols/awareness";
import { toast } from "sonner";

export function useYjsSocketSync(documentId:string ,ydoc:Y.Doc, awareness:Awareness) {

    useEffect(()=>{

        if(!documentId) return ;

        //update goes to server .
        const updateHandler=(update:Uint8Array,origin:any) =>{
            if(origin === "remote") return ;
            console.log("updateHandler yjs ",ydoc.clientID)
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
        console.log(`Sending awareness`)
        const changedClients = added.concat(updated).concat(removed);

        const update = encodeAwarenessUpdate(awareness, changedClients);

        socket.emit("document:awareness", update);
    };

        awareness.on('update', awarenessUpdateHandler);

        const socketAwarenessHandler = (update: Uint8Array) => {
            console.log(`Getting the awareness ${update}`)
            applyAwarenessUpdate(awareness, new Uint8Array(update), "remote");
        };

        socket.on("document:awareness", socketAwarenessHandler);

        const userJoinedHandler = ({ name }: { name: any }) => {
            toast(`${name} joined the document`);
        };

    socket.on("document:userJoined", userJoinedHandler);
        
        // one time to get other connected user awareness
        socket.emit("document:newUser");

        const newUserHandler=(socketId:string)=>{
           console.log("new user joined , sending awarenss ",socketId);

           const update = encodeAwarenessUpdate(
            awareness,
            Array.from(awareness.getStates().keys()) 
           );

            socket.emit("document:FullAwareness",{update,socketId});
        }

        socket.on("document:newUser",newUserHandler)

        const individualAwarenessHandler=(update: Uint8Array)=>{
           console.log("getting others awareness");
            applyAwarenessUpdate(awareness, new Uint8Array(update), "remote");
        }

        socket.on("document:receiveFullAwareness", individualAwarenessHandler)
            
        console.log(`Reattaching listeners `);

        return () => {
          ydoc.off("update", updateHandler);
          awareness.off("update", awarenessUpdateHandler);
          socket.off("yjs:update", socketUpdateHandler);
          socket.off("document:awareness", socketAwarenessHandler);
          socket.off("document:newUser",newUserHandler);
          socket.off("document:FullAwareness", individualAwarenessHandler);
          socket.off("document:userJoined", userJoinedHandler);
        };

    },[documentId]);

}