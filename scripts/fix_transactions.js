import mongoose from "mongoose";
import Transaction from "../modules/transctions/models/transaction.models.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/wamzeDB";

async function run() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to DB");

  // 1) count null transactionId
  const nullCount = await Transaction.countDocuments({ transactionId: null });
  console.log(`Transactions with transactionId:null -> ${nullCount}`);

  // 2) set transactionId = reference where possible
  const res1 = await Transaction.updateMany(
    { transactionId: null, reference: { $exists: true, $ne: null } },
    [ { $set: { transactionId: "$reference" } } ]
  );
  console.log(`Updated with reference -> matched ${res1.matchedCount}, modified ${res1.modifiedCount}`);

  // 3) for any remaining, set transactionId = _id.toString()
  const remaining = await Transaction.find({ transactionId: null }).select("_id reference").lean();
  let count2 = 0;
  for (const doc of remaining) {
    const tid = doc.reference || doc._id.toString();
    await Transaction.updateOne({ _id: doc._id }, { $set: { transactionId: tid } });
    count2++;
  }
  console.log(`Fixed remaining nulls -> ${count2}`);

  // 4) report duplicates if any
  const dupes = await Transaction.aggregate([
    { $group: { _id: "$transactionId", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);
  if (dupes.length) {
    console.log("Duplicate transactionIds found:", dupes);
  } else {
    console.log("No duplicate transactionIds found");
  }

  console.log("Done. You may recreate indexes if needed.");
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
