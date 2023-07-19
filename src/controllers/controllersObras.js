import pool from "../database/db.js"
import { primeiraLetraMaiuscula, capitalizarEPontuar } from "./controllersGerais.js"


// funções para mostrar (get)
const MostrarTodasobra = async (req, res) => {
    try {
        const obra = await pool.query(` SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obra_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where o.id_obra = 1
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra
      `)
        
        if (obra.length === 0) {
            res.status(200).json({Mensagem: "Não há obra cadastrados.", status:400})
        }

        res.status(200).json(obra.rows)

    } catch (erro) {
        res.status(500).json({Mensagem: erro.Mensagem})
    }
}

const MostrarObraPeloID = async (req, res) => {
    try {
        const Obra = await pool.query(`SELECT
        SELECT o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores, o.descricao, o.link
        FROM obra o
        inner join obra_autores oa on o.id_obra = oa.id_obra
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
    const obra = await pool.query(`
    SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obra_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where o.titulo ILIKE '%' || '${titulo}' || '%'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra
    `);

    if (obra.rows.length === 0) {
      return res.status(200).json({ mensagem: 'Obra(s) não encontrado(s)', status:400 });
    }

    return res.status(200).json(obra.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
  }
}

const MostrarPeloNomeAutor = async (req, res) => {
    const { nome } = req.body;

  try {
    const obra = await pool.query(`
    SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obra_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where au.nome ILIKE '%' || '${nome}' || '%'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra
    `);

    if (obra.rows.length === 0) {
      return res.status(200).json({ mensagem: 'Obra(s) não encontrado(s)', status:400 });
    }

    return res.status(200).json(obra.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
  }
}

const MostrarPeloNomeUsuario = async (req, res) => {
    const { nome } = req.body;

  try {
    const obra = await pool.query(`
    SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obra_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where au.nome ILIKE '%' || '${nome}' || '%'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra
    `);

    if (obra.rows.length === 0) {
      return res.status(200).json({ mensagem: 'Obra(s) não encontrado(s)', status:400 });
    }

    return res.status(200).json(obra.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
  }
}

const MostrarTodasobraCapistrano = async (req, res) => {
    try {
        const obra = await pool.query(`
        SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obra_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where au.nome = 'Capistrano de abreu'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra`)

        if (obra.rows.length === 0) {
            return res.status(200).json({ mensagem: 'Obra(s) não encontrado(s)', status:400 });
          }
      
        return res.status(200).json(obra.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
    }
}

const MostrarTodasobraOutrosAutores = async (req, res) => {
    try {
        const obra = await pool.query(`
        SELECT 
        o.id_obra, o.titulo, o.resumo, au.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obra_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where au.nome != 'Capistrano de abreu'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo
        
        order by o.id_obra`)
    
        if (obra.rows.length === 0) {
            return res.status(200).json({ mensagem: 'Obra(s) não encontrado(s)', status:400 });
          }
      
          return res.status(200).json(obra.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
    }
}

// funções para cadastro (post)
const CadastrarObra = async (req, res) => {
  const {
    titulo, descricao, resumo, link, usuario, autor
  } = req.body;

  const TituloFormatado = primeiraLetraMaiuscula(titulo);
  const descricaoFormatada = primeiraLetraMaiuscula(descricao);
  const resumoFormatado = capitalizarEPontuar(resumo).trim();
  const linkFormatado = link.trim();

  try {
    if (!TituloFormatado || !descricaoFormatada || !resumoFormatado || !linkFormatado || !usuario) {
      return res.status(200).json({ Mensagem: 'Há campo(s) vazio(s).', status: 400 });
    }

    // Verifica se os autores existem
    const lista_autores_id = [];
    for (let i = 0; i < autor.length; i++) {
      const autor_nome = autor[i];
      const AutorFormatada = primeiraLetraMaiuscula(autor_nome);
      const verificaAutor = await pool.query(
        'SELECT id_autor FROM autor WHERE nome = $1',
        [AutorFormatada]
      );

      if (verificaAutor.rowCount === 0) {
        return res.status(200).json({ Mensagem: `O autor "${AutorFormatada}" não foi encontrado.`, status: 400 });
      }

      lista_autores_id.push(verificaAutor.rows[0].id_autor);
    }

    // Inicia uma transação
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insere a obra
      const CadastroObra = await client.query(
        `INSERT INTO obra (
          id_usuario,
          titulo,
          link,
          resumo,
          descricao
        ) VALUES ($1, $2, $3, $4, $5) RETURNING id_obra`,
        [
          usuario,
          TituloFormatado,
          linkFormatado,
          resumoFormatado,
          descricaoFormatada
        ]
      );

      const id_obra = CadastroObra.rows[0].id_obra;

      // Relaciona na tabela autor
      for (const autor_id of lista_autores_id) {
        await client.query(
          'INSERT INTO obra_autores (id_obra, id_autor) VALUES ($1, $2)',
          [id_obra, autor_id]
        );
      }

      // Finaliza a transação
      await client.query('COMMIT');

      return res.status(200).json({ Mensagem: 'Obra cadastrada com sucesso.' });
    } catch (error) {
      // Desfaz a transação em caso de erro
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Libera o cliente
      client.release();
    }
  } catch (error) {
    return res.status(500).json({ Mensagem: 'Ocorreu um erro interno no servidor.' });
  }
};

// funções para excluir (delete)
const ExcluirObra = async (req, res) => {
  try {
    const {id_obra} = req

    if (!id_obra) {
        return res.status(200).json({Mensagem: 'Id não informado.', status:400})
    }

    
    // excluindo relacionamento obra
    await pool.query(`DELETE FROM obra_autores WHERE id_obra = ${id_obra}`)

    await pool.query(`DELETE FROM obra WHERE id_obra = ${id_obra}`)
    


    return res.status(200).json({Mensagem: "Obra excluida com sucesso."})
  } catch (error) {
    return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
  }

}

const EditarObra = async (req, res) => {
  try {
    const { id_obra } = req.params;
    const { titulo, link, usuario, resumo, descricao } = req.body;

    if (!titulo && !link && !resumo && !descricao) {
      return res.status(200).json({ Mensagem: 'Altere pelo menos um campo.', status: 400 });
    }

    const TituloFormatado = primeiraLetraMaiuscula(titulo)
    const linkFormatado = link.trim()
    const resumoFormatado = capitalizarEPontuar(resumo)
    const descricaoFormatada = primeiraLetraMaiuscula(descricaoFormatada)

    let usuario_id;
    const list_usuario_id = [];

    for (let i = 0; i < usuario.length; i++) {
      const usuario_nome = usuario[i];
      const usuarioFormatada = primeiraLetraMaiuscula(usuario_nome);
      const verificaUsuario = await pool.query(
        'SELECT id_usuario FROM usuario WHERE nome = $1',
        [usuarioFormatada]
      );
      usuario_id = verificaUsuario.rows[0].id_usuario;
    list_usuario_id.push(usuario_id);
    }


    if (TituloFormatado) {
      await client.query(
        'UPDATE obra SET titulo = $1 where id_obra = $2',
        [
          TituloFormatado,
          id_obra
        ]
      );
    }

    if (linkFormatado) {
      await client.query(
        'UPDATE obra SET linke = $1 where id_obra = $2',
        [
          linkFormatado,
          id_obra
        ]
      );
    }

    if (resumoFormatado) {
      await client.query(
        'UPDATE obra SET resumo = $1 where id_obra = $2',
        [
          resumoFormatado,
          id_obra
        ]
      );
    }

    if (descricaoFormatada) {
      await client.query(
        'UPDATE obra SET descricao = $1 where id_obra = $2',
        [
          descricaoFormatada,
          id_obra
        ]
      );
    }

    if (TituloFormatado) {
      await pool.query(
        'UPDATE obra SET titulo = $1 where id_obra = $2',
        [
          TituloFormatado,
          id_obra
        ]
      );
    }

    if (list_usuario_id.length > 0) {
      const IdUsuarios = await pool.query(`Select usuario_id from obra where id_obra = $1`, [
        id_obra
      ])

      
    }

        // Atualiza o usuario_id na tabela obra
        await pool.query('UPDATE obra SET id_usuario = $1 WHERE id_obra = $2', [
          usuario_id,
          id_obra
        ]);
      
    return res.status(200).json({ Mensagem: 'Obra atualizada com sucesso.' });
  } catch (erro) {
    return res.status(500).json({ Mensagem: 'Ocorreu um erro interno no servidor.' });
  }  
}


export {
  MostrarObraPeloID, MostrarPeloNomeAutor, MostrarPeloNomeObra, 
  MostrarPeloNomeUsuario, MostrarTodasobra, MostrarTodasobraCapistrano,
  MostrarTodasobraOutrosAutores, CadastrarObra, ExcluirObra
}
