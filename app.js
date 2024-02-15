// const express = require('express')

// const app = express()

// const PORT = 5000

// app.get('/', (req,res)=>{
//     console.log("Request", req)
//     console.log("Response",res)
// })

// app.listen(PORT, "3.19.67.235", ()=>{
//     console.log("Server running at host!!!!!")
// })

const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const filePath = 'dataset/test.csv'; // Path to your CSV fil

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
// const ipAddress = '3.19.67.235'; // Replace with your desired IP address
const port = 5002; // Replace with your desired port number

// app.use('/', (req, res) => {
// //   console.log("req",req)
//   console.log("Response---->", res)
// //   res.send('Hello World!');
// });

// function readFilenameFromRequest(filename) {
//     // Assuming filename contains just the name of the file without path
//     return filename;
// }

// // Function to read datasets from CSV file
// function readDatasetsFromCSV(csvFilePath, callback) {
//     const datasets = {};

//     fs.createReadStream(csvFilePath)
//         .pipe(csv())
//         .on('data', (row) => {
//             // Assuming the CSV file has columns 'image' and 'results'
//             datasets[row.image] = row.results;
//             callback
//         })
//         .on('end', () => {
//             callback(datasets);
//         });
// }

function removeExtension(filename) {
    return filename.split('.').slice(0, -1).join('.');
}

const readDataFromCSV= (filenameWithoutExtension, filePath, column1, column2, callback) =>{
    const data = {}
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            // Assuming column1 and column2 exist in each row
            data[row[column1]] = row[column2];
        })
        .on('end', () => {
            callback(null, data);
        })
        .on('error', (error) => {
            callback(error, null);
        });

    // console.log("Data------>", data[filenameWithoutExtension])

}


// function findResult(inputFilename, datasets) {
//     return datasets[inputFilename] || 'Result not found';
// }

app.use('/', upload.single('inputFile'), function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    const filename = req.file.originalname;
    const filenameWithoutExtension = removeExtension(filename);
    // console.log("File Name", filename)
    console.log("FileName.extension", filenameWithoutExtension)
    readDataFromCSV(filenameWithoutExtension, filePath, 'Image', 'Results' ,(error, data) => {
        if (error) {
            console.error('Error reading CSV file:', error);
        } else {
            // console.log("Result", `${filenameWithoutExtension}` + ':' + `${data[filenameWithoutExtension]}`)
            res.send(`${filenameWithoutExtension}` + ':' + `${data[filenameWithoutExtension]}`)
        }
    })
    
    // readDatasetsFromCSV("dataset/test.csv", (datasets) => {
    //     const result = findResult(filenameWithoutExtension)
    //     res.send({ [filenameWithoutExtension]: result });
    // });

    // console.log(req.file, req.body)
 });
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});