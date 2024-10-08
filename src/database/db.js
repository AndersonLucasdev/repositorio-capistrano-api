import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString:
  "postgres://default:F7DlrNAa9zKP@ep-icy-grass-a4xgnecc.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
  // "postgres://default:1nXJPu7fHoBO@ep-divine-breeze-84064744.us-east-1.postgres.vercel-storage.com:5432/verceldb",
  ssl: {
    rejectUnauthorized: false,
    sslmode: "require",
  },
});

const createTables = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
    CREATE TABLE IF NOT EXISTS usuario (
      id_usuario SERIAL PRIMARY KEY,
      nome VARCHAR(255),
      senha VARCHAR(255)
    );
    
    CREATE TABLE IF NOT EXISTS autor (
      id_autor SERIAL PRIMARY KEY,
      nome VARCHAR(255)
    );
    
    CREATE TABLE IF NOT EXISTS link (
      id_link SERIAL PRIMARY KEY,
      link TEXT
    );

    CREATE TABLE IF NOT EXISTS img (
      id_img SERIAL PRIMARY KEY,
      link TEXT
    );

    CREATE TABLE IF NOT EXISTS assunto (
      id_assunto SERIAL PRIMARY KEY,
      nome VARCHAR(255)
    );
    
    CREATE TABLE IF NOT EXISTS administrador (
      id_administrador SERIAL PRIMARY KEY,
      id_usuario INTEGER REFERENCES usuario(id_usuario)
    );
    
    CREATE TABLE IF NOT EXISTS obra (
      id_obra SERIAL PRIMARY KEY,
      id_usuario INTEGER REFERENCES usuario(id_usuario),
      titulo VARCHAR(255),
      resumo TEXT,
      descricao TEXT,
      data_publi VARCHAR(255),
      data_criacao VARCHAR(255)
    );
    
    CREATE TABLE IF NOT EXISTS obras_links (
      id_obra SERIAL REFERENCES obra(id_obra),
      id_link SERIAL REFERENCES link(id_link),
      PRIMARY KEY (id_obra, id_link)
    );

    CREATE TABLE IF NOT EXISTS obras_assuntos (
      id_assunto SERIAL REFERENCES assunto(id_assunto),
      id_obra SERIAL REFERENCES obra(id_obra),
      PRIMARY KEY (id_obra, id_assunto)
    );
    
    CREATE TABLE IF NOT EXISTS obras_autores (
      id_obra SERIAL REFERENCES obra(id_obra),
      id_autor SERIAL REFERENCES autor(id_autor),
      PRIMARY KEY (id_obra, id_autor)
    );
    
    CREATE TABLE IF NOT EXISTS obras_imgs (
      id_obra INTEGER REFERENCES obra(id_obra),
      id_img INTEGER REFERENCES img(id_img),
      PRIMARY KEY (id_obra, id_img)
    );
    
    CREATE TABLE IF NOT EXISTS homenagem (
      id_homenagem SERIAL PRIMARY KEY,
      id_usuario INTEGER REFERENCES usuario(id_usuario),
      titulo VARCHAR(255),
      resumo TEXT,
      descricao TEXT,
      data_publi VARCHAR(255),
      data_criacao VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS homenageado (
      id_homenageado SERIAL PRIMARY KEY,
      nome VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS homenagens_homenageados (
      id_homenagem SERIAL REFERENCES homenagem(id_homenagem),
      id_homenageado SERIAL REFERENCES homenageado(id_homenageado),
      PRIMARY KEY (id_homenagem, id_homenageado)
    );

    CREATE TABLE IF NOT EXISTS homenagens_assuntos (
      id_assunto INTEGER REFERENCES assunto(id_assunto),
      id_homenagem INTEGER REFERENCES homenagem(id_homenagem),
      PRIMARY KEY (id_homenagem, id_assunto)
    );

    CREATE TABLE IF NOT EXISTS homenagens_links (
      id_homenagem INTEGER REFERENCES homenagem(id_homenagem),
      id_link INTEGER REFERENCES link(id_link),
      PRIMARY KEY (id_homenagem, id_link)
    );

    CREATE TABLE IF NOT EXISTS homenagens_imgs (
      id_homenagem INTEGER REFERENCES homenagem(id_homenagem),
      id_img INTEGER REFERENCES img(id_img),
      PRIMARY KEY (id_homenagem, id_img)
    );
    
  

    `);
    client.release();
    console.log("Tabelas e campos criados com sucesso!");
  } catch (error) {
    console.error("Erro ao criar tabelas e campos:", error);
  }
};

//   CREATE TABLE IF NOT EXISTS registros_acesso (
  //     id_registros_acesso SERIAL PRIMARY KEY,
  //     endereco_ip VARCHAR(15) NOT NULL,
  //     horario_de_entrada TIMESTAMPTZ NOT NULL
  // );
    
  //   CREATE TABLE IF NOT EXISTS visualizacoes_pagina (
  //     id_visualizacoes_pagina SERIAL PRIMARY KEY,
  //     url_da_pagina TEXT NOT NULL,
  //     id_registro_de_acesso INT REFERENCES registros_de_acesso(id_registros_acesso) NOT NULL,
  //     horario_de_visualizacao TIMESTAMPTZ NOT NULL
  // );

createTables();

export default pool;
