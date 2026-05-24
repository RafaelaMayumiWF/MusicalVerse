require('dotenv').config({ path: '.env.dev' });
const mysql = require('mysql2');
const c = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER.replace(/^'+|'+$/g, ''),
  password: process.env.DB_PASSWORD.replace(/^'+|'+$/g, ''),
  database: process.env.DB_DATABASE.replace(/^'+|'+$/g, ''),
  port: process.env.DB_PORT,
});

c.connect((err) => {
  if (err) {
    console.error('CONNECT ERR', err);
    process.exit(1);
  }
  c.query('SHOW CREATE TABLE comentario', (err, results) => {
    if (err) {
      console.error('QUERY ERR', err);
      process.exit(1);
    }
    console.log(JSON.stringify(results, null, 2));
    c.end();
  });
});
