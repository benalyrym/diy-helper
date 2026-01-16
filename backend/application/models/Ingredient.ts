import { DomainError } from "../errors/DomainError"

export class Ingredient {
    constructor(
        public name: string,
        public ratio: number,
        public density: number
    ) {
        if (!name || ratio < 0) throw new DomainError("Invalid ingredient")
    }
}
