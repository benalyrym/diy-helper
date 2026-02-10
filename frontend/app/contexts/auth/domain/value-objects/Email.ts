export class Email {
    private readonly value: string

    constructor(raw: string) {
        const normalized = raw.trim().toLowerCase()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
            throw new Error("Invalid email")
        }
        this.value = normalized
    }

    toString() {
        return this.value
    }
}
