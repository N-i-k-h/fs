const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\lenovo\\OneDrive\\Desktop\\flickspacefrontend-master\\src\\components\\ui\\Flex Office List (2).xlsx';
const outputPath = 'c:\\Users\\lenovo\\OneDrive\\Desktop\\flickspacefrontend-master\\src\\data\\workspaces.js';

try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Helper to find key that includes a string (since newlines might differ)
    const findKey = (obj, str) => Object.keys(obj).find(k => k.toLowerCase().includes(str.toLowerCase()));

    const workspaces = data.map((row, index) => {
        const operatorKey = findKey(row, "Operator");
        const propertyKey = findKey(row, "Property");
        const areaKey = findKey(row, "Area");
        const seatsKey = findKey(row, "Billable seats");
        const microMarketKey = findKey(row, "Micro-market");
        const locationKey = findKey(row, "Location within");

        const operator = row[operatorKey] || "Workspace";
        const property = row[propertyKey] || "";

        // Construct a price based on random factor or density if available to make it look realistic but fake
        const price = Math.floor(Math.random() * (25000 - 8000 + 1) + 8000);

        return {
            id: row['Sr No'] || index + 1000,
            name: `${operator} ${property}`.trim(),
            city: row['City'] || "Bangalore",
            location: row[locationKey] || row[microMarketKey] || row['City'],
            type: "coworking", // Default
            price: price,
            seats: row[seatsKey] || 50,
            rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1), // Random rating 4.0-5.0
            images: [], // Empty as requested
            amenities: ["WiFi", "Coffee", "Meeting Rooms", "Reception", "Power Backup"], // Default
            description: `Modern workspace located in ${row[microMarketKey] || row['City']}. Managed by ${operator}.`,
            snapshot: {
                capacity: `${row[seatsKey] || 50} Seats`,
                area: `${row[areaKey] || 2500} Sq. Ft.`,
                lock_in: "12 Months"
            },
            highlights: [
                { title: "Location", desc: row[locationKey] || row[microMarketKey] || "Prime Location" },
                { title: "Grade", desc: row["Grade"] || "A Grade" }
            ],
            commercials: [
                { component: "Monthly Rent", cost: `₹${price} / seat`, remarks: "Estimated" }
            ],
            compliance: []
        };
    });

    const fileContent = `export const workspaces = ${JSON.stringify(workspaces, null, 2)};\n\nexport default workspaces;`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`Successfully generated workspaces.js with ${workspaces.length} entries.`);

} catch (error) {
    console.error("Error:", error);
}
