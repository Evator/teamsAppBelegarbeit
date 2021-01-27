const express = require('express');
const os = require('os');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const connection = require('./dbConnection');
const query = require('./dbQuery');

// Database Config
// Get the Host from Environment or use default
const host = process.env.DB_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.DB_USER || 'root';

// Get the Password for DB from Environment or use default
const password = process.env.DB_PASS || 'password';

// Get the Database from Environment or use default
const database = process.env.DB_DATABASE || 'teamsapp';

const sqlCommandCreateDB1 = 'create schema IF NOT EXISTS teamsapp;';
const sqlCommandCreateDB2 = 'CREATE TABLE IF NOT EXISTS `befragung` ( `id_Befragung` int NOT NULL AUTO_INCREMENT,`Datum` datetime DEFAULT NULL, `Ergebnis` json DEFAULT NULL,`id_Mitarbeiter` int DEFAULT NULL,PRIMARY KEY (`id_Befragung`),KEY `id_Mitarbeiter_idx` (`id_Mitarbeiter`),CONSTRAINT `id_Mitarbeiter` FOREIGN KEY (`id_Mitarbeiter`) REFERENCES `mitarbeiter` (`id_mitarbeiter`));';
const sqlCommandCreateDB3 = 'CREATE TABLE IF NOT EXISTS `job_position` (`id_Position` int NOT NULL AUTO_INCREMENT,`Position_Name` varchar(45) DEFAULT NULL,`Datum` datetime DEFAULT CURRENT_TIMESTAMP,`id_Mitarbeiter` int DEFAULT NULL,PRIMARY KEY (`id_Position`),KEY `id_Mitarb_idx` (`id_Mitarbeiter`),CONSTRAINT `id_Mitarb` FOREIGN KEY (`id_Mitarbeiter`) REFERENCES `mitarbeiter` (`id_mitarbeiter`));';
const sqlCommandCreateDB4 = 'CREATE TABLE IF NOT EXISTS `mitarbeiter` (`id_mitarbeiter` int NOT NULL AUTO_INCREMENT,`id_Unternehmen` int DEFAULT NULL,`E_Mail_Adresse` varchar(45) DEFAULT NULL,`TeamsID` varchar(45) NOT NULL,PRIMARY KEY (`id_mitarbeiter`,`TeamsID`),KEY `id_Unternehmen_idx` (`id_Unternehmen`),CONSTRAINT `id_Unternehmen` FOREIGN KEY (`id_Unternehmen`) REFERENCES `unternehmen` (`id_Unternehmen`));';
const sqlCommandCreateDB5 = 'CREATE TABLE `unternehmen` (`id_Unternehmen` int NOT NULL AUTO_INCREMENT,`Team` varchar(45) NOT NULL,`Bezeichnung` varchar(45) DEFAULT NULL,`Mitarbeiterzahl` varchar(45) DEFAULT NULL,`Adresse` varchar(45) DEFAULT NULL,`E_Mail_Adresse` varchar(45) DEFAULT NULL,PRIMARY KEY (`id_Unternehmen`,`Team`));';


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
  // create db connection
  const conn = await connection({
    host, user, password, database,
  }).catch((e) => {});
  // create db if doesn't exists
  await query(conn, sqlCommandCreateDB1).catch(console.log);
  await query(conn, sqlCommandCreateDB2).catch(console.log);
  await query(conn, sqlCommandCreateDB3).catch(console.log);
  await query(conn, sqlCommandCreateDB4).catch(console.log);
  await query(conn, sqlCommandCreateDB5).catch(console.log);
  // Check if Mitarbeiter exists
  const MitarbeiterExists = await query(conn, `Select id_Mitarbeiter from Mitarbeiter Where TeamsID = '${req.body.Mitarbeiter_ID}'`).catch(console.log);

  if (!MitarbeiterExists[0]) {
    // Check if Unternehmen exists
    const UnternehmenExists = await query(conn, `Select id_Unternehmen from Unternehmen Where Team = '${req.body.Team_Name}'`).catch(console.log);
    if (!UnternehmenExists[0]) {
      // if Unternehmen doesn't exist, create new Unternehmen
      await query(conn, `Insert Into Unternehmen (Team) Values ('${req.body.Team_Name}')`).catch(console.log);
    }
    const idUnternehmen = await query(conn, `Select id_Unternehmen from unternehmen Where Team = '${req.body.Team_Name}'`).catch(console.log);
    // if Mitarbeiter doesn't exist, create new Mitarbeiter
    await query(conn, `Insert Into Mitarbeiter (id_unternehmen, E_Mail_Adresse, TeamsID) Values (${idUnternehmen[0].id_Unternehmen}, '${req.body.Mail}', '${req.body.Mitarbeiter_ID}')`).catch(console.log);
  }
  // create new Befragungs-entry in database
  const idMitarbeiter = await query(conn, `Select id_Mitarbeiter from mitarbeiter Where TeamsID = '${req.body.Mitarbeiter_ID}'`).catch(console.log);


  // create new Position entry in db
  await query(conn, `Insert Into job_position (Datum, Position_Name, id_Mitarbeiter) Values (Now(),${JSON.stringify(req.body.Rolle)}, ${idMitarbeiter[0].id_Mitarbeiter})`).catch(console.log);

  // delete unneccssary content from req.body
  delete req.body.Rolle;
  delete req.body.Mitarbeiter_ID;
  delete req.body.Mail;
  delete req.body.Team_Name;

  // write entry for results
  const result_data = JSON.stringify(req.body);
  await query(conn, `Insert Into befragung (Datum, Ergebnis, id_Mitarbeiter) Values (NOW(),'${result_data}','${idMitarbeiter[0].id_Mitarbeiter}')`).catch(console.log);

  // end connection
  conn.end();

  return res.send('Received a POST HTTP method');
});


app.post('/companyDataGet', async (req, res) => {
  // create db connection
  const conn = await connection({
    host, user, password, database,
  }).catch((e) => {});
  // create db if doesn't exists
  await query(conn, sqlCommandCreateDB1).catch(console.log);
  await query(conn, sqlCommandCreateDB2).catch(console.log);
  await query(conn, sqlCommandCreateDB3).catch(console.log);
  await query(conn, sqlCommandCreateDB4).catch(console.log);
  await query(conn, sqlCommandCreateDB5).catch(console.log);

  // getCompanyData
  const Unternehmen = await query(conn, `Select Bezeichnung, Mitarbeiterzahl, Adresse, E_Mail_Adresse from Unternehmen Where Team = '${req.body.Team_Name}'`).catch(console.log);
  console.log(Unternehmen);


  // end connection
  conn.end();

  return res.send(JSON.stringify(Unternehmen));
});


app.post('/companyDataSet', async (req, res) => {
  // create db connection
  const conn = await connection({
    host, user, password, database,
  }).catch((e) => {});
  // create db if doesn't exists
  await query(conn, sqlCommandCreateDB1).catch(console.log);
  await query(conn, sqlCommandCreateDB2).catch(console.log);
  await query(conn, sqlCommandCreateDB3).catch(console.log);
  await query(conn, sqlCommandCreateDB4).catch(console.log);
  await query(conn, sqlCommandCreateDB5).catch(console.log);

  // Check if Unternehmen exists
  const UnternehmenExists = await query(conn, `Select id_Unternehmen from Unternehmen Where Team = '${req.body.Team_Name}'`).catch(console.log);
  if (!UnternehmenExists[0]) {
  // if Unternehmen doesn't exist, create new Unternehmen
    await query(conn, `Insert Into Unternehmen (Team, Bezeichnung, Mitarbeiterzahl, Adresse, E_Mail_Adresse) Values ('${req.body.Team_Name}', '${req.body.BezeichnungInput}', '${req.body.MitarbeiterzahlInput}','${req.body.AdresseInput}','${req.body.mailInput}')`).catch(console.log);
  }

  // if Unternehmen exists, update values
  else {
    await query(conn, `Update Unternehmen SET Bezeichnung='${req.body.BezeichnungInput}', Mitarbeiterzahl='${req.body.MitarbeiterzahlInput}', Adresse='${req.body.AdresseInput}', E_Mail_Adresse='${req.body.mailInput}' WHERE Team='${req.body.Team_Name}'`).catch(console.log);
  }


  // end connection
  conn.end();
  return res.send(JSON.stringify(UnternehmenExists));
});


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
