const xlsx = require('xlsx');

// Assuming the file path is correct as provided by the user
const filePath = 'c:\\Users\\lenovo\\OneDrive\\Desktop\\flickspacefrontend-master\\src\\components\\ui\\Flex Office List (2).xlsx';

try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (data.length > 0) {
        console.log('Headers:', data[0]);
        if (data.length > 1) {
            console.log('First Row:', data[1]);
        }
    } else {
        console.log('No data found in the file.');
    }
} catch (error) {
    console.error('Error reading file:', error);
}
