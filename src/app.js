const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConfig");
const errorHandler = require("./middlewares/errorHandler");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/user", require("./routes/userRouter"));
app.use("/order", require("./routes/orderRouter"));

// Error Handler
app.use(errorHandler);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
  });

module.exports = app;

//// ADD Voice to DB
// app.post("/voice", async (req, res) => {
//   try {
//     const response = await fetch("https://api.heygen.com/v2/voices", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         x_api_key: process.env.HEYGEN_API_KEY,
//       },
//     });
//     const data = await response.json();

//     const voiceIds = [
//       "d9c3540e29e446bb989014c1093f4804",
//       "db39b0cb43e2470db5344c1a34f7a669",
//       "c7ce3036f467445485d80b153c5a88a8",
//       "ec89770b32f842f883851188b6e4923f",
//       "6189d551d44b4a2d92f31e3822e310c0",
//       "e1ccd6ecac8e4c15819ad143efdd4ce2",
//     ];

//     console.log("data: ", data);

//     for (const voiceId of voiceIds) {
//       const voice = data.data.voices.find(
//         (voice) => voice.voice_id === voiceId
//       );
//       await Voice.create(voice);
//     }

//     res.status(200).json({
//       message: "Voices created successfully",
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//     console.log("Error: ", err);
//   }
// });

//// ADD Avatar to DB
// app.post("/avatar", async (req, res) => {
//     try {
//       const response = await fetch("https://api.heygen.com/v2/avatars", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           x_api_key: process.env.HEYGEN_API_KEY,
//         },
//       });
//       const data = await response.json();

//       const avatarIds = [
//         "Luca_public",
//         "Sophie_public",
//         "Riley_expressive_2024112501",
//         "Oxana_expressive_2024112701",
//         "Rebecca_public",
//         "Raul_expressive_2024112501",
//       ];

//       console.log("data: ", data);

//       for (const avatarId of avatarIds) {
//         const avatar = data.data.avatars.find(
//           (avatar) => avatar.avatar_id === avatarId
//         );
//         await Avatar.create(avatar);
//       }

//       res.status(200).json({
//         message: "Avatar created successfully",
//       });
//     } catch (err) {
//       res.status(500).json({
//         message: err.message,
//       });
//       console.log("Error: ", err);
//     }
//   });
