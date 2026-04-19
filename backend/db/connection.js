const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Anu@Duggu1015',
  database: 'one'
});

module.exports = connection;