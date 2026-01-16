import Fastify from "fastify"
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import path from "path"
import authRoutes from "./interfaces/routes/auth.js"
import recipeRoutes from "./interfaces/routes/recipe.js"
import "./infra/db/index.js"

const app = Fastify({ logger: true })

app.register(fastifyCors, { origin: true })
app.register(fastifyJwt, { secret: "CHANGE_THIS_SECRET" })

app.register(authRoutes)
app.register(recipeRoutes, { prefix: "/recipes" })

app.listen({ port: 4000 })
console.log("API running on http://localhost:4000")
