import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/mongodb";
import { Idea } from "@/app/lib/models/Idea";

// Updated PATCH handler
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectToDB();
  
  try {
    const updates = await req.json();
    const updatedIdea = await Idea.findByIdAndUpdate(id, updates, { new: true });
    
    if (!updatedIdea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    return NextResponse.json(updatedIdea);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE an idea by ID
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectToDB();
  await Idea.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Idea deleted" });
}
