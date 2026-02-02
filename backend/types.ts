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
    type?: 'recipe' | 'skincare'
    volume?: number
    skinType?: string
    skincareData?: any
}
