import joi from "joi"

// Schema para criar um novo aluguel
export const createRentalSchema = joi.object({
    customerId: joi.number().integer().required(),
    gameId: joi.number().integer().required(),
    daysRented: joi.number().integer().min(1).required(),
  });
  
  // Schema para finalizar um aluguel
  export const returnRentalSchema = joi.object({
    returnDate: joi.date().iso().required(),
    delayFee: joi.number().integer().min(0).required(),
  });


