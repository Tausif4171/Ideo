import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/mongodb";
import { Feature } from "@/app/lib/models/Feature";  

// PATCH to update (edit text or toggle favorite/done)
export async  function PATCH(req:Request,{params}:{params:{id:string}}){
    await connectToDB();
    const updates = await req.json();
    const updatedFeature = await Feature.findByIdAndUpdate(params.id,updates,{new:true});
    return NextResponse.json(updatedFeature);
}