import Fastify from "fastify"
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import path from "path"
import authRoutes from "./interfaces/routes/auth.js"
import recipeRoutes from "./interfaces/routes/recipe.js"
import "./infra/db/index.js"

const app = Fastify({
    logger: true,
    // Ajoutez ces options pour mieux gérer les CORS
    ajv: {
        customOptions: {
            removeAdditional: false,
            useDefaults: true,
            coerceTypes: true,
            allErrors: true
        }
    }
})

// Configuration CORS COMPLÈTE
app.register(fastifyCors, {
    origin: true, // Permet toutes les origines
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-Api-Key',
        'X-Request-Id',
        'X-Response-Time'
    ],
    exposedHeaders: [
        'X-Request-Id',
        'X-Response-Time',
        'Content-Length',
        'ETag'
    ],
    credentials: true,
    maxAge: 86400, // 24 heures
    preflightContinue: false,
    optionsSuccessStatus: 204,
    // Désactivez le cache pour les requêtes OPTIONS en développement
    hideOptionsRoute: false
})

app.register(fastifyJwt, {
    secret: "CHANGE_THIS_SECRET",
    // Ajoutez ces options JWT si besoin
    sign: {
        expiresIn: '24h'
    },
    verify: {
        maxAge: '24h'
    }
})

// Hook global pour logger toutes les requêtes
app.addHook('onRequest', async (request, reply) => {
    console.log(`\n🌐 [${request.method}] ${request.url}`)
    console.log('🔍 Headers:', request.headers)
    console.log('📦 Body:', request.body)
    console.log('📍 Params:', request.params)
    console.log('🔗 Query:', request.query)
})

// Hook global pour logger les réponses
app.addHook('onResponse', async (request, reply) => {
    console.log(`\n✅ [${request.method}] ${request.url} -> ${reply.statusCode}`)
    console.log('⏱️  Temps de réponse:', reply.getResponseTime(), 'ms')
})

app.register(authRoutes)
app.register(recipeRoutes, { prefix: "/recipes" })

// Route de santé pour tester
app.get('/health', async (request, reply) => {
    return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'recipe-api'
    }
})

// Gestionnaire d'erreurs global
app.setErrorHandler(function (error, request, reply) {
    console.error('💥 Global Error Handler:', error)

    if (error.validation) {
        return reply.status(400).send({
            error: 'Validation Error',
            details: error.validation,
            message: error.message
        })
    }

    reply.status(error.statusCode || 500).send({
        error: error.name || 'Internal Server Error',
        message: error.message || 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })
})

const start = async () => {
    try {
        await app.listen({
            port: 4000,
            host: '0.0.0.0' // Écoute sur toutes les interfaces
        })
        console.log(`🚀 Server is running on http://localhost:4000`)
        console.log(`📚 Documentation: http://localhost:4000/docs`)
    } catch (err) {
        console.error('❌ Failed to start server:', err)
        process.exit(1)
    }
}

start()