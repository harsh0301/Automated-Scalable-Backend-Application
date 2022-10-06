import mysql from 'mysql';

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'root',
    database: 'cloud'
});

connection.connect((err) => {
    if (err) {
      throw err;
    }
   console.log('db connected');
  //  var sql = "CREATE TABLE user1 (id VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, acc_created VARCHAR(255) NOT NULL, acc_updated VARCHAR(255) NOT NULL)";

  //   connection.query(sql, function (err, result) {
  //       if (err) {
  //         //console.log(err);
  //       }
  //       console.log("New table created");
  //     });
  });

  export default connection;