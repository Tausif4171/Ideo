import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/mongodb";
import { Idea } from "@/app/lib/models/Idea";  

// PATCH to update (edit text or toggle favorite/done)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectToDB();
  const updates = await req.json();
  const updatedIdea = await Idea.findByIdAndUpdate(params.id, updates, { new: true });
  return NextResponse.json(updatedIdea);
}
