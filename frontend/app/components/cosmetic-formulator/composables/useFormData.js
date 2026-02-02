import { useRecipeForm } from '../../../composables/useRecipeForm'
import { FORM_SECTIONS } from '../utils/constants'

const useFormData = ({ props, emit }) => {
    const form = useRecipeForm({ props, emit })

    return {
        ...form,
        props,
        emit,
        sections: FORM_SECTIONS
    }
}

export default useFormData
