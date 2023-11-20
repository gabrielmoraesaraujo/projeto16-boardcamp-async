import db from '../Database/Database.Conection.js'
import dayjs from 'dayjs'

export async function createCustomer (req, res) {

    const { name, phone, cpf, birthday } = req.body
  
    try {
      // Verifique se o CPF já pertence a outro cliente
      const existingCustomer = await db.query('SELECT * FROM customers WHERE cpf = $1', [cpf])
      if (existingCustomer.rows.length > 0) {
        return res.status(409).send({ error: 'CPF already exists.' })
      }
  
      // Insira o novo cliente no banco de dados
      const insertQuery = 'INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)'
      await db.query(insertQuery, [name, phone, cpf, birthday])
  
      return res.status(201).send()
    } catch (error) {
      console.error('Error creating customer:', error)
      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }

  export async function getCustomerById (req, res) {

    const customerId = req.params.id
  
    try {
      // Busque o cliente pelo ID no banco de dados
      const query = 'SELECT * FROM customers WHERE id = $1'
      const result = await db.query(query, [customerId])
  
      if (result.rows.length === 0) {
        return res.status(404).send({ error: 'Customer not found.' })
      }
  
      return res.status(200).send(result.rows[0])
    } catch (error) {
      console.error('Error getting customer by ID:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  export async function updateCustomer (req, res) {

    const customerId = req.params.id
    const { name, phone, cpf, birthday } = req.body
  
    try {

      // Verifique se o cliente com o ID fornecido existe
      const existingCustomer = await db.query('SELECT * FROM customers WHERE id = $1', [customerId])
      if (existingCustomer.rows.length === 0) {
        return res.status(404).send({ error: 'Customer not found.' })
      }
  
      // Verifique se o CPF pertence a outro cliente (exceto o cliente atual)
      const conflictingCustomer = await db.query('SELECT * FROM customers WHERE cpf = $1 AND id != $2', [cpf, customerId])
      if (conflictingCustomer.rows.length > 0) {
        return res.status(409).send({ error: 'CPF already exists for another customer.' })
      }
  
      // Atualize os dados do cliente no banco de dados
      const updateQuery = 'UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5'
      await db.query(updateQuery, [name, phone, cpf, birthday, customerId])
  
      return res.status(200).send()
    } catch (error) {
      console.error('Error updating customer:', error)
      return res.status(500).send({ error: 'Internal Server Error' })
    }
  };

  export async function getCustomers(req, res) {
    try {
        
        const result = await db.query(`SELECT * FROM customers;`);

        const customers = result.rows.map( c => {
            return {
                ...c,
                birthday: dayjs(c.birthday).format('YYYY-MM-DD')
            }
        });

        res.send(customers);

    } catch (err) {
        res.status(500).send(err.message)
    }
}
  