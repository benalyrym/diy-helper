// index.ts - server entry
import { buildApp } from "./app.js"

const start = async () => {
    try {
        const app = buildApp()
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
