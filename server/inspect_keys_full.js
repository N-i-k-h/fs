const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('c:\\Users\\lenovo\\OneDrive\\Desktop\\flickspacefrontend-master\\src\\components\\ui\\Flex Office List (2).xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length > 0) {
        const keys = Object.keys(data[0]);
        keys.forEach(key => console.log(key));
    } else {
        console.log("No data found");
    }
} catch (error) {
    console.error("Error:", error);
}
