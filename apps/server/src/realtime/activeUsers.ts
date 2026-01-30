
const activeUsersByDoc=new Map<string,Set<string>>();

export function addUser(documentId:string,userId:string){
    if(!activeUsersByDoc.has(documentId)){
        activeUsersByDoc.set(documentId,new Set());
    }

    activeUsersByDoc.get(documentId)!.add(userId);
}

export function removeUser(documentId:string,userId:string){
    const users=activeUsersByDoc.get(documentId);

    if(!users) return ;

    users.delete(userId);

    if(users.size===0) activeUsersByDoc.delete(documentId);
}

export function getActiveUsers(documentId:string):Set<string>{
    return activeUsersByDoc.get(documentId) ?? new Set();
}