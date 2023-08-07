import pg from 'pg'

const {Pool} = pg

const connection = new Pool ({
    'user':'postgres',
    'host':'localhost',
    'database': 'postgres',
    'password': 'postgres',
    'port': 5432
})

    try{
        console.log(`Database connected`)
    } catch (error){
        console.log(error)
    }

export default connection