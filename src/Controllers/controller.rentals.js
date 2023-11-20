import dayjs from "dayjs"
import { db } from "../database/database.connection.js"

export async function getRentals(req, res) {
    try {

        const result = await db.query(`
            SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName" FROM rentals
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id;
        `);

       const rentals = result.rows.map( rental => {
            const obj = {
                ...rental,
                rentDate: dayjs(rental.rentDate).format('YYYY-MM-DD'),
                customer:{
                    id:rental.customerId,
                    name: rental.customerName
                },
                game:{
                    id:rental.gameId,
                    name:rental.gameName
                }
            }

            delete obj.customerName;
            delete obj.gameName;
            
            return obj;

       });
       
       res.send(rentals);

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createRental(req, res) {

    const { customerId, gameId, daysRented } = req.body;

    try {

        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);

        if( customer.rowCount === 0 )
            return res.status(400).send({message:"Cliente não cadastrado!"});

        const game = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
        
        if ( game.rowCount === 0)
            return res.status(400).send({message:"Jogo não cadastrado!"});

        // pegar a quantidade de alugues que já existe desse jogo
        const resultRentals = await db.query(
            `SELECT rentals.*, games."pricePerDay"
                FROM rentals 
                JOIN games ON rentals."gameId" = games.id
                WHERE "gameId" = $1 AND "returnDate" IS NULL;
            `, [gameId]);

        const rentalsTot = resultRentals.rowCount;

        console.log(game.rows[0].stockTotal, rentalsTot);

        //  stockTotal - totAluguel > 0
        if ( game.rows[0].stockTotal - rentalsTot <= 0 )
            return res.status(400).send({message:'Jogo indisponivel para locação'});

        const originalPrice = daysRented * game.rows[0].pricePerDay;

        await db.query(`
            INSERT INTO rentals( "customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee" )
             VALUES($1, $2, $3, $4, $5, NULL, NULL)
        `, [customerId, gameId, daysRented, dayjs().format("YYYY-MM-DD"), originalPrice]);

        res.sendStatus(201);
        
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function finishRental(req, res) {

    const { id } = req.params;

    let delayFree = null;

    try {

        const result = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);

        if ( result.rowCount === 0)
            return res.status(404).send({message:'Registro de alguel de jogo não encontrado'});
        
        const rental = result.rows[0];

        if ( rental.returnDate !== null)
            return res.status(400).send({message:'Jogo já foi devolvido'});
        
        const rentDate = dayjs(rental.rendDate).format('YYYY-MM-DD');
        const difference = dayjs().diff(rentDate, "days");
        if ( difference > rental.daysRented){
            delayFree = (rental.originalPrice / rental.daysRented) * (difference - rental.daysRented)
        }

        await db.query(`
            UPDATE rentals SET returnDate = $1, delayFee = $2 WHERE id = $3;
        `, [dayjs().format('YYYY-MM-DD'), delayFree, id]);

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteRental(req, res) {

    const { id } = res.params;

    try {
    
        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
        if ( rental.rowCount === 0)
            return res.status(404).send({message:'Registro não encontrado!'});

        if ( rental.rows[0].returnDate !== null)
            return res.status(400).send({message:'Registro não pode ser excluido'});

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [id]);

        res.sendStatus(200);
        

    } catch (err) {
        res.status(500).send(err.message)
    }
} 