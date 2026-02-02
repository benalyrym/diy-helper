// index.ts - version sans transport problématique
import Fastify from "fastify"
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import authRoutes from "./interfaces/routes/auth.js"
import recipeRoutes from "./interfaces/routes/recipe.js"

// Option 1: Logger très simple
const app = Fastify({
    logger: {
        level: 'info'
    }
})

// Option 2: Pas de logger Fastify, utilisez console.log
// const app = Fastify({ logger: false })

// Option 3: Custom logger simple
// const app = Fastify({
//     logger: {
//         transport: {
//             target: '@fastify/one-line-logger'
//         }
//     }
// })

// Configuration CORS
app.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
})

app.register(fastifyJwt, {
    secret: "CHANGE_THIS_SECRET",
    sign: { expiresIn: '24h' }
})

// Nos propres hooks de logging
app.addHook('onRequest', async (request, reply) => {
    const timestamp = new Date().toISOString()
    console.log(`\n[${timestamp}] 🌐 ${request.method} ${request.url}`)

    if (Object.keys(request.query).length > 0) {
        console.log('   Query:', request.query)
    }

    if (request.body && Object.keys(request.body).length > 0) {
        console.log('   Body:', JSON.stringify(request.body, null, 2))
    }
})

app.addHook('onResponse', async (request, reply) => {
    const timestamp = new Date().toISOString()
    const elapsed = reply.elapsedTime?.toFixed(2) || 'N/A'
    console.log(`[${timestamp}] ✅ ${request.method} ${request.url} -> ${reply.statusCode} (${elapsed}ms)`)
})

app.register(authRoutes)
app.register(recipeRoutes, { prefix: "/recipes" })

// Route de santé
app.get('/health', async (request, reply) => {
    return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'recipe-api',
        uptime: process.uptime()
    }
})

// Gestionnaire d'erreurs global
app.setErrorHandler(function (error: any, request, reply) {
    const timestamp = new Date().toISOString()
    console.error(`[${timestamp}] 💥 Error: ${error.message}`)

    if (error.validation) {
        return reply.status(400).send({
            error: 'Validation Error',
            details: error.validation,
            message: error.message
        })
    }

    reply.status(error.statusCode || 500).send({
        error: error.name || 'Internal Server Error',
        message: error.message || 'Something went wrong'
    })
})

const start = async () => {
    try {
        await app.listen({
            port: 4000,
            host: '0.0.0.0'
        })
        console.log(`\n🚀 Server started successfully!`)
        console.log(`📡 Health check: http://localhost:4000/health`)
        console.log(`🔐 Auth: http://localhost:4000/register, http://localhost:4000/login`)
        console.log(`📚 Recipes: http://localhost:4000/recipes`)
        console.log(`\n⏱️  Server uptime: ${process.uptime().toFixed(2)}s`)
    } catch (err: any) {
        console.error('❌ Failed to start server:', err.message)
        process.exit(1)
    }
}

start()