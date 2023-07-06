import pool from "../database/db"

// funções para mostrar (get)
const MostrarTodasObras = async (req, res) => {
    try {
        const Obras = await pool.query(` SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario_obra ua on oa.id_obra = o.id_obra
        inner join usuario u on u.id_usuario = ua.id_usuario
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
        inner join usuario_obra ua on oa.id_obra = o.id_obra
        inner join usuario u on u.id_usuario = ua.id_usuario
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
        inner join usuario_obra ua on oa.id_obra = o.id_obra
        inner join usuario u on u.id_usuario = ua.id_usuario
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
        inner join usuario_obra ua on oa.id_obra = o.id_obra
        inner join usuario u on u.id_usuario = ua.id_usuario
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
        inner join usuario_obra ua on oa.id_obra = o.id_obra
        inner join usuario u on u.id_usuario = ua.id_usuario
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
        inner join usuario_obra ua on oa.id_obra = o.id_obra
        inner join usuario u on u.id_usuario = ua.id_usuario
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
        inner join usuario_obra ua on oa.id_obra = o.id_obra
        inner join usuario u on u.id_usuario = ua.id_usuario
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





