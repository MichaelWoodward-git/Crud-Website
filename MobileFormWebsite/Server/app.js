const path = require("path");
const express = require('express');
const multer  = require('multer');
const {check, checkSchema, validationResult} = require("express-validator");

const app = express();
const port = 80;

let submittedData = [];
submittedData.push(["1", "liked it (lie)", "Crow", "425", "Gambit", "uploads/titan.jpg"])
let uniqueFileName = "";

const storage = multer.diskStorage({
  destination: function(request, file, callback) {
    callback(null, "uploads/")
  },
  filename: function (request, file, callback) {
    uniqueFileName =  path.parse(file.originalname).name + "-" + Date.now() + path.parse(file.originalname).ext;
    callback(null, uniqueFileName)
  }
});

const upload = multer({ 
  storage: storage,
 
  fileFilter: (request, file, callback) => {
    const allowedFileMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
    callback(null, allowedFileMimeTypes.includes(file.mimetype));
  }
});

app.post(
  '/', 
  upload.fields([{name: "myfile", maxCount: 1}]),
  check("range", "How many people do you know who actually want to play D2? (Range 1-3 digits)").isLength({min: 0, max: 100}),
  check("heroic", "oppinion on the heroic mission?")
    .isIn(["No", "Lie", "Ignorant"]),
  check("fname", "Which character do you dislike the most?").isLength({min: 3}),
  check("quantity", "How much money have you spent on the game?").isLength({min: 1, max: 4}),
  check("grind", "Which grind are you on?")
    .isIn(["Vangard", "Crucible", "Dares", "Gambit", "Raid"]),
  checkSchema({
    "myfile": {
      custom: {
        options: (value, {req, path}) => !!req.files[path],
        errorMessage: "Please upload an image of your current build",
      },
    },
  }),
  (request, response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()) {
      return response 
        .status(400)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          message: "Request fields or files are invald.",
          errors: errors.array(),
        });
    } else {
      let informationArray = [];
      for(let key of Object.values(request.body)) {
        informationArray.push(key);
      }

      informationArray.push("uploads/" + uniqueFileName);

      submittedData.push(informationArray);
      console.log("Successful Form Submission. yay!");
      console.log(submittedData)

      return response
        .status(200)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          message: "Request fields and files are valid.",
          sentData: submittedData
        })
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})