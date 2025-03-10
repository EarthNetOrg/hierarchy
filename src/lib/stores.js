import { writable } from 'svelte/store';

/**
 * @typedef {Object} DataItem
 * @property {string} axis - The name of the category
 * @property {number} value - The numeric value
 * @property {string} [description] - Optional description
 * @property {string} [rationale] - Optional rationale
 * @property {DataItem[]} [children] - Optional child categories
 */

/**
 * @typedef {Object.<string, boolean|string>} StoreRecord
 * Record of string keys with boolean or string values
 */

// Create the main data store
export const hierarchicalData = writable([]);

// Create stores for UI state
export const expandedNodes = writable({});
export const editingRationale = writable({});
export const addingSubcategory = writable({});
export const newSubcategoryName = writable({});
export const recentlyUpdated = writable({});

// Create stores for configuration
export const configStore = writable({
	min: -5,
	max: 5,
	step: 0.1
});

// Helper functions to update the stores
/**
 * Toggle the expanded state of a node
 * @param {string} path - The path of the node to toggle
 */
export function toggleNode(path) {
	expandedNodes.update((nodes) => {
		const updated = { ...nodes };
		updated[path] = !updated[path];
		return updated;
	});
}

/**
 * Toggle the rationale editing state of a node
 * @param {string} path - The path of the node to toggle
 */
export function toggleRationaleEdit(path) {
	editingRationale.update((nodes) => {
		const updated = { ...nodes };
		updated[path] = !updated[path];
		return updated;
	});
}

/**
 * Toggle the subcategory adding state of a node
 * @param {string} path - The path of the node to toggle
 */
export function toggleAddSubcategory(path) {
	addingSubcategory.update((nodes) => {
		const updated = { ...nodes };
		updated[path] = !updated[path];
		return updated;
	});

	// Get the current state to check if we need to reset the name
	let isAdding = false;
	addingSubcategory.update((state) => {
		isAdding = state[path] || false;
		return state;
	});

	if (isAdding) {
		newSubcategoryName.update((names) => {
			const updated = { ...names };
			updated[path] = '';
			return updated;
		});
	}
}

/**
 * Mark a node as recently updated
 * @param {string} path - The path of the node to mark
 */
export function markAsUpdated(path) {
	recentlyUpdated.update((nodes) => {
		const updated = { ...nodes };
		updated[path] = true;
		return updated;
	});

	// Clear the visual feedback after a delay (changed from 1.5s to 3s)
	setTimeout(() => {
		recentlyUpdated.update((nodes) => {
			const updated = { ...nodes };
			updated[path] = false;
			return updated;
		});
	}, 3000);
}

// Function to add a new subcategory
/**
 * Add a new subcategory to a parent item
 * @param {DataItem} parentItem - The parent item to add the subcategory to
 * @param {string} path - The path of the parent item
 */
export function addSubcategory(parentItem, path) {
	let subcategoryName = '';

	// Get the current subcategory name
	newSubcategoryName.update((names) => {
		subcategoryName = names[path] || '';
		return names;
	});

	if (!subcategoryName || subcategoryName.trim() === '') return;

	// Initialize children array if it doesn't exist
	if (!parentItem.children) {
		parentItem.children = [];
	}

	// Create new subcategory with default value
	const newSubcategory = {
		axis: subcategoryName.trim(),
		value: 0,
		children: []
	};

	// Add to parent's children
	parentItem.children.push(newSubcategory);

	// Ensure the parent node is expanded
	expandedNodes.update((nodes) => {
		const updated = { ...nodes };
		updated[path] = true;
		return updated;
	});

	// Reset the input state
	addingSubcategory.update((nodes) => {
		const updated = { ...nodes };
		updated[path] = false;
		return updated;
	});

	newSubcategoryName.update((names) => {
		const updated = { ...names };
		updated[path] = '';
		return updated;
	});

	// Update the main data store to trigger reactivity
	hierarchicalData.update((data) => [...data]);

	// Update parent values
	updateParentValues();
}

// Function to update a value
/**
 * Update the value of an item
 * @param {DataItem} item - The item to update
 * @param {string} path - The path of the item
 * @param {number} newValue - The new value
 */
export function updateValue(item, path, newValue) {
	item.value = newValue;

	// Mark this node as recently updated for visual feedback
	markAsUpdated(path);

	// Update the main data store to trigger reactivity
	hierarchicalData.update((data) => [...data]);

	// Update parent values recursively
	updateParentValues();
}

// Function to update a rationale
/**
 * Update the rationale of an item
 * @param {DataItem} item - The item to update
 * @param {string} path - The path of the item
 * @param {string} newRationale - The new rationale
 */
export function updateRationale(item, path, newRationale) {
	item.rationale = newRationale;

	// Mark this node as recently updated for visual feedback
	markAsUpdated(path);

	// Exit edit mode
	editingRationale.update((nodes) => {
		const updated = { ...nodes };
		updated[path] = false;
		return updated;
	});

	// Update the main data store to trigger reactivity
	hierarchicalData.update((data) => [...data]);
}

// Function to update parent values
/**
 * Update parent values based on children values
 */
export function updateParentValues() {
	hierarchicalData.update((data) => {
		// Helper function to calculate average of children values
		/**
		 * @param {DataItem[]} items - Array of items to calculate average from
		 * @returns {number} The average value
		 */
		function calculateAverage(items) {
			if (!items || items.length === 0) return 0;

			const sum = items.reduce((acc, item) => acc + item.value, 0);
			return parseFloat((sum / items.length).toFixed(2));
		}

		// Recursive function to update parent values
		/**
		 * @param {DataItem[]} items - Array of items to update
		 * @param {string} basePath - Base path for the items
		 */
		function updateParent(items, basePath = '') {
			for (const [index, item] of items.entries()) {
				const currentPath = basePath ? `${basePath}-${index}` : `${index}`;

				if (item.children && item.children.length > 0) {
					// First update any nested children
					updateParent(item.children, currentPath);

					// Store old value for comparison
					const oldValue = item.value;

					// Then calculate this parent's value based on children
					item.value = calculateAverage(item.children);

					// If the value changed, mark it as recently updated
					if (oldValue !== item.value) {
						markAsUpdated(currentPath);
					}
				}
			}
		}

		// Start the recursive update
		updateParent(data);

		return data;
	});
}
