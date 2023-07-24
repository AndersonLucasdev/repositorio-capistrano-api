import pool from "../database/db.js";
import { primeiraLetraMaiuscula } from "./controllersGerais.js";

const MostrarTodosAutores = async (req, res) => {
  try {
    const Autores = await pool.query(`
    SELECT 
    *
    FROM autor
    
    order by id_autor
        `);

    if (Autores.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Obra(s) não encontrado(s)", status: 400 });
    }
    return res.status(200).json(Autores.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarAutorID = async (req, res) => {
    try {
        const autor = await pool.query(`SELECT 
        *
        FROM autor
        where id_autor =  ${req.params.id}
        `)

        res.status(200).json(autor.rows[0])    
    } catch (erro){
        return res.status(500).json({Message: erro.Message})
    }
}

const CadastrarAutor = async (req, res) => {
    try {
        const {nome} = req.body

        
    } catch (erro){

    }
}