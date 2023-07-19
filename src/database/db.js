import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    // connectionString: "postgres://default:sS0nQhp8gBfN@ep-still-field-699624.us-east-1.postgres.vercel-storage.com:5432/verceldb"
    
        user: "postgres",
        password: "anderson*01072006",
        host: "localhost",
        port: 5432,
        database: "repositorio-capistrano"
    
  });

const createTables = async () => {
    try {
      const client = await pool.connect();
      await client.query(`
      
        CREATE TABLE IF NOT EXISTS obra (
          id_obra SERIAL PRIMARY KEY,
          id_usuario INTEGER REFERENCES usuario(id_usuario),
          titulo VARCHAR(255),
          link VARCHAR(255),
          resumo TEXT,
          descricao TEXT
        );
        
        
        CREATE TABLE IF NOT EXISTS usuario (
          id_usuario SERIAL PRIMARY KEY,
          nome VARCHAR(255),
          senha VARCHAR(255)
        );


      CREATE TABLE IF NOT EXISTS administrador (
        id_administrador SERIAL PRIMARY KEY,
        id_usuario SERIAL REFERENCES usuario(id_usuario)
      );
  
      CREATE TABLE IF NOT EXISTS autor (
        id_autor SERIAL PRIMARY KEY,
        nome VARCHAR(255)
      );


      CREATE TABLE IF NOT EXISTS obras_autores (
        id_obra SERIAL REFERENCES obra(id_obra),
        id_autor SERIAL REFERENCES autor(id_autor)
      );


      `);
      client.release();
      console.log('Tabelas e campos criados com sucesso!');
    } catch (error) {
      console.error('Erro ao criar tabelas e campos:', error);
    }
  };
  
  createTables();

export default pool 
