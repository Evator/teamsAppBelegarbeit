const express = require('express');
const os = require('os');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const connection = require('./dbConnection');
const query = require('./dbQuery');
const pg = require('./postgresConnection');
const variables = require('./postgresVariables');
const db = require('./postgresConnection');


// Database Config
// Get the Host from Environment or use default
const host = process.env.DB_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.DB_USER || 'root';

// Get the Password for DB from Environment or use default
const password = process.env.DB_PASS || 'password';

// Get the Database from Environment or use default
const database = process.env.DB_DATABASE || 'teamsapp';




const app = express();
app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../../dist/index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});
app.use(bodyParser.json());


app.post('/surveydata', async (req, res) => {
 
 
  //select schema
  await pg.any("SET search_path TO $1",[variables.schema]).catch(console.log);

  // Check if Mitarbeiter exists
  const MitarbeiterExists = await pg.any( `Select id_Mitarbeiter from Mitarbeiter Where mitarbeiter."TeamsID" = $1`, [req.body.Mitarbeiter_ID]).catch(console.log);
 
  
  if (!MitarbeiterExists[0]) {
    // Check if entry for Unternehmen exists
    const UnternehmenExists = await pg.any( `Select unternehmen."id_Unternehmen" from Unternehmen Where unternehmen."Team" = $1`,[req.body.Team_Name]).catch(console.log);
    if (!UnternehmenExists[0]) {
      // if entry for Unternehmen doesn't exist, create new entry
      await pg.any( `Insert Into Unternehmen ("Team") Values ($1)`,[req.body.Team_Name]).catch(console.log);
    }
    const idUnternehmen = await pg.any(`Select unternehmen."id_Unternehmen" from unternehmen Where unternehmen."Team" = $1` ,[req.body.Team_Name]).catch(console.log);
    // if entry for Mitarbeiter doesn't exist, create new entry
    await pg.any( `Insert Into Mitarbeiter ("id_Unternehmen", "E_Mail_Adresse", "TeamsID") Values ($1, $2, $3)`,[JSON.stringify(idUnternehmen[0].id_Unternehmen), req.body.Mail, req.body.Mitarbeiter_ID]).catch(console.log);
  }
  // create new entry for Befragung 
 
  const idMitarbeiter = await pg.any(`Select id_Mitarbeiter from mitarbeiter Where mitarbeiter."TeamsID" = $1`,[req.body.Mitarbeiter_ID]).catch(console.log);

  // create new Position entry in db
 
  await pg.any(`Insert Into job_position ("Datum", "Position_Name", "id_Mitarbeiter") Values (Now(), $1, $2)`,[JSON.stringify(req.body.Rolle), JSON.stringify(idMitarbeiter[0].id_mitarbeiter)]).catch(console.log);

  // delete unneccssary content from req.body
  delete req.body.Rolle;
  delete req.body.Mitarbeiter_ID;
  delete req.body.Mail;
  delete req.body.Team_Name;

  // write entry for results
  const result_data = JSON.stringify(req.body);
  await pg.any(`Insert Into befragung ("Datum", "Ergebnis", "id_Mitarbeiter") Values (NOW(), $1, $2)`,[result_data,JSON.stringify(idMitarbeiter[0].id_mitarbeiter)]).catch(console.log);


  return res.send('Received a POST HTTP method');
});




app.post('/companyDataGet', async (req, res) => {

   //select schema
   await pg.any("SET search_path TO $1",[variables.schema]).catch(console.log);

  // getCompanyData
  const Unternehmen = await pg.any(`Select "Bezeichnung", "Mitarbeiterzahl", "Adresse", "E_Mail_Adresse" from Unternehmen Where "Team" = $1`,[JSON.stringify(req.body.Team_Name)]).catch(console.log);
  console.log(Unternehmen);

  return res.send(JSON.stringify(Unternehmen));
});


app.post('/companyDataSet', async (req, res) => {

  await pg.any("SET search_path TO $1",[variables.schema]).catch(console.log);

  // Check if Unternehmen exists
  const UnternehmenExists = await pg.any(`Select "id_Unternehmen" from Unternehmen Where "Team" = $1`,[JSON.stringify(req.body.Team_Name)]).catch(console.log);
  if (!UnternehmenExists[0]) {
  // if Unternehmen doesn't exist, create new Unternehmen
    await pg.any(`Insert Into Unternehmen ("Team", "Bezeichnung", "Mitarbeiterzahl", "Adresse", "E_Mail_Adresse") Values ($1, $2, $3, $4, $5)`,[JSON.stringify(req.body.Team_Name),JSON.stringify(req.body.BezeichnungInput), JSON.stringify(req.body.MitarbeiterzahlInput), JSON.stringify(req.body.AdresseInput), JSON.stringify(req.body.mailInput)]).catch(console.log);
  }

  // if Unternehmen exists, update values
  else {
    await pg.any( `Update Unternehmen SET "Bezeichnung"= $1, "Mitarbeiterzahl"= $2, "Adresse"= $3, "E_Mail_Adresse"= $4 WHERE "Team"= $5`,[JSON.stringify(req.body.BezeichnungInput), JSON.stringify(req.body.MitarbeiterzahlInput),JSON.stringify(req.body.AdresseInput), JSON.stringify(req.body.mailInput), JSON.stringify(req.body.Team_Name)] ).catch(console.log);
  }
  
  return res.send(JSON.stringify(UnternehmenExists));
});


app.listen(process.env.PORT || 3001, () => console.log(`Listening on port ${process.env.PORT || 3001}!`));
