const { Client } = require('pg');

// const user = process.env.PGUSER || '<pg-user>';
// console.log(user);
// const host = process.env.PGHOST || '<pg-host>';
// const database = process.env.PGPASSWORD || '<pg-password>';
// const port = process.env.PGPORT || '<pg-port>';

// if ((!user || user === '<pg-user>') ||
//     (!host || host === '<pg-host>') ||
//     (!database || database === '<pg-database>') ||
//     (!port || port === '<pg-port>')) {
//   console.log('No se configuraron correctamente las credenciales de postgres.');
//   return ;
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
const text = `CREATE TABLE ${tableName}(codigoConfirmacion SERIAL PRIMARY KEY, name VARCHAR(90) NOT NULL, fechaInicio date NOT NULL, fechaFin date NOT NULL, cedulaIdentidad VARCHAR(15))`

// callback
client.query(text, (err, res) => {
  if (err) {
    if (err.message == `relation "${tableName}" already exists`){
      console.log(`La tabla ${tableName} ya existe, para eliminarla corra yarn db-drop`)
    }
  } else {
    console.log(`La tabla ${tableName} ha sido creada con exito.`)
  }
  client.end()  
})
