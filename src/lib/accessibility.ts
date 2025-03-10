/**
 * Accessibility helpers for the hierarchical data editor
 */

/**
 * Handles keyboard navigation for expandable items
 * @param event The keyboard event
 * @param toggleFn The function to call to toggle the item
 */
export function handleKeyboardNavigation(event: KeyboardEvent, toggleFn: () => void): void {
	// Handle Enter or Space to toggle expansion
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		toggleFn();
	}
}

/**
 * Generates ARIA attributes for a category
 * @param isExpanded Whether the category is expanded
 * @param hasChildren Whether the category has children
 * @returns Object with ARIA attributes
 */
export function getCategoryAriaAttributes(
	isExpanded: boolean,
	hasChildren: boolean
): Record<string, string> {
	const attributes: Record<string, string> = {};

	if (hasChildren) {
		attributes['aria-expanded'] = isExpanded ? 'true' : 'false';
		attributes['role'] = 'button';
		attributes['tabindex'] = '0';
	}

	return attributes;
}

/**
 * Generates ARIA attributes for a slider
 * @param min Minimum value
 * @param max Maximum value
 * @param value Current value
 * @param label Label for the slider
 * @returns Object with ARIA attributes
 */
export function getSliderAriaAttributes(
	min: number,
	max: number,
	value: number,
	label: string
): Record<string, string> {
	return {
		'aria-label': `${label} value`,
		'aria-valuemin': min.toString(),
		'aria-valuemax': max.toString(),
		'aria-valuenow': value.toString(),
		role: 'slider'
	};
}

/**
 * Generates a unique ID for accessibility purposes
 * @param prefix Prefix for the ID
 * @param path Path to the item
 * @returns Unique ID
 */
export function generateAccessibleId(prefix: string, path: string): string {
	return `${prefix}-${path.replace(/\./g, '-')}`;
}
