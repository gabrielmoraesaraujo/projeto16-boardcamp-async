import joi from "joi"

// Schema para finalizar um aluguel
export const returnRentalSchema = joi.object({
    returnDate: joi.date().iso().required(),
    delayFee: joi.number().integer().min(0).required(),
  });