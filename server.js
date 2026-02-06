import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// DB
connectDB();

// Server
app.listen(PORT, () => {
  console.log(`Wamze backend running on port ${PORT}`);
});
