import {Schema, model, models} from "mongoose";

const featureSchema = new Schema({
    text:{type:String,required:true},
    favorite:{type:Boolean,default:false},
    done:{type:Boolean,default:false},
})

export const Feature = models.Feature || model("Feature", featureSchema); 