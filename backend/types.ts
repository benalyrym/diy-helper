export type User = {
    id: string
    email: string
}

export type RecipeDTO = {
    id?: string
    name: string
    description: string
    ingredients: any[]
    ownerId: string
}
