const fs = require("node:fs");
const imagekit = require("../config/imageKit");

async function uploadOnImageKit(file) {
  try {
    return await new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: fs.readFileSync(file.path),
          fileName: file.originalname,
        },
        function (error, result) {
          if (error) {
            console.log("Error: ", error);
            reject(error);
          }

          fs.unlink(file.path, (unlinkErr) => {
            if (unlinkErr)
              console.error("Error deleting temp file:", unlinkErr);
          });
          resolve(result);
        }
      );
    });
  } catch (err) {
    throw err;
  }
}

module.exports = uploadOnImageKit;
