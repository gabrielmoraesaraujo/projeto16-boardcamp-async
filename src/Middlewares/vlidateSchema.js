export function validateSchema (schema) {

    return (req, res, next) => {

        const validation = schema.validate(req.body, { abortEarly: false })
        if (validation.error) {
            const errors = validation.error.details.map(detail => detail.message)
            return res.status(422).send(errors)        
        }

        next()
    }
   
  }


export function validateCustomer (schema){
    return(req, res, next) => {

        const validation = schema.validate(req.body, { abortEarly: false});
        if (validation) {
           const errors = validation.error.details.map(detail => detail.message)
                  return res.status(400).send(errors)  
        }
        next()
    }

}

// Middleware para validar os dados ao criar um aluguel
export function validateCreateRental (schema) {
    return(req, res, next) => {

        const validation = schema.validate(req.body, { abortEarly: false});
  
    if (validation) {
      return res.status(400).send({ message: validation.error.details[0].message });
    }
  
    next();
    }
    
  };
  
  // Middleware para validar os dados ao finalizar um aluguel
  export function validateReturnRental (schema) {

    return(req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false});
  
    if (validation) {
      return res.status(400).send({ message: validation.error.details[0].message });
    }
  
    next();

    }
    
  };