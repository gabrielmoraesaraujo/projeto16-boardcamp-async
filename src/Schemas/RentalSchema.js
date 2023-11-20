import joi from "joi"

// Schema para criar um novo aluguel
export const createRentalSchema = joi.object({
    customerId: joi.number().integer().required(),
    gameId: joi.number().integer().required(),
    daysRented: joi.number().integer().min(1).required(),
  });



