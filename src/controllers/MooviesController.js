// Importação do módulo responsável pela comunicação com o banco de dados
const db = require("../db");

// Definição do controlador de categorias
const CategoryController = {
    // Método assíncrono para encontrar todas as categorias
    async findAll(req, res) {
        try {
            // Consulta ao banco de dados para selecionar todas as categorias
            const category = await db.query("SELECT * FROM category");
            // Envio das categorias encontradas como resposta em formato JSON
            res.json(category.rows);
        } catch (error) {
            // Caso ocorra um erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }
    },

    // Método assíncrono para encontrar uma categoria pelo ID
    async find(req, res) {
        // Extrai o parâmetro ID da requisição
        const { id } = req.params;

        try {
            // Consulta ao banco de dados para selecionar uma categoria com base no ID fornecido
            const category = await db.query("SELECT * FROM category WHERE id = $1", [
                id,
            ]);

            // Verifica se a categoria foi encontrada
            if (category.rows.length > 0) {
                // Se encontrada, envia os detalhes da categoria como resposta
                res.json(category.rows[0]);
            } else {
                // Caso contrário, envia uma resposta com status 404 (não encontrado) e uma mensagem de erro
                res.status(404).json({ error: "Categoria não encontrada" });
            }
        } catch (error) {
            // Em caso de erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }
    },
    
    // Método assíncrono para criar uma nova categoria
    async create(req, res) { 
        // Extrai os dados da requisição
        const { name, description } = req.body;
       
        try {
            // Insere uma nova categoria no banco de dados com os dados fornecidos na requisição
            const newCategory = await db.query(
                'INSERT INTO category (name, description) VALUES ($1, $2) RETURNING *',
                [name, description]
            );

            // Responde com status 201 (criado) e os detalhes da nova categoria criada
            res.status(201).json(newCategory.rows[0]);
        } catch (error) {
            // Em caso de erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }
    },

    // Método assíncrono para atualizar uma categoria existente
    async update(req, res) { 
        // Extrai os dados da requisição
        const { id, name, description } = req.body;
       
        try {
            // Atualiza os dados da categoria no banco de dados com base no ID fornecido
            const updatedCategory = await db.query(
                'UPDATE category SET name = $2, description = $3 WHERE id = $1 RETURNING *',
                [id, name, description]
            );

            // Responde com status 200 (OK) e os detalhes da categoria atualizada
            res.status(200).json(updatedCategory.rows[0]);
        } catch (error) {
            // Em caso de erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }
    },

    // Método assíncrono para excluir uma categoria
    async delete(req, res) {
        // Extrai o parâmetro ID da requisição
        const { id } = req.params; 

        try {
            // Remove a categoria do banco de dados com base no ID fornecido
            const result = await db.query(
                "DELETE FROM category WHERE id = $1 RETURNING *", 
                [id]
            );

            // Verifica se a categoria foi removida com sucesso
            if (result.rowCount > 0) {
                // Se removida, responde com status 204 (sem conteúdo)
                res.status(204).json({})
            }

            // Caso contrário, responde com status 304 (não modificado)
            res.status(304).json({});  
        } catch (error) {
            // Em caso de erro, envia uma resposta com status 500 (erro interno do servidor) e detalhes do erro
            res.status(500).json({ error: error.message });
        }  
    },
};

// Exporta o controlador de categorias para uso em outros módulos
module.exports = CategoryController;
