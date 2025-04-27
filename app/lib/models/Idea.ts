import  { Schema, model, models } from "mongoose";

const IdeaSchema = new Schema({
  text: { type: String, required: true },
  favorite: { type: Boolean, default: false },
  done: { type: Boolean, default: false },
});

export const Idea = models.Idea || model("Idea", IdeaSchema);
