// Importação do módulo responsável pela comunicação com o banco de dados
const db = require("../db");

// Definição do controlador de filmes
const MooviesController = {
    // Método assíncrono para encontrar todos os filmes com suas categorias correspondentes
    async findAll(req, res) {
        try {
            // Consulta ao banco de dados para selecionar todos os filmes com detalhes da categoria
            const moovies = await db.query(`
                SELECT 
                    m.*, 
                    c.name AS category_name,
                    c.description AS category_description
                FROM moovie m 
                INNER JOIN category c ON c.id = m.category_id
            `);

            // Responde com os filmes encontrados em formato JSON
            res.json(moovies.rows);
        } catch (error) {
            // Em caso de erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }
    },

    // Método assíncrono para encontrar um filme pelo ID com detalhes da categoria correspondente
    async find(req, res) {
        // Extrai o parâmetro ID da requisição
        const { id } = req.params;

        try {
            // Consulta ao banco de dados para selecionar um filme com detalhes da categoria com base no ID fornecido
            const moovies = await db.query(`
                SELECT 
                    m.*, 
                    c.name AS category_name,
                    c.description AS category_description
                FROM moovie m 
                INNER JOIN category c ON c.id = m.category_id
                WHERE m.id = $1
            `, 
                [id]
            );

            // Verifica se o filme foi encontrado
            if (moovies.rows.length > 0) {
                // Se encontrado, envia os detalhes do filme como resposta
                res.json(moovies.rows[0]);
            } else {
                // Caso contrário, envia uma resposta com status 404 (não encontrado) e uma mensagem de erro
                res.status(404).json({ error: "Filme não encontrado" });
            }
        } catch (error) {
            // Em caso de erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }
    },

    // Método assíncrono para criar um novo filme
    async create(req, res) { 
        // Extrai os dados da requisição
        const { title, description, category_id, realease_date } = req.body;

        // Validação pelo ID de categoria

        try {
            // Consulta ao banco de dados para verificar se a categoria com o ID fornecido existe
            const category = await db.query("SELECT * FROM category WHERE id = $1", [
                category_id,
            ]);

            // Verifica se a categoria existe
            if (category.rows.length === 0) {
                // Se não existir, envia uma resposta com status 404 (não encontrado) e uma mensagem de erro
                res.status(404).json({ error: "Categoria não encontrada" });
                return;
            }
        } catch (error) {
            // Em caso de erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }
        
        try {
            // Insere um novo filme no banco de dados com os dados fornecidos na requisição
            const newMoovie = await db.query(
                `INSERT INTO moovie (title, description, category_id, realease_date) 
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [title, description, category_id, realease_date]
            );

            // Responde com status 201 (criado) e os detalhes do novo filme criado
            res.status(201).json(newMoovie.rows[0]);
        } catch (error) {
            // Em caso de erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }
    },

    // Método assíncrono para atualizar um filme existente
    async update(req, res) { 
        // Extrai os dados da requisição
        const { id, title, description, category_id, realease_date } = req.body;

        // Validação pelo ID de categoria

        try {
            // Consulta ao banco de dados para verificar se a categoria com o ID fornecido existe
            const category = await db.query("SELECT * FROM category WHERE id = $1", [
                category_id,
            ]);

            // Verifica se a categoria existe
            if (category.rows.length === 0) {
                // Se não existir, envia uma resposta com status 404 (não encontrado) e uma mensagem de erro
                res.status(404).json({ error: "Categoria não encontrada" });
                return;
            }
        } catch (error) {
            // Em caso de erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }

        try {
            // Atualiza os dados do filme no banco de dados com base no ID fornecido
            const updatedMoovie = await db.query(
                'UPDATE moovie SET title = $2, description = $3, category_id = $4, realease_date = $5 WHERE id = $1 RETURNING *',
                [id, title, description, category_id, realease_date]
            );

            // Responde com status 200 (OK) e os detalhes do filme atualizado
            res.status(200).json(updatedMoovie.rows[0]);
        } catch (error) {
            // Em caso de erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }
    },

    // Método assíncrono para excluir um filme
    async delete(req, res) {
        // Extrai o parâmetro ID da requisição
        const { id } = req.params; 
    
        try {
            // Remove o filme do banco de dados com base no ID fornecido
            const result = await db.query(
                "DELETE FROM moovie WHERE id = $1 RETURNING *", 
                [id]
            );

            // Verifica se o filme foi removido com sucesso
            if (result.rowCount > 0) {
                // Se removido, responde com status 204 (sem conteúdo)
                res.status(204).json({});
            } else {
                // Caso contrário, responde com status 304 (não modificado)
                res.status(304).json({});
            }
        } catch (error) {
            // Em caso de erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }   
    },
};

// Exporta o controlador de filmes para uso em outros módulos
module.exports = MooviesController;
