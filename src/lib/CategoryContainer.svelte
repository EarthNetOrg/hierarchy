<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import * as store from './stores.js';
	import type { DataItem, StyleConfig, EditorConfig } from './types.js';

	// Props
	export let item: DataItem;
	export let path: string;
	export let depth = 0;
	export let canEdit = true;

	// UI configuration props - consolidated
	export let styleConfig: Partial<StyleConfig> = {};
	export let textConfig: Partial<EditorConfig>;

	// Get configuration values from the store
	let min: number;
	let max: number;
	let step: number;

	// Subscribe to the config store
	store.configStore.subscribe((config) => {
		min = config.min;
		max = config.max;
		step = config.step;
	});

	// Event dispatcher for changes
	const dispatch = createEventDispatcher();

	// Handle textarea blur event
	function handleTextareaBlur(event: Event, item: DataItem, nodePath: string): void {
		const textarea = event.target as HTMLTextAreaElement;
		if (textarea) {
			store.updateRationale(item, nodePath, textarea.value);
			dispatch('change', { path: nodePath, rationale: textarea.value });
		}
	}

	// Handle save button click
	function handleSaveClick(event: Event, item: DataItem, nodePath: string): void {
		const button = event.target as HTMLButtonElement;
		const textarea = button.previousElementSibling as HTMLTextAreaElement;
		if (textarea) {
			store.updateRationale(item, nodePath, textarea.value);
			dispatch('change', { path: nodePath, rationale: textarea.value });
		}
	}

	// Helper function to get CSS classes for value display
	function getValueClasses(nodePath: string): string {
		let isUpdated = false;
		store.recentlyUpdated.subscribe((state: Record<string, boolean>) => {
			isUpdated = state[nodePath] || false;
		})();

		return isUpdated
			? styleConfig.valueUpdatedClass || 'value updated-value updated'
			: styleConfig.valueClass || 'value';
	}

	// Get reactive store values
	$: expandedNodes = store.expandedNodes;
	$: editingRationale = store.editingRationale;
	$: addingSubcategory = store.addingSubcategory;
	$: newSubcategoryName = store.newSubcategoryName;

	// Type definitions for store values to avoid TypeScript errors
	type StoreRecord = Record<string, boolean | string>;
</script>

<div
	class="category-container {styleConfig.categoryContainerClass || ''}"
	style="margin-left: {depth * 1}rem;"
>
	<div class="category-header {styleConfig.categoryHeaderClass || ''}">
		<button
			on:click={() => store.toggleNode(path)}
			class="category-title {styleConfig.axisTitleClass || ''}"
			style="font-size: {1.25 - depth * 0.1}rem;"
		>
			{item.axis}

			<span
				class={styleConfig.valueButtonClass || ''}
				aria-expanded={Boolean(($expandedNodes as StoreRecord)[path])}
			>
				<span class={getValueClasses(path)}>{item.value.toFixed(2)}</span>
				/ {max}
			</span>
		</button>
		{#if item.description}
			<p class="category-description {styleConfig.descriptionClass || ''}">{item.description}</p>
		{/if}
	</div>

	{#if ($expandedNodes as StoreRecord)[path]}
		{#if canEdit && (!item.children || item.children.length === 0)}
			<div class="slider-container {styleConfig.sliderContainerClass || ''}">
				<input
					type="range"
					class="slider {styleConfig.sliderClass || ''}"
					{min}
					{max}
					{step}
					value={item.value}
					on:input={(e) => {
						const newValue = parseFloat((e.target as HTMLInputElement).value);
						store.updateValue(item, path, newValue);
						dispatch('change', { path, value: newValue });
						dispatch('updateParentValues');
					}}
				/>
			</div>
		{/if}

		{#if (!item.children || item.children.length === 0) && item.rationale && !($editingRationale as StoreRecord)[path]}
			<div class="rationale {styleConfig.rationaleClass || ''}">
				<h4>{textConfig.rationaleHeaderText || 'Why?'}</h4>
				<p>{item.rationale}</p>
				{#if canEdit}
					<button
						class="edit-rationale-button"
						on:click={() => store.toggleRationaleEdit(path)}
						title="Edit rationale"
					>
						✏️
					</button>
				{/if}
			</div>
		{:else if (!item.children || item.children.length === 0) && canEdit && ($editingRationale as StoreRecord)[path]}
			<div class="rationale-edit {styleConfig.rationaleEditClass || ''}">
				<h4>{textConfig.rationaleHeaderText || 'Why?'}</h4>
				<textarea
					class="rationale-textarea {styleConfig.rationaleTextareaClass || ''}"
					placeholder="Explain your reasoning..."
					value={item.rationale || ''}
					on:blur={(e) => handleTextareaBlur(e, item, path)}
				></textarea>
				<div class="rationale-buttons">
					<button
						class="save-button"
						on:click={(e) => {
							handleSaveClick(e, item, path);
							store.toggleRationaleEdit(path);
						}}
					>
						{textConfig.saveButtonText || 'Save'}
					</button>
					<button class="cancel-button" on:click={() => store.toggleRationaleEdit(path)}>
						{textConfig.cancelButtonText || 'Cancel'}
					</button>
				</div>
			</div>
		{:else if (!item.children || item.children.length === 0) && canEdit}
			<div class="add-rationale">
				<button
					class="add-rationale-button"
					on:click={() => store.toggleRationaleEdit(path)}
					title="Add rationale"
				>
					{textConfig.addButtonText || 'Add'}
					{textConfig.rationaleHeaderText || 'Why?'}
				</button>
			</div>
		{/if}

		<div class="children-container">
			{#if item.children && item.children.length > 0}
				{#each item.children as child, childIndex}
					<svelte:self
						item={child}
						path={`${path}-${childIndex}`}
						depth={depth + 1}
						{canEdit}
						{styleConfig}
						{textConfig}
						on:change
						on:updateParentValues
					/>
				{/each}
			{/if}

			{#if canEdit}
				<div class="add-subcategory-container">
					<button
						class="add-subcategory-button"
						on:click={() => store.toggleAddSubcategory(path)}
						title="Add new subcategory"
					>
						{textConfig.addSubcategoryButtonText || '+ Add Subcategory'}
					</button>
				</div>
			{/if}

			{#if canEdit && ($addingSubcategory as StoreRecord)[path]}
				<div class="add-subcategory-form">
					<input
						type="text"
						placeholder="Subcategory name"
						value={($newSubcategoryName as StoreRecord)[path] || ''}
						on:input={(e) => {
							// Update the newSubcategoryName store directly
							store.newSubcategoryName.update((names: Record<string, string>) => {
								const updated = { ...names };
								updated[path] = (e.target as HTMLInputElement).value;
								return updated;
							});
						}}
					/>
					<div class="subcategory-form-buttons">
						<button
							class="add-button"
							on:click={() => {
								const name = ($newSubcategoryName as StoreRecord)[path] as string;
								if (name && name.trim()) {
									store.addSubcategory(item, path);
									store.toggleAddSubcategory(path);
									dispatch('change', { path, action: 'add-subcategory', name });
									dispatch('updateParentValues');
								}
							}}
						>
							{textConfig.addButtonText || 'Add'}
						</button>
						<button class="cancel-button" on:click={() => store.toggleAddSubcategory(path)}>
							{textConfig.cancelButtonText || 'Cancel'}
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.category-container {
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		padding: 1rem;
		background-color: #f8fafc;
		margin-bottom: 1rem;
	}

	.category-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.category-title {
		width: 100%;
		font-weight: 600;
		margin: 0;
		color: #1e293b;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
	}

	.category-description {
		width: 100%;
		font-size: 0.875rem;
		color: #64748b;
		margin: 0;
	}

	.children-container {
		margin-top: 1rem;
		padding-left: 0.5rem;
	}

	.add-subcategory-container {
		margin: 0.75rem 0;
	}

	.add-subcategory-button {
		background-color: #e2e8f0;
		border: none;
		border-radius: 0.25rem;
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
		color: #475569;
		cursor: pointer;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.add-subcategory-button:hover {
		background-color: #cbd5e1;
	}

	.add-subcategory-form {
		margin: 0.75rem 0;
		padding: 0.75rem;
		background-color: #f1f5f9;
		border-radius: 0.375rem;
		border: 1px dashed #cbd5e1;
	}

	.subcategory-input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #cbd5e1;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.subcategory-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
	}

	.subcategory-actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}

	.add-button {
		background-color: #3b82f6;
		color: white;
		border: none;
		border-radius: 0.25rem;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.add-button:hover:not(:disabled) {
		background-color: #2563eb;
	}

	.add-button:disabled {
		background-color: #94a3b8;
		cursor: not-allowed;
	}

	.slider-container {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin: 0.5rem 0;
	}

	.slider-label {
		font-size: 0.875rem;
		color: #475569;
	}

	.slider {
		width: 100%;
		max-width: 300px;
	}

	.value {
		font-weight: 600;
		color: #0f172a;
		transition:
			color 0.3s,
			background-color 0.3s;
	}

	.updated-value {
		color: #047857;
		background-color: #d1fae5;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		animation: pulse 3s ease-in-out;
	}

	.updated {
		color: #047857;
		background-color: #d1fae5;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		animation: pulse 3s ease-in-out;
		box-shadow: 0 0 0 2px rgba(4, 120, 87, 0.3);
	}

	@keyframes pulse {
		0% {
			background-color: #d1fae5;
			box-shadow: 0 0 0 0 rgba(4, 120, 87, 0.4);
		}
		25% {
			background-color: #a7f3d0;
			box-shadow: 0 0 0 4px rgba(4, 120, 87, 0.2);
		}
		50% {
			background-color: #d1fae5;
			box-shadow: 0 0 0 2px rgba(4, 120, 87, 0.3);
		}
		75% {
			background-color: #a7f3d0;
			box-shadow: 0 0 0 1px rgba(4, 120, 87, 0.2);
		}
		100% {
			background-color: #d1fae5;
			box-shadow: 0 0 0 0 rgba(4, 120, 87, 0.1);
		}
	}

	.rationale-container {
		margin-top: 0.5rem;
		width: 100%;
	}

	.rationale {
		font-size: 0.875rem;
		color: #64748b;
		padding: 0.5rem;
		background-color: #f1f5f9;
		border-radius: 0.25rem;
	}

	.rationale-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.25rem;
	}

	.rationale-text {
		white-space: pre-wrap;
		word-break: break-word;
	}

	.edit-button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.875rem;
		color: #64748b;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		transition: background-color 0.2s;
	}

	.edit-button:hover {
		background-color: #e2e8f0;
	}

	.rationale-edit {
		width: 100%;
	}

	.rationale-textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #cbd5e1;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-family: inherit;
		resize: vertical;
		min-height: 4rem;
		background-color: white;
	}

	.rationale-textarea:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
	}

	.rationale-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
		justify-content: flex-end;
	}

	.save-button,
	.cancel-button {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.save-button {
		background-color: #3b82f6;
		color: white;
	}

	.save-button:hover {
		background-color: #2563eb;
	}

	.cancel-button {
		background-color: #e2e8f0;
		color: #475569;
	}

	.cancel-button:hover {
		background-color: #cbd5e1;
	}
</style>
