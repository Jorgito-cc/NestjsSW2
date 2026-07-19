const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:KIJnCifGRdpqNxKxXUDfjKQdaSMQNrBR@tokaido.proxy.rlwy.net:11448/railway',
});
client.connect()
  .then(async () => {
    console.log('CONNECTED TO TOKAIDO SUCCESSFUL!');
    
    const tables = ['usuarios', 'ofertas', 'postulaciones', 'candidatos', 'empresas', 'reclutadores'];
    for (const table of tables) {
      try {
        const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`Table ${table} row count:`, res.rows[0].count);
      } catch (err) {
        console.log(`Table ${table} error:`, err.message);
      }
    }
    
    // Check reclutadores in ofertas table
    try {
      const res = await client.query('SELECT reclutador_id, COUNT(*) as count FROM ofertas GROUP BY reclutador_id');
      console.log('Offers by Reclutador ID:', res.rows);
      
      const reclutador1 = await client.query('SELECT id, email, nombre, apellido, rol FROM usuarios WHERE email = \'reclutador1@agencia.bo\'');
      console.log('Reclutador 1 User:', reclutador1.rows);
    } catch (err) {
      console.log('Queries error:', err.message);
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('CONNECTION ERROR:', err);
    process.exit(1);
  });
