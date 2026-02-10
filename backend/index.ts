// index.ts - server entry
import Fastify from "fastify"
import fastifyCors from "@fastify/cors"
import fastifyJwt from "@fastify/jwt"
import rateLimit from "@fastify/rate-limit"
import authRoutes from "./interfaces/routes/auth.js"
import recipeRoutes from "./interfaces/routes/recipe.js"
import {
    allowCredentials,
    isOriginAllowed,
    isProd,
    jwtAudience,
    jwtExpiresIn,
    jwtIssuer,
    jwtSecret,
    safeBodyLimit
} from "./config.js"

// Option 1: Simple logger
const app = Fastify({
    logger: {
        level: "info"
    },
    bodyLimit: safeBodyLimit
})

// Option 2: Disable Fastify logger, use console.log
// const app = Fastify({ logger: false })

// Option 3: Custom logger
// const app = Fastify({
//     logger: {
//         transport: {
//             target: "@fastify/one-line-logger"
//         }
//     }
// })

// CORS configuration
app.register(fastifyCors, {
    origin: (origin, cb) => cb(null, isOriginAllowed(origin)),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: allowCredentials
})

app.register(fastifyJwt, {
    secret: jwtSecret,
    sign: {
        expiresIn: jwtExpiresIn,
        issuer: jwtIssuer,
        audience: jwtAudience
    },
    verify: {
        issuer: jwtIssuer,
        audience: jwtAudience
    }
})

app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute"
})

// Basic request logging with redaction in non-prod
app.addHook("onRequest", async (request, reply) => {
    const timestamp = new Date().toISOString()
    console.log(`\n[${timestamp}] ${request.method} ${request.url}`)

    if (!isProd) {
        if (Object.keys(request.query).length > 0) {
            console.log("   Query:", request.query)
        }

        if (request.body && Object.keys(request.body).length > 0) {
            const sanitizedBody = { ...(request.body) }
            if (Object.prototype.hasOwnProperty.call(sanitizedBody, "password")) {
                sanitizedBody.password = "[redacted]"
            }
            if (Object.prototype.hasOwnProperty.call(sanitizedBody, "token")) {
                sanitizedBody.token = "[redacted]"
            }
            console.log("   Body:", JSON.stringify(sanitizedBody, null, 2))
        }
    }
})

app.addHook("onResponse", async (request, reply) => {
    const timestamp = new Date().toISOString()
    const elapsed = reply.elapsedTime?.toFixed(2) || "N/A"
    console.log(`[${timestamp}] ${request.method} ${request.url} -> ${reply.statusCode} (${elapsed}ms)`)
})

app.register(authRoutes)
app.register(recipeRoutes, { prefix: "/recipes" })

// Health route
app.get("/health", async (request, reply) => {
    return {
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "recipe-api",
        uptime: process.uptime()
    }
})

// Global error handler
app.setErrorHandler(function (error: any, request, reply) {
    const timestamp = new Date().toISOString()
    console.error(`[${timestamp}] Error: ${error.message}`)

    if (error.validation) {
        return reply.status(400).send({
            error: "Validation Error",
            details: isProd ? undefined : error.validation,
            message: isProd ? "Invalid request" : error.message
        })
    }

    reply.status(error.statusCode || 500).send({
        error: error.name || "Internal Server Error",
        message: isProd ? "Something went wrong" : (error.message || "Something went wrong")
    })
})

const start = async () => {
    try {
        await app.listen({
            port: 4000,
            host: "0.0.0.0"
        })
        console.log("\nServer started successfully")
        console.log("Health check: http://localhost:4000/health")
        console.log("Auth: http://localhost:4000/signup, http://localhost:4000/login")
        console.log("Recipes: http://localhost:4000/recipes")
        console.log(`\nServer uptime: ${process.uptime().toFixed(2)}s`)
    } catch (err: any) {
        console.error("Failed to start server:", err.message)
        process.exit(1)
    }
}

start()
