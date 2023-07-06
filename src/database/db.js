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
      -- Criação da tabela "administrador"
        CREATE TABLE IF NOT EXISTS administrador (
        id_administrador INT PRIMARY KEY,
        id_usuario INT,
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        );

        -- Criação da tabela "autor"
        CREATE TABLE IF NOT EXISTS autor (
        id_autor INT PRIMARY KEY,
        nome VARCHAR(255)
        );

        -- Criação da tabela "obra"
        CREATE TABLE IF NOT EXISTS obra (
        id_obra INT PRIMARY KEY,
        titulo VARCHAR(255),
        link VARCHAR(255),
        resumo TEXT,
        descricao TEXT
        );

        -- Criação da tabela "obras_autores"
        CREATE TABLE IF NOT EXISTS obras_autores (
        id_obra INT,
        id_autor INT,
        FOREIGN KEY (id_obra) REFERENCES obra(id_obra),
        FOREIGN KEY (id_autor) REFERENCES autor(id_autor)
        );

        -- Criação da tabela "usuario"
        CREATE TABLE IF NOT EXISTS usuario (
        id_usuario INT PRIMARY KEY,
        nome VARCHAR(255),
        img_usuario VARCHAR(255)
        );

        -- Criação da tabela "usuario_obra"
        CREATE TABLE IF NOT EXISTS usuario_obra (
        id_obra INT,
        id_usuario INT,
        FOREIGN KEY (id_obra) REFERENCES obra(id_obra),
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
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
