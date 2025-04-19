import {Schema, model, models} from "mongoose";

const FeatureSchema = new Schema({
    text:{type:String,required:true},
    favorite:{type:Boolean,default:false},
    done:{type:Boolean,default:false},
})

export const Feature = models.Feature || model("Feature", FeatureSchema); 