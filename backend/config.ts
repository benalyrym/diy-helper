const isProd = process.env.NODE_ENV === "production"

const parseOrigins = (value?: string) => {
    if (!value) return []
    return value
        .split(",")
        .map(origin => origin.trim().toLowerCase())
        .filter(origin => origin.length > 0)
}

const defaultDevOrigins = [
    "http://localhost:3000",
    "http://localhost:5173"
]

const configuredOrigins = parseOrigins(process.env.CORS_ORIGIN)
if (isProd && configuredOrigins.length === 0) {
    throw new Error("CORS_ORIGIN is required in production")
}

const normalizeOrigin = (origin: string) => origin.replace(/\/+$/, "")

const allowedOrigins = new Set(
    (configuredOrigins.length > 0 ? configuredOrigins : defaultDevOrigins)
        .map(origin => normalizeOrigin(origin))
)

const allowedHosts = new Set(
    [...allowedOrigins]
        .filter(origin => !origin.startsWith("http://") && !origin.startsWith("https://"))
)

const isOriginAllowed = (origin?: string) => {
    if (!origin) return true
    const normalized = normalizeOrigin(origin.toLowerCase())
    if (allowedOrigins.has(normalized)) return true

    if (allowedHosts.size === 0) return false
    try {
        const parsed = new URL(normalized)
        const host = parsed.host.toLowerCase()
        return allowedHosts.has(host)
    } catch {
        return false
    }
}

const allowCredentials = process.env.CORS_CREDENTIALS === "true"

const jwtSecret = process.env.JWT_SECRET || (isProd ? "" : "dev-secret-change-me")
if (!jwtSecret) {
    throw new Error("JWT_SECRET is required in production")
}

const jwtIssuer = process.env.JWT_ISSUER || "diy-helper"
const jwtAudience = process.env.JWT_AUDIENCE || "diy-helper"
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "30m"

const bcryptRoundsRaw = Number(process.env.BCRYPT_ROUNDS || "12")
const bcryptRounds = Number.isFinite(bcryptRoundsRaw) ? Math.max(10, bcryptRoundsRaw) : 12
const passwordPepper = process.env.PASSWORD_PEPPER || ""

const bodyLimit = Number(process.env.BODY_LIMIT || "1048576")
const safeBodyLimit = Number.isFinite(bodyLimit) ? bodyLimit : 1048576

const dbPath = process.env.DB_PATH || "recipes.db"
const enableHsts = process.env.HSTS_ENABLED === "true"
const requestIdHeader = process.env.REQUEST_ID_HEADER || "x-request-id"

export {
    isProd,
    isOriginAllowed,
    allowCredentials,
    jwtSecret,
    jwtIssuer,
    jwtAudience,
    jwtExpiresIn,
    bcryptRounds,
    passwordPepper,
    safeBodyLimit,
    dbPath,
    enableHsts,
    requestIdHeader
}
