<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import CategoryContainer from './CategoryContainer.svelte';
	import * as store from './stores.js';
	import type { StyleConfig, EditorConfig } from './types.js';

	// Props
	export let data = [];
	export let min = -5;
	export let max = 5;
	export let step = 0.1;
	export let canEdit = true;

	// UI configuration props - consolidated into two objects
	export let styleConfig: Partial<StyleConfig> = {};
	export let textConfig: Partial<EditorConfig> = {};

	// Default text values
	const defaultTextConfig = {
		rationaleHeaderText: 'Why?',
		saveButtonText: 'Save',
		cancelButtonText: 'Cancel',
		addButtonText: 'Add',
		addSubcategoryButtonText: '+ Add Subcategory'
	};

	// Merge default text config with provided text config
	$: mergedTextConfig = { ...defaultTextConfig, ...textConfig };

	// Event dispatcher for changes
	const dispatch = createEventDispatcher();

	// Initialize the stores with the provided data and config
	onMount(() => {
		// Initialize the data store
		store.hierarchicalData.set(data);

		// Initialize the config store
		store.configStore.set({ min, max, step });

		// Initialize expandedNodes with all nodes closed
		store.expandedNodes.set({});

		// Subscribe to the hierarchicalData store to keep the local data in sync
		const unsubscribe = store.hierarchicalData.subscribe((value) => {
			data = value;
			dispatch('change', { data });
		});

		return unsubscribe;
	});

	// Handle change events from CategoryContainer
	function handleChange(event) {
		// Forward the change event with the updated data
		dispatch('change', { ...event.detail, data });
	}
</script>

<div class="hierarchical-data-editor">
	{#if data && data.length > 0}
		<div class="editor-container">
			{#each data as item, index}
				<CategoryContainer
					{item}
					path={`${index}`}
					depth={0}
					{canEdit}
					{styleConfig}
					textConfig={mergedTextConfig}
					on:change={handleChange}
					on:updateParentValues={() => store.updateParentValues()}
				/>
			{/each}
		</div>
	{:else}
		<p>No data available to edit.</p>
	{/if}
</div>

<style>
	.hierarchical-data-editor {
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
		max-width: 100%;
		margin: 0 auto;
	}

	.editor-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
</style>
