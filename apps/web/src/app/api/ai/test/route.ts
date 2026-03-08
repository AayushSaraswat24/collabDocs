import { gemini } from "@/lib/ai/geminit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try{

        const {documentText}=await request.json();
        if(!documentText){
            return NextResponse.json({
                success:false,
                message:"Document text is required"
            }, { status: 400 });
        }
        const prompt=` Summarize the following text:
        """
        ${documentText}
        """
        `
        
        const response = await gemini.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents:prompt,
            config:{
                temperature:0.2,
                topP:0.8,
                topK:20,
                maxOutputTokens:400,
                candidateCount:1,
                systemInstruction:`
                You are a text summarization assistant.
                Rules:
                - Return ONLY the summary.
                - Do NOT include explanations, introductions, or labels.
                - Do NOT write phrases like "Summary:" or "Here is the summary".
                - Keep the summary concise while preserving key ideas.
                `,
                
            }
        });
        
        for await (const chunk of response) {
            console.log(chunk.text);
        }
        return new Response("ok");
    }catch(error){
        console.log(error);
        return new Response("Error", { status: 500 });
    }
}