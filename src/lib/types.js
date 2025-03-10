/**
 * @typedef {Object} DataItem
 * @property {string} axis - The name of the category
 * @property {number} value - The numeric value
 * @property {string} [description] - Optional description
 * @property {string} [rationale] - Optional rationale
 * @property {DataItem[]} [children] - Optional child categories
 */

/**
 * @typedef {Object} StyleConfig
 * @property {string} [axisTitleClass] - Class for the axis title
 * @property {string} [categoryContainerClass] - Class for the category container
 * @property {string} [categoryHeaderClass] - Class for the category header
 * @property {string} [descriptionClass] - Class for the description
 * @property {string} [rationaleClass] - Class for the rationale
 * @property {string} [valueButtonClass] - Class for the value button
 * @property {string} [valueClass] - Class for the value display
 * @property {string} [valueUpdatedClass] - Class for the value when updated
 * @property {string} [sliderContainerClass] - Class for the slider container
 * @property {string} [sliderClass] - Class for the slider
 * @property {string} [rationaleEditClass] - Class for the rationale edit container
 * @property {string} [rationaleTextareaClass] - Class for the rationale textarea
 */

/**
 * @typedef {Object} EditorConfig
 * @property {string} [rationaleHeaderText] - Text for the rationale header
 * @property {string} [saveButtonText] - Text for the save button
 * @property {string} [cancelButtonText] - Text for the cancel button
 * @property {string} [addButtonText] - Text for the add button
 * @property {string} [addSubcategoryButtonText] - Text for the add subcategory button
 */

/**
 * @typedef {Object.<string, boolean|string>} StoreRecord
 * Record of string keys with boolean or string values
 */

// Export the types for TypeScript
export {};
