import joi from "joi"

export const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().regex(/^\d{10,11}$/).required(),
  cpf: joi.string().length(11).required(),
  birthday: joi.date().iso().required(),
});



