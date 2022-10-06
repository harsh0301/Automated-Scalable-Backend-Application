import mysql from 'mysql';

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'root',
    database: 'cloud'
});

connection.connect((err) => {
  if (err) {
  console.log("Error occurred", err);
  } else {
  console.log("Connected to MySQL Server");
  }
  });

  export default connection;