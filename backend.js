const express = require("express"); // required for creating the server
const fs = require("fs"); //streaming the csv file
const csv = require("csv-parser"); // required for parsing the file

//initializing the instance of the server
const app = express();

//File Path to the CSV
const filePath = "dataset/test.csv";

//For adding middleware for handling multipart/formdata
const multer = require("multer");

//For uploading the image files under the images folder
// Multer configuration to upload files to 'images' folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "images/");
    },
    filename: function (req, file, cb) {
      // Use original filename without modification
      cb(null, file.originalname);
    },
  });
  
  // Initialize Multer with the configured storage
  const upload = multer({ storage: storage });

//Setting the port number
const port = 5002;

//Storing the csv file data in an object for lookup
const data_csv = {};

const readCsvFile = (filePath, column1, column2, callback) => {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      data_csv[row[column1]] = row[column2];
    })
    .on("end", () => {
      callback(null, data_csv);
    })
    .on("error", (error) => {
      callback(error, null);
    });
};

readCsvFile(filePath, "Image", "Results", (error, data_csv) => {
  if (error) {
    console.error("Error reading CSV file:", error);
  } else if (data_csv) {
    console.log("Data Extracted Successfully", Object.keys(data_csv).length);
  }
});

const removeExtension =(filename)=> {
  return filename.split(".").slice(0, -1).join(".");
}

app.use("/", upload.single("inputFile"), function (req, res) {
  const filename = req.file.originalname;
  const filenameWithoutExtension = removeExtension(filename);
  if (data_csv[filenameWithoutExtension]) {
    res.send(
      `${filenameWithoutExtension}` +
        ":" +
        `${data_csv[filenameWithoutExtension]}`
    );
  }
});
app.listen(port, () => {
  console.log(`Server running at PORT: ${port}`);
});
