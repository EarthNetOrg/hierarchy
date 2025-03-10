<script lang="ts">
	import { HierarchicalDataEditor } from '../../lib/index.js';

	// Basic example data
	let basicData = [
		{
			axis: 'Quality',
			value: 4,
			description: 'Overall quality assessment'
		},
		{
			axis: 'Price',
			value: 2,
			description: 'Price evaluation'
		}
	];

	// Custom range example data
	let customRangeData = [
		{
			axis: 'Satisfaction',
			value: 8,
			description: 'Customer satisfaction score (1-10)'
		},
		{
			axis: 'Recommendation',
			value: 7,
			description: 'Likelihood to recommend (1-10)'
		}
	];

	// Custom styling example data
	let customStylingData = [
		{
			axis: 'Design',
			value: 3,
			description: 'Visual design evaluation'
		},
		{
			axis: 'Functionality',
			value: 4,
			description: 'Functional evaluation'
		}
	];

	// Handle change events
	function handleBasicChange(event: CustomEvent) {
		console.log('Basic data updated:', event.detail.data);
	}

	function handleCustomRangeChange(event: CustomEvent) {
		console.log('Custom range data updated:', event.detail.data);
	}

	function handleCustomStylingChange(event: CustomEvent) {
		console.log('Custom styling data updated:', event.detail.data);
	}
</script>

<div class="container">
	<h1>HierarchicalDataEditor Examples</h1>
	<p>This page demonstrates different configurations of the HierarchicalDataEditor component.</p>

	<section class="example">
		<h2>Basic Example</h2>
		<p>Default configuration with standard range (-5 to 5).</p>
		<div class="example-container">
			<HierarchicalDataEditor data={basicData} on:change={handleBasicChange} />
		</div>
	</section>

	<section class="example">
		<h2>Custom Range Example</h2>
		<p>Using a custom range (1 to 10) with step of 1.</p>
		<div class="example-container">
			<HierarchicalDataEditor
				data={customRangeData}
				min={1}
				max={10}
				step={1}
				on:change={handleCustomRangeChange}
			/>
		</div>
	</section>

	<section class="example">
		<h2>Custom Styling Example</h2>
		<p>Using custom CSS classes for styling.</p>
		<div class="example-container">
			<HierarchicalDataEditor
				data={customStylingData}
				styleConfig={{
					axisTitleClass: 'custom-axis-title',
					categoryContainerClass: 'custom-category-container',
					categoryHeaderClass: 'custom-category-header',
					descriptionClass: 'custom-description',
					valueClass: 'custom-value',
					sliderContainerClass: 'custom-slider-container',
					sliderClass: 'custom-slider'
				}}
				on:change={handleCustomStylingChange}
			/>
		</div>
	</section>

	<section class="example">
		<h2>Custom Text Example</h2>
		<p>Using custom text for buttons and labels.</p>
		<div class="example-container">
			<HierarchicalDataEditor
				data={customStylingData}
				textConfig={{
					rationaleHeaderText: 'Explanation',
					saveButtonText: 'Apply',
					cancelButtonText: 'Discard',
					addButtonText: 'Create',
					addSubcategoryButtonText: '➕ New Subcategory'
				}}
				on:change={handleCustomStylingChange}
			/>
		</div>
	</section>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
	}

	h1 {
		color: #333;
		margin-bottom: 1rem;
	}

	h2 {
		color: #444;
		margin-top: 2rem;
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
	}

	.example {
		margin-bottom: 3rem;
	}

	.example-container {
		margin: 1.5rem 0;
		padding: 1.5rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	/* Custom styles for the third example */
	:global(.custom-axis-title) {
		font-weight: bold;
		color: #2563eb;
	}

	:global(.custom-category-container) {
		border: 2px solid #dbeafe;
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 1rem;
	}

	:global(.custom-category-header) {
		background-color: #eff6ff;
		padding: 0.5rem;
		border-radius: 4px;
	}

	:global(.custom-description) {
		font-style: italic;
		color: #64748b;
	}

	:global(.custom-value) {
		font-weight: bold;
		color: #1e40af;
	}

	:global(.custom-slider-container) {
		padding: 0.5rem;
		background-color: #f8fafc;
		border-radius: 4px;
	}

	:global(.custom-slider) {
		height: 8px;
		background-color: #dbeafe;
	}
</style>
