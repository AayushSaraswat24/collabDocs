import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/redis/rateLimiting";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { gemini } from "@/lib/ai/geminit";

export async function POST(request:NextRequest) {

  try{

    const session=await getServerSession(authOptions);
    
    if(!session || !session.user.id){
      return NextResponse.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }
    
    const {documentText}=await request.json();

    if (!documentText || typeof documentText !== "string") {
      return NextResponse.json({
        success: false,
        message: "Document text is required"
      }, { status: 400 });
    }

    if (documentText.length === 0) {
        return NextResponse.json({ success: false, message: "Document text is required" }, { status: 400 });
    }

    if (documentText.length > 50000) {
        return NextResponse.json({ success: false, message: "Document too large. Maximum 50,000 characters allowed." }, { status: 413 });
    }

    const key=`ai-${session.user.id}`;

    const isAllowed=await rateLimit(key,5,60); 

    if(!isAllowed){
      return NextResponse.json({
        success: false,
        message: "Too many requests. Please try again later."
      }, { status: 429 });
    }

    const prompt=`Summarize the following text:\n\n${documentText}`;

    const geminiStream = await gemini.models.generateContentStream({
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
    
    const encoder= new TextEncoder();

    const stream= new ReadableStream({
      async start(controller){

        try{

          for await (const chunk of geminiStream){
            const text=chunk.text;

            if(text){
              controller.enqueue(encoder.encode(text));
            }
          }

        }catch(error){
          controller.error(error);
        }finally{
          controller.close();
        }

      }
    })

    return new Response(stream,{
      headers:{
        "Content-Type":"text/plain; charset=utf-8",
      }
    });

  }catch(error:any){

    return NextResponse.json({
      success: false,
      message: "internal server error",
    }, { status: 500 });

  }


}

