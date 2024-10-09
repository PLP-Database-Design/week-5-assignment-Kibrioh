const express = require('express');
const app = express();
require('dotenv').config();
const mysql = require('mysql2');


// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Question 1
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(`Error: ${err.message}`);
    }

    // Initialize the response string
    let responseText = 'Patients List:\n';
    
    // Loop through each patient and format the output
    results.forEach((patient) => {
      // Format date to yyyy/mm/dd
      const formattedDate = patient.date_of_birth.toISOString().slice(0, 10).replace(/-/g, '/');
      responseText += `ID: ${patient.patient_id}, Name: ${patient.first_name} ${patient.last_name}, D.O.B: ${formattedDate}\n`;
    });

    // Send the formatted string as the response
    res.send(responseText.trim());  
  });
});


// Question 2
app.get('/providers', (req, res) => {
  const query = 'SELECT provider_id, first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(`Error: ${err.message}`);
    }

    // Initialize the response string
    let responseText = 'Providers List:\n';
    
    // Loop through each provider and format the output
    results.forEach((provider) => {
      responseText += `ID: ${provider.provider_id}, Name: ${provider.first_name} ${provider.last_name}, Specialty: ${provider.provider_specialty}\n`;
    });

    // Send the formatted string as the response
    res.send(responseText); 
  });
});


// Question 3
app.get('/patients/:first_name', (req, res) => {
  const { first_name } = req.params;
  const query = 'SELECT * FROM patients WHERE first_name = ?';
  
  db.query(query, [first_name], (err, results) => {
    if (err) {
      return res.status(500).send(`Error: ${err.message}`);
    }

    if (results.length === 0) {
      return res.status(404).send('No patients found with that first name.');
    }

    // Initialize the response string
    let responseText = 'Patients List:\n';

    // Loop through each patient and format the output
    results.forEach((patient) => {
      // Format date to yyyy/mm/dd
      const formattedDate = patient.date_of_birth.toISOString().slice(0, 10).replace(/-/g, '/');
      responseText += `ID: ${patient.patient_id}, Name: ${patient.first_name} ${patient.last_name}, D.O.B: ${formattedDate}\n`;
    });

    // Send the formatted string as the response
    res.send(responseText.trim()); 
  });
});

//Question 4
app.get('/providers/:provider_specialty', (req, res) => {
  const { provider_specialty } = req.params;
  const query = 'SELECT * FROM providers WHERE provider_specialty = ?';
  
  db.query(query, [provider_specialty], (err, results) => {
    if (err) {
      return res.status(500).send(`Error: ${err.message}`);
    }

    if (results.length === 0) {
      return res.status(404).send('No providers found with that specialty.');
    }

    // Initialize the response string
    let responseText = 'Providers List by Specialty:\n';

    // Loop through each provider and format the output
    results.forEach((provider) => {
      responseText += `ID: ${provider.provider_id}, Name: ${provider.first_name} ${provider.last_name}, Specialty: ${provider.provider_specialty}\n`;
    });

    // Send the formatted string as the response
    res.send(responseText.trim()); 
  });
});


// listen to the server
   const PORT = 3000
   app.listen(PORT, () => {
     console.log(`server is runnig on http://localhost:${PORT}`)
   })