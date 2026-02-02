/**
 * @typedef {Object} FormulaIngredient
 * @property {string} name
 * @property {number} quantity
 * @property {string} unit
 * @property {string} type
 * @property {string=} inci
 */

/**
 * @typedef {Object} CosmeticFormula
 * @property {string} name
 * @property {number} volume
 * @property {string} skinType
 * @property {string} preservativeSystem
 * @property {Array<FormulaIngredient>} ingredients
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const FORMULA_TYPES = {
    SKINCARE: 'skincare'
}
