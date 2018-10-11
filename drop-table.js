const { Client } = require('pg');

// const user = process.env.PGUSER || '<pg-user>';
// const host = process.env.PGHOST || '<pg-host>';
// const database = process.env.PGPASSWORD || '<pg-password>';
// const password = process.env.PGDATABASE || '<pg-database>';
// const port = process.env.PGPORT || '<pg-port>';

// if ((!user || user === '<pg-user>') ||
//     (!host || host === '<pg-host>') ||
//     (!database || database === '<pg-database>') ||
//     (!port || port === '<pg-port>')) {
//   return 'No se configuraron correctamente las credenciales de postgres.'
// }

// const posgresCredentials = {
//   user: user,
//   host: host,
//   database: database,
//   password: password,
//   port: port
// }

// const client = new Client(posgresCredentials)


const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ilab',
  password: '',
  port: 5432
})

client.connect()

const tableName = 'licencias_laborales'
const text = `DROP TABLE IF EXISTS ${tableName}`
// callback
client.query(text, (err, res) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`Ya no tiene la tabla ${tableName} en su base de datos`)
  }
  client.end()  
})
