const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('c:\\Users\\lenovo\\OneDrive\\Desktop\\flickspacefrontend-master\\src\\components\\ui\\Flex Office List (2).xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Print all keys from the first object to understand the structure
    if (data.length > 0) {
        console.log(JSON.stringify(Object.keys(data[0]), null, 4));
        console.log("---------------------------------------------------");
    } else {
        console.log("No data found");
    }
} catch (error) {
    console.error("Error:", error);
}
