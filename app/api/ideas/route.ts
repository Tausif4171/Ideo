import { connectToDB } from "@/app/lib/mongodb";
import { Idea } from "@/app/lib/models/Idea";   

export async function POST(req: Request) {
  await connectToDB();

  const data = await req.json();
  const newIdea = await Idea.create(data);
  return Response.json(newIdea);
}

export async function GET() {
  await connectToDB();

  const ideas = await Idea.find();
  return Response.json(ideas);
}
