import {createClient} from 'redis' 


const redisClient = createClient({
    url : process.env.REDIS_URL
})
// creates  aredis clients objects told where to connect (ur upstash url )


// if something goes wrong with the connection after its established this catches it so ur whole app doesnt crashes 
redisClient.on('error', (err) => {
    console.log(`redis error ${err}`)
})


// a seperate function that actually starts the connection we call this manually from server.ts same as connectDB()

async function connectRedis() {
    await redisClient.connect()
    console.log("Connected to redis")
    
}

export  {connectRedis , redisClient}








