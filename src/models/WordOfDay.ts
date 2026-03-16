import mongoose from "mongoose";

const WordOfDaySchema = new mongoose.Schema({
  word: { type: String, required: true },
  meaning: { type: String, required: true },
  date: { type: String, required: true, unique: true },
});

export default mongoose.models.WordOfDay ||
  mongoose.model("WordOfDay", WordOfDaySchema);