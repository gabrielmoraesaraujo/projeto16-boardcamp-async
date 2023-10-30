import { Router } from 'express';
import { getGames, createGame } from '../Controllers/controller.games.js';
import { validateSchema } from '../Middlewares/vlidateSchema.js';
import { gameSchema } from '../Schemas/gamesSchema.js';
import { customerSchema } from '../Schemas/customerSchema.js';
import { rentalsSchema} from '../Schemas/createRentalSchema.js'


const boardRouter = Router()


// Rota para criar um novo jogo
boardRouter.post('/games', validateSchema(gameSchema), createGame);

// Rota para obter todos os jogos
boardRouter.get('/games', getGames);

// Rota para criar usuario
boardRouter.post('/customer', validateSchema(customerSchema), createCustomer)

// Rota para obter os clientes
boardRouter.get('/customers', getCustomerById)

// Rota para modificar um usuario
boardRouter.put('/customer', validateSchema(customerSchema), updateCustomer)

// Criar um novo aluguel
boardRouter.post('/rentals', validateSchema(rentalsSchema), rentalController.createRental);

// Listar todos os aluguéis
boardRouter.get('/rentals', rentalController.listRentals);

// Finalizar um aluguel
boardRouter.post('/rentals:id/return', validateSchema(rentalsSchema), rentalController.returnRental);

// Excluir um aluguel
boardRouter.delete('/rentals:id', rentalController.deleteRental);



export default boardRouter
