import pg from 'pg'

const {Pool} = pg

const connection = new Pool ({
    'user':'<>',
    'host':'<>',
    'database': '<>',
    'password': '<>',
    'port': 5432
})

    try{
        console.log(`Database connected`)
    } catch (error){
        console.log(error)
    }

export default connection