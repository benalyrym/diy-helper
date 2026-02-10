import Fastify, { FastifyInstance } from "fastify"
import fastifyCors from "@fastify/cors"
import fastifyJwt from "@fastify/jwt"
import rateLimit from "@fastify/rate-limit"
import helmet from "@fastify/helmet"
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
    safeBodyLimit,
    enableHsts,
    requestIdHeader
} from "./config.js"

export const buildApp = (): FastifyInstance => {
    const app = Fastify({
        logger: {
            level: "info"
        },
        bodyLimit: safeBodyLimit
    })

    app.register(helmet, {
        global: true,
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        hsts: enableHsts ? { maxAge: 15552000, includeSubDomains: true } : false,
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
        permissionsPolicy: {
            features: {
                geolocation: [],
                microphone: [],
                camera: []
            }
        }
    })

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

    app.addHook("onRequest", async (request, reply) => {
        reply.header(requestIdHeader, request.id)
        const timestamp = new Date().toISOString()
        console.log(`\n[${timestamp}] ${request.method} ${request.url} (${request.id})`)

        if (!isProd) {
            if (Object.keys(request.query).length > 0) {
                console.log("   Query:", request.query)
            }

            if (request.body && Object.keys(request.body).length > 0) {
                const sanitizedBody = { ...(request.body as Record<string, any>) }
                for (const key of ["password", "token", "authorization"]) {
                    if (Object.prototype.hasOwnProperty.call(sanitizedBody, key)) {
                        sanitizedBody[key] = "[redacted]"
                    }
                }
                console.log("   Body:", JSON.stringify(sanitizedBody, null, 2))
            }
        }
    })

    app.addHook("onResponse", async (request, reply) => {
        const timestamp = new Date().toISOString()
        const elapsed = reply.elapsedTime?.toFixed(2) || "N/A"
        console.log(`[${timestamp}] ${request.method} ${request.url} -> ${reply.statusCode} (${elapsed}ms) (${request.id})`)
    })

    app.register(authRoutes)
    app.register(recipeRoutes, { prefix: "/recipes" })

    app.get("/health", async () => ({
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "recipe-api",
        uptime: process.uptime()
    }))

    app.setErrorHandler(function (error: any, request, reply) {
        const timestamp = new Date().toISOString()
        console.error(`[${timestamp}] Error (${request.id}): ${error.message}`)

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

    return app
}
