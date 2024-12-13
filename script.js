const fs = require('fs');

async function processApiData(apiUrl) {

    try {
        const endpoint = apiUrl.split('/').pop();
        const interfaceName = endpoint.charAt(0).toUpperCase() + endpoint.slice(1);
    
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("API response is not an array of objects");
    }

const customMappings = [];

for (const [index, item] of data.entries()) {
  const typeMapping = [];

  for (const [key, value] of Object.entries(item)) {
    let type = typeof value;

    if (type === 'object' && value !== null) {
      type = 'object'; // You may modify this if you want to handle more complex types
    }
    // Ensure proper formatting for types like 'string', 'number', 'boolean', etc.
    typeMapping.push(`${key}: ${type}`);
  }

  // Use the dynamic interface name with the first letter capitalized
  customMappings.push(`export interface ${interfaceName} {\n${typeMapping.join('; \n')};\n}`);
}

// Combine the mappings
const output = customMappings.join('\n\n');

// Append the output to a .txt file
fs.appendFile('interfaces.txt', output + '\n\n', (err) => {
  if (err) {
    console.error('Error writing to file:', err.message);
  } else {
    console.log('Interfaces appended to interfaces.txt');
  }
});

return output;
} catch (error) {
console.error('Error:', error.message);
}
}

processApiData('https://jsonplaceholder.typicode.com/posts');
























   
