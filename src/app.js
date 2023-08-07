import bodyParser from 'body-parser'
import connection from './db/postgres/connection.js'
import express from 'express'

const app = express()
app.use(express.json())
app.use(bodyParser.json())
    app.get('/',async (req,res,next)=>{
      
      const client = await connection.connect()
      const result = await client.query({
          text:`SELECT * FROM test`,
        })
        
      res.json(result.rows)
      console.log(result.rows)
  })
  app.post('/', async (req, res, next) => {
    console.log('Post request received')
    
    let client 
    
    try {
      const test = req.body
       
      if (!test || !test.id || !test.name || !test.lastname) {
        return res.status(400).json({ error: 'Invalid input data' })
      }
      
      client = await connection.connect()
      const result = await client.query({
        text: `INSERT INTO test ("id", "name", "lastname")
               VALUES ($1, $2, $3) RETURNING id;`,
        values: [
          test.id,
          test.name,
          test.lastname
        ]
      })
      
      // a response after successful insertion
      res.status(201).json({ message: 'Data inserted successfully', insertedId: result.rows[0].id })
    } catch (error) {
      console.error('An error occurred:', error)
      res.status(500).json({ error: 'Internal server error' })
    } finally {
      if (client) {
        client.release(); // Release the client back to the pool if it exists
      }
    }
  })
  app.put('/:id', async (req, res, next) => {
    console.log('Put request received')
    
    const { id } = req.params
    const updatedData = req.body
    let client
    
    try {
      if (!updatedData || !updatedData.name || !updatedData.lastname) {
        return res.status(400).json({ error: 'Invalid input data' })
      }
      
      client = await connection.connect() // Assign to the existing client variable
      
      const result = await client.query({
        text: `UPDATE test
               SET "name" = $1, "lastname" = $2
               WHERE "id" = $3
               RETURNING id;`,
        values: [
          updatedData.name,
          updatedData.lastname,
          id
        ]
      })
      

      res.status(200).json({ message: 'Data updated successfully', updatedId: result.rows[0].id })
    } catch (error) {
      console.error('An error occurred:', error)
      res.status(500).json({ error: 'Internal server error' })
    } finally {
      if (client) {
        client.release() 
      }
    }
  })
  app.delete('/:id', async (req, res, next) => {
    
  }) 

  app.listen(3000,()=>{
    console.log(`Connected to port`)
  })
