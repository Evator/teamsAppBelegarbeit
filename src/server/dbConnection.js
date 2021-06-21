//For MySQL - currently not used


const mysql = require('mysql');
// connect to db
module.exports = async params => new Promise(
  (resolve, reject) => {
    const connection = mysql.createConnection(params);
    connection.connect((error) => {
	  if (error) {
        reject(error);
        return;
      }
      resolve(connection);
    });
  }
);
