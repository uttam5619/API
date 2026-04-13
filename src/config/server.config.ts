import http from "http"
import { app } from '../app.js'
import sequelize  from "./db.js"


export async function RunServer(){
    try{
        await sequelize.authenticate()
        console.log('Application connected with database')
        const server =http.createServer(app)
        const port = process.env.PORT || 8926
        server.listen(port,()=>{
            console.log(`Server listening on the port ${port}`)
        })
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

