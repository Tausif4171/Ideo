import { connectToDB } from "@/app/lib/mongodb";
import { Feature } from "@/app/lib/models/Feature";  

export  async function POST(req: Request) {
  await connectToDB();

  const data = await req.json();
  const newFeature = await Feature.create(data);
  return Response.json(newFeature);
}

export async function GET(){
    await connectToDB();
    const features = await Feature.find();
    return Response.json(features);
}