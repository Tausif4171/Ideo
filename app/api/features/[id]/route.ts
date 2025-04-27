import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/mongodb";
import { Feature } from "@/app/lib/models/Feature";

// Updated PATCH handler
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectToDB();
  
  try {
    const updates = await req.json();
    const updatedFeature = await Feature.findByIdAndUpdate(id, updates, { new: true });
    
    if (!updatedFeature) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 });
    }
    return NextResponse.json(updatedFeature);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Updated DELETE handler
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectToDB();

  try {
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    
    const deletedFeature = await Feature.findByIdAndDelete(id);
    
    if (!deletedFeature) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Feature deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
