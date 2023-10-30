import db from '../Database/Database.Conection.js';

// Criar um novo jogo
export async function createGame (req, res){

  try {
    const { name, image, stockTotal, pricePerDay } = req.body;

    const checkGameQuery = 'SELECT * FROM games WHERE name = $1';
    const checkGameValues = [name];
    const existingGame = await db.query(checkGameQuery, checkGameValues);

    if (existingGame.rows.length > 0) {
      return res.status(409).send({ error: 'Jogo já existe' });
    }

    // Verificar se stockTotal e pricePerDay são maiores que 0
    if (stockTotal <= 0 || pricePerDay <= 0) {
      return res.status(400).send({ error: 'stockTotal e pricePerDay devem ser maiores que 0' });

    }

    // Inserir o novo jogo no banco de dados
    const result = await db.query('INSERT INTO games (name, image, stockTotal, pricePerDay) VALUES ($1, $2, $3, $4)', [name, image, stockTotal, pricePerDay]);

    // Retornar status 201 (Created) sem dados adicionais
    res.status(201).send(result);
  } catch(err){
    res.status(500).send(err.message);
    console.log(err)


 }
}


// Obter todos os jogos
export async function getGames (req, res)  {

  try {
    // Consultar todos os jogos no banco de dados
    const result = await db.query('SELECT * FROM games');

    // Retornar a lista de jogos
    const games = result.rows;
    res.status(200).send(games);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
