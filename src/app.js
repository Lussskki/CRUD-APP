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
  

  app.listen(3001,()=>{
    console.log(`Connected to port`)
  })
