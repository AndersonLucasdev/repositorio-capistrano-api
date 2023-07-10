import pool from "../database/db.js"
import { primeiraLetraMaiuscula, capitalizarEPontuar } from "./controllersGerais.js"


// funções para mostrar (get)
const MostrarTodasObras = async (req, res) => {
    try {
        const Obras = await pool.query(` SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where o.id_obra = 1
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra
      `)
        
        if (Obras.length === 0) {
            res.status(200).json({Mensagem: "Não há obras cadastrados.", status:400})
        }

        res.status(200).json(Obras.rows)

    } catch (erro) {
        res.status(500).json({Mensagem: erro.Mensagem})
    }
}

const MostrarObraPeloID = async (req, res) => {
    try {
        const Obra = await pool.query(`SELECT
        SELECT o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores, o.descricao, o.link
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where o.id_obra = ${req.params.id};`)

        res.status(200).json(Obra.rows[0])    
    }

    catch (erro){
        return res.status(500).json({Message: erro.Message})
    }
}

const MostrarPeloNomeObra = async (req, res) => {
  const { titulo } = req.body;

  try {
    const Obras = await pool.query(`
    SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where o.titulo ILIKE '%' || '${titulo}' || '%'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra
    `);

    if (Obras.rows.length === 0) {
      return res.status(200).json({ mensagem: 'Obra(s) não encontrado(s)', status:400 });
    }

    return res.status(200).json(Obras.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
  }
}

const MostrarPeloNomeAutor = async (req, res) => {
    const { nome } = req.body;

  try {
    const Obras = await pool.query(`
    SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where au.nome ILIKE '%' || '${nome}' || '%'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra
    `);

    if (Obras.rows.length === 0) {
      return res.status(200).json({ mensagem: 'Obra(s) não encontrado(s)', status:400 });
    }

    return res.status(200).json(Obras.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
  }
}

const MostrarPeloNomeUsuario = async (req, res) => {
    const { nome } = req.body;

  try {
    const Obras = await pool.query(`
    SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where au.nome ILIKE '%' || '${nome}' || '%'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra
    `);

    if (Obras.rows.length === 0) {
      return res.status(200).json({ mensagem: 'Obra(s) não encontrado(s)', status:400 });
    }

    return res.status(200).json(Obras.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
  }
}

const MostrarTodasObrasCapistrano = async (req, res) => {
    try {
        const Obras = await pool.query(`
        SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where au.nome = 'Capistrano de abreu'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra`)

        if (Obras.rows.length === 0) {
            return res.status(200).json({ mensagem: 'Obra(s) não encontrado(s)', status:400 });
          }
      
        return res.status(200).json(Obras.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
    }
}

const MostrarTodasObrasOutrosAutores = async (req, res) => {
    try {
        const Obras = await pool.query(`
        SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where au.nome != 'Capistrano de abreu'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra`)
    
        if (Obras.rows.length === 0) {
            return res.status(200).json({ mensagem: 'Obra(s) não encontrado(s)', status:400 });
          }
      
          return res.status(200).json(Obras.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
    }
}

// funções para cadastro (post)
const CadastrarObra = async (req, res) => {
  const {
    titulo, descricao, resumo, link, id_usuario, autor
  } = req.body

  const TituloFormatado = primeiraLetraMaiuscula(titulo);
  const descricaoFormatada = primeiraLetraMaiuscula(descricao);
  const resumoFormatado = capitalizarEPontuar(resumo).trim()
  const linkFormatado = link.trim()

  try {
    if (!TituloFormatado || !descricaoFormatada || !resumoFormatado || !linkFormatado || !id_usuario) {
      return res.status(200).json({ Mensagem: 'Há campo(s) vazio(s).', status: 400 });
    }

    // Verifica autores
    let autores_id;
    const lista_autores_id = [];

    for (let i = 0; i < autor.length; i++) {
      const autor_nome = autor[i];
      const AutorFormatada = primeiraLetraMaiuscula(autor_nome);
      const verificaAutor = await pool.query(
        'SELECT id_autor FROM autor WHERE nome = $1',
        [AutorFormatada]
      );
      autores_id = verificaAutor.rows[0].id_autor;
      lista_autores_id.push(autores_id);  
    }

    const CadastroObra = await pool.query(
      `INSERT INTO obra (
        id_usuario,
        titulo,
        link,
        resumo,
        descricao
      ) VALUES ($1, $2, $3, $4, $5) RETURNING id_obra`,
      [
        id_usuario,
        TituloFormatado,
        linkFormatado,
        resumoFormatado,
        descricaoFormatada
      ]
    );

    const id_obra = CadastroObra.rows[0].id_obra;

    // relacionando na tabela autor
    for (const autor_id of lista_autores_id) {
      await pool.query(
        'INSERT INTO obras_autores (id_obra, id_autor) VALUES ($1, $2)',
        [id_obra, autor_id]
      );
    }

    return res.status(200).json({ Mensagem: 'Obra cadastrado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
  }
}

// funções para excluir (delete)
const ExcluirObra = async (req, res) => {
  try {
    const {obra_id} = req

    if (!obra_id) {
        return res.status(200).json({Mensagem: 'Id não informado.', status:400})
    }

    
    // excluindo relacionamento obras
    await pool.query(`DELETE FROM obras_autores WHERE obra_id = ${obra_id}`)

    await pool.query(`DELETE FROM obra WHERE obra_id = ${obra_id}`)
    


    return res.status(200).json({Mensagem: "Obra excluida com sucesso."})
  } catch (error) {
    return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
  }

}


export {
  MostrarObraPeloID, MostrarPeloNomeAutor, MostrarPeloNomeObra, 
  MostrarPeloNomeUsuario, MostrarTodasObras, MostrarTodasObrasCapistrano,
  MostrarTodasObrasOutrosAutores, CadastrarObra, ExcluirObra
}
