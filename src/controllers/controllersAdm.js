import pool from "../database/db.js"
import { primeiraLetraMaiuscula } from "./controllersGerais.js";


const MostrarTodosAdministradores = async (req, res) => {
    try {
        const administradores = await pool.query(`SELECT u.id_usuario, u.nome 
        FROM usuario u 
        inner join administrador a on a.id_usuario = u.id_usuario `);

    if (administradores.rows.length === 0) {
      return res.status(200).json({ mensagem: "Não há administradores cadastrados.", status: 400 });
    }

    res.status(200).json(usuarios.rows);
    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
}

const MostrarAdministradorID = async (req, res) => {
    try {
        const administrador = await pool.query(`SELECT
        u.id_usuario, u.nome, u.senha
      FROM
        usuario u
      inner join administrador a on
      
      u.id_usuario = a.id_usuario and a.id_usuario =${req.params.id};`)
          
          return res.status(200).json(administrador.rows[0])
    } catch (erro){
        return res.status(500).json({Mensagem: erro.Mensagem})
    }
}

const CadastrarAdministrador = async (req, res) => {
    try {
        const { 
            nome
        } = req.body

        if (!nome) {
            return res.status(200).json({Mensagem: "Há campo(s) vazio(s).", status:400})
        }
        const nomeFormatado = primeiraLetraMaiuscula(nome)

        let administrador_id;
        const verificaAdministrador = await pool.query(
      'SELECT id_usuario FROM usuario WHERE nome = $1',
      [nomeFormatado]
    );
    administrador_id = verificaAdministrador.rows[0].usuario_id;
    
    await pool.query(`INSERT INTO administrador (id_usuario) VALUES ($1)`,
    [administrador_id])

    return res.status(200).json({ Mensagem: 'Administrador cadastrado com sucesso.' });
    } catch (erro){
        res.status(500).json({Mensagem: erro.Mensagem})
    }
}

const RemoveAdministrados = async (req, res) => {
    try {
        const {id_administrador} = req.params

        await pool.query(
            'Delete from administrador where id_administrador = $1',
            [id_administrador]
          );

    return res.status(200).json({Mensagem: "Administrador excluído com sucesso."})
    }

    catch (erro){
        res.status(500).json({Mensagem: erro.Mensagem})
    }
}

export {
    CadastrarAdministrador, MostrarTodosAdministradores, MostrarAdministradorID, RemoveAdministrados
}