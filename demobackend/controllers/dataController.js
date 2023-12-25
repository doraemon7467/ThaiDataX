const OCRData = require('../models/thaiModel');
// Import the detectText function
const detectText = require('./mainCode'); // Replace with the correct path to your file


const asyncHandler = require('express-async-handler')
//@desc Get all data
//@route GET /api/data
//@access public
const getData = asyncHandler(async (req, res) => {
    try {
        const data = await OCRData.find();
        res.status(200).json(data); // Send the retrieved data as JSON response
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

//@desc Create New data
//@route POST /api/data
//@access public
const createData = asyncHandler(async (req, res) => {

    // Call the detectText function to get the extracted data
    const file = req.file;
    const extractedData = await detectText(file);
    // Access the extracted variables
    const { idnumber, name, lastname, dob, doi, doe } = extractedData;
    console.log(idnumber," ",name," ",lastname," ",dob," ",doi," ",doe);

    // Create a new OCRData object using the defined schema with parsed dates
    const ocrData = new OCRData({
        idNumber: idnumber,
        name: name,
        lastName: lastname,
        dateOfBirth: dob,
        dateOfIssue: doi,
        dateOfExpiry: doe,
    });

    // Save the extracted data to the database
    await ocrData.save();

    res.status(201).json({ message: 'OCR data saved successfully!' });
    console.log("OCR data saved successfully!")
  });

//@desc Update data
//@route PUT /api/data/:id
//@access public
const updateData = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the ID from request parameters
    const { idNumber, name, lastName, dateOfBirth, dateOfIssue, dateOfExpiry } = req.body; // Get updated data from request body

    try {
        const updatedData = await OCRData.findByIdAndUpdate(
            id,
            { idNumber, name, lastName, dateOfBirth, dateOfIssue, dateOfExpiry },
            { new: true } // To return the updated data
        );

        if (!updatedData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ message: 'Data updated successfully', data: updatedData });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

//@desc Delete data
//@route DELETE /api/data/:id
//@access public
const deleteData = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the ID from request parameters

    try {
        const deletedData = await OCRData.findByIdAndDelete(id);

        if (!deletedData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = { getData ,createData , updateData ,deleteData};