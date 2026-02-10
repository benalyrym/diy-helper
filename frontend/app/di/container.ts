import { createApiClient } from "../shared/infrastructure/http/apiClient"
import { AuthHttpRepository } from "../contexts/auth/infrastructure/http/AuthHttpRepository"
import { AuthenticateUser } from "../contexts/auth/application/use-cases/AuthenticateUser"
import { RegisterUser } from "../contexts/auth/application/use-cases/RegisterUser"
import { RecipeHttpRepository } from "../contexts/recipes/infrastructure/http/RecipeHttpRepository"
import { ListRecipes } from "../contexts/recipes/application/use-cases/ListRecipes"
import { GetRecipe } from "../contexts/recipes/application/use-cases/GetRecipe"
import { CreateRecipe } from "../contexts/recipes/application/use-cases/CreateRecipe"
import { UpdateRecipe } from "../contexts/recipes/application/use-cases/UpdateRecipe"
import { DeleteRecipe } from "../contexts/recipes/application/use-cases/DeleteRecipe"

export type Container = ReturnType<typeof createContainer>

type ContainerConfig = {
    baseURL: string
    fetcher: typeof $fetch
    onUnauthorized?: () => Promise<void> | void
    onForbidden?: () => void
}

export const createContainer = (config: ContainerConfig) => {
    const client = createApiClient({
        baseURL: config.baseURL,
        fetcher: config.fetcher,
        onUnauthorized: config.onUnauthorized,
        onForbidden: config.onForbidden
    })

    const authRepository = new AuthHttpRepository(client.request)
    const recipeRepository = new RecipeHttpRepository(client.request)

    return {
        auth: {
            authenticateUser: new AuthenticateUser(authRepository),
            registerUser: new RegisterUser(authRepository)
        },
        recipes: {
            listRecipes: new ListRecipes(recipeRepository),
            getRecipe: new GetRecipe(recipeRepository),
            createRecipe: new CreateRecipe(recipeRepository),
            updateRecipe: new UpdateRecipe(recipeRepository),
            deleteRecipe: new DeleteRecipe(recipeRepository)
        }
    }
}
