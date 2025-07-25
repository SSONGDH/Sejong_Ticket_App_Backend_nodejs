import dotenv from "dotenv";
import path from "path";

console.log("Current working directory:", process.cwd());
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI;
console.log("mongoURI in db.js:", mongoURI);

const db = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default db;
