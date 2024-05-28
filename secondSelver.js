const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const API_KEY = '892c40ff4d98441';
const API_SECRET = 'c131cf8ec2dfd26';
const BASE_URL = 'http://161.35.236.145';


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

// const data = {"docstatus":0,"doctype":"ToDo","name":"new-todo-ulqkjqpaik","__islocal":1,"__unsaved":1,"owner":"Administrator","status":"Open","priority":"Medium","date":"2024-05-28","__run_link_triggers":1,"description":"<div class=\"ql-editor read-mode\"><p>kurwa the big meow</p></div>"}

const formData = new URLSearchParams();
// Object.keys(data).forEach(key => {
// formData.append(key, data[key]);
// });

formData.append("doc", JSON.stringify(data)); // Make sure the 'doc' key is used
console.log(formData.toString().includes("description"));

async function sendDataToFrappe() {
    // const url = `${BASE_URL}/app/resource/ToDo`; 
    // const data = {
    //     description: "this is request",
    // };

    // try {
    //     console.log("sending request");

    //     const response = await axios.post(url, data, {
    //         headers: {
    //             'Authorization': `token ${API_KEY}:${API_SECRET}`,
    //             // 'Content-Type': 'application/json',
    //             'Accept': 'application/json',
    //         }
    //     });
    //     console.log('Data sent successfully:', response);
    // } catch (error) {
    //     console.error('Error sending data to Frappe:', error.response ? error.response.data : error);
    // }

    fetch("http://161.35.236.145/api/resource/ToDo", {
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
        body: JSON.stringify(data),
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

app.get('/send', (req, res) => {
    sendDataToFrappe()
        .then(console.log)
        .catch(console.log);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

sendDataToFrappe();
