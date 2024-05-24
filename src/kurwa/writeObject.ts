const fs = require('fs');

function collectFieldTypes(obj) {
    let fieldTypes = [];

    function traverse(jsonObject) {
        if (Array.isArray(jsonObject)) {
            jsonObject.forEach(item => traverse(item));
        } else if (typeof jsonObject === 'object' && jsonObject !== null) {
            if (jsonObject.fieldtype) {
                // @ts-ignore
                fieldTypes.push(jsonObject.fieldtype);
            }
            Object.keys(jsonObject).forEach(key => traverse(jsonObject[key]));
        }
    }

    traverse(obj);
    return fieldTypes.join(' |');
}

// const fieldTypeString = collectFieldTypes(frappeObject.docs);

// fs.writeFile('fieldTypes.txt', fieldTypeString, (err) => {
//     if (err) {
//         console.error('Error writing to file:', err);
//     } else {
//         console.log('Successfully wrote field types to file');
//     }
// });
