const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',  // Allow your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true // Allow cookies and authorization headers with requests
}));

// const API_KEY = '892c40ff4d98441';
// const API_SECRET = 'c131cf8ec2dfd26';
// const BASE_URL = 'http://161.35.236.145';


// fetch("http://161.35.236.145/api/method/frappe.client.save", {
//   "headers": {
//     "accept": "application/json",
//     "accept-language": "en-US,en;q=0.9,ar;q=0.8",
//     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//     "x-frappe-cmd": "",
//     "x-frappe-csrf-token": "5514016aa24d890a5be1d986e664eb7376c69ad072c911d3d490cef4",
//     "x-requested-with": "XMLHttpRequest",
//     "cookie": "user_image=; sid=97a699c7b2f63abee7335f748c9e4d70e6c62ace24a95fb1782f0565; system_user=yes; full_name=Administrator; user_id=Administrator",
//     "Referer": "http://161.35.236.145/app/todo",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": "doc=%7B%22docstatus%22%3A0%2C%22doctype%22%3A%22ToDo%22%2C%22name%22%3A%22new-todo-ulqkjqpaik%22%2C%22__islocal%22%3A1%2C%22__unsaved%22%3A1%2C%22owner%22%3A%22Administrator%22%2C%22status%22%3A%22Open%22%2C%22priority%22%3A%22Medium%22%2C%22date%22%3A%222024-05-28%22%2C%22__run_link_triggers%22%3A1%2C%22description%22%3A%22%3Cdiv+class%3D%5C%22ql-editor+read-mode%5C%22%3E%3Cp%3Elk1j398123aaa%3C%2Fp%3E%3C%2Fdiv%3E%22%7D",
//   "method": "POST"
// });

const data = {
    allocated_to: "",
    doctype: 'ToDo',
    assigned_by: "",
    assigned_by_full_name: "",
    assignment_rule: "",
    color: "",
    column_break_2: "",
    column_break_10: "",
    description: "عو عويو",
    description_and_status: "",
    description_section: "",
    priority: "Medium",
    reference_name: "",
    reference_type: "",
    role: "",
    section_break_6: "",
    sender: "",
    status: "Open"
  };
  
// const data = {"description": "New ToDo"}
// const testDocData = {
//     "attach": "",
//     "attach_image": "",
//     "autocomplete": "",
//     "barcode": "",
//     "bio": "asfa",
//     "button": "",
//     "check": "0",
//     "code": "",
//     "color": "",
//     "currency": "",
//     "d1": "",
//     "d2": "",
//     "data": "",
//     "date": "",
//     "datetime": "",
//     "dl_doc": "Opportunity",
//     "duration": "0",
//     "dynamic_link": "",
//     "float": "",
//     "full_name": "farah ke",
//     "geolocation": "",
//     "heading": "",
//     "html": "",
//     "html_editor": "",
//     "icon": "",
//     "image": "",
//     "image_link": "",
//     "int": "",
//     "json": "",
//     "link": "",
//     "long_text": "",
//     "markdown_editor": "",
//     "password": "",
//     "percent": "",
//     "phone": "",
//     "rating": "",
//     "read_only": "Mad",
//     "select": "",
//     "signature": "",
//     "small_text": "",
//     "table": "",
//     "table_multiselect": "",
//     "text": "",
//     "text_editor": "",
//     "time": "",
//     "warehouse": ""
//   }

const kurwaData = {
    "amended_from": "",
    "attach_image_kphq": "ads",
    "attach_utln": "asfsadf",
    "autocomplete_otbl": "sadf",
    "check_xbsx": "0sdf",
    "code_aibs": "fdsa",
    "color_bpvx": "asdf",
    "currency_dlmh": "asdf",
    "currency_mgch": "as",
    "data_sfoc": "as",
    "date_xqhc": "2024-05-08",
    "datetime_hedx": "fa",
    "duration_ktzq": "as",
    "float_xarh": "ff",
    "html_editor_ujvy": "sd",
    "int_fhpe": "sa",
    "long_text_pgry": "asdf",
    "password_jeng": "as",
    "percent_bwlr": "sss",
    "phone_ordl": "sf"
  }
  
  
  function sanitizeData(data) {
    // Iterate over each key in the object
    for (const key in data) {
        // Check if the property is an empty string
        if (data[key] === '' && key !== "dynamic_link") {
            data[key] = null;  // Replace empty string with null
        }
    }
    return data;
}

// const sanitized = sanitizeData(testDocData);

const data1 = {"dl_doc":"Opportunity","dynamic_link":""}

const formData = new URLSearchParams();
// Object.keys(data).forEach(key => {
// formData.append(key, data[key]);
// });

formData.append("doc", JSON.stringify(data)); // Make sure the 'doc' key is used
console.log(formData.toString().includes("description"));

async function sendDataToFrappe() {

        // try {
        //     const dat = JSON.parse(JSON.stringify(testDocData));
        //     console.log({dat});
        // } catch (e) {
        //     console.error("Invalid JSON data", e);
        // }
        // return;
    fetch("http://161.35.236.145/api/resource/kurwa", {
        headers: {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9,ar;q=0.8",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-frappe-csrf-token": "5514016aa24d890a5be1d986e664eb7376c69ad072c911d3d490cef4",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "user_image=; sid=97a699c7b2f63abee7335f748c9e4d70e6c62ace24a95fb1782f0565; system_user=yes; full_name=Administrator; user_id=Administrator",
            "Referer": "http://161.35.236.145/app/todo",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "POST",
        // body: JSON.stringify(data),
        body: JSON.stringify(kurwaData),
        // body: formData.toString()
        })
        .then(response => response.json())
        .then(data => {
        console.log('Success:', data);
        })
        .catch((error) => {
        console.error('Error:', error);
        });

}

app.use(bodyParser.json());

app.post('/api/submit-frappe-form/kurwa', async (req, res) => {
    try {
        console.log('Received form submission:', req.body);
        const requestBody = sanitizeData(req.body)
        const frappeResult = await fetch("http://161.35.236.145/api/resource/kurwa", {
            headers: {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9,ar;q=0.8",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-frappe-csrf-token": "5514016aa24d890a5be1d986e664eb7376c69ad072c911d3d490cef4",
                "x-requested-with": "XMLHttpRequest",
                "cookie": "user_image=; sid=97a699c7b2f63abee7335f748c9e4d70e6c62ace24a95fb1782f0565; system_user=yes; full_name=Administrator; user_id=Administrator",
                "Referer": "http://161.35.236.145/app/todo",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            method: "POST",
            body: JSON.stringify(requestBody),
        });
        const frappeJson = await frappeResult.json();
        console.log({frappeJson});
        res.json(frappeJson);
    } catch (e) {
        console.log({error: e});
    }
    });

// app.post('/api/submit-frappe-form/kurwa', (req, res) => {
//     console.log('Received form submission:', req.body);
  
//     // fetch("http://161.35.236.145/api/method/frappe.client.save", {
//     //     headers: {
//     //         "accept": "application/json",
//     //         "accept-language": "en-US,en;q=0.9,ar;q=0.8",
//     //         "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//     //         "x-frappe-csrf-token": "5514016aa24d890a5be1d986e664eb7376c69ad072c911d3d490cef4",
//     //         "x-requested-with": "XMLHttpRequest",
//     //         "cookie": "user_image=; sid=97a699c7b2f63abee7335f748c9e4d70e6c62ace24a95fb1782f0565; system_user=yes; full_name=Administrator; user_id=Administrator",
//     //         "Referer": "http://161.35.236.145/app/todo",
//     //         "Referrer-Policy": "strict-origin-when-cross-origin"
//     //     },
//     //     method: "POST",
//     //     // body: JSON.stringify(data),
//     //     body: req.body
//     //     })
//     //     .then(response => response.json())
//     //     .then(data => {
//     //     console.log('Success:', data);
//     //     })
//     //     .catch((error) => {
//     //     console.error('Error:', error);
//     //     });

//     // Here, you would typically handle the form data, e.g., save it to a database,
//     // perform some operations, validate inputs, etc.
    
//     // This is a simple response to indicate success.
//     res.status(200).json({
//       status: 'success',
//       message: 'Form data received successfully',
//       formData: req.body
//     });
//   });
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// sendDataToFrappe();
