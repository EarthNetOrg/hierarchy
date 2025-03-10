<script lang="ts">
	import { HierarchicalDataEditor } from '../lib/index.js';

	// Sample hierarchical data
	let data = [
		{
			axis: 'User Experience',
			value: 3,
			description: 'Overall user experience evaluation',
			children: [
				{
					axis: 'Usability',
					value: 4,
					description: 'How easy the product is to use',
					children: [
						{
							axis: 'Learnability',
							value: 3.5,
							description: 'How easy it is to learn the product'
						},
						{
							axis: 'Efficiency',
							value: 4.2,
							description: 'How efficiently tasks can be performed'
						}
					]
				},
				{
					axis: 'Design',
					value: 2,
					description: 'Visual and interaction design',
					rationale: 'The design is functional but lacks polish'
				}
			]
		},
		{
			axis: 'Performance',
			value: -1,
			description: 'System performance evaluation',
			rationale: 'The system is slow under heavy load'
		}
	];

	function handleChange(event: CustomEvent) {
		console.log('Data updated:', event.detail.data);
	}
</script>

<div class="container">
	<h1>Hierarchical Data Editor Demo</h1>
	<p>
		A customizable component for editing hierarchical data with support for nested categories,
		values, descriptions, and rationales.
	</p>

	<div class="demo-container">
		<HierarchicalDataEditor
			{data}
			min={-5}
			max={5}
			step={0.1}
			styleConfig={{
				axisTitleClass: 'demo-axis-title',
				valueUpdatedClass: 'demo-value-updated'
			}}
			textConfig={{
				rationaleHeaderText: 'Rationale'
			}}
			on:change={handleChange}
		/>
	</div>

	<div class="instructions">
		<h2>Features</h2>
		<ul>
			<li>Click on category names to expand/collapse</li>
			<li>Use the slider or direct input to change values</li>
			<li>Add rationales to explain your evaluations</li>
			<li>Add subcategories to create deeper hierarchies</li>
		</ul>
	</div>
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

	.demo-container {
		margin: 2rem 0;
		padding: 1.5rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	.instructions {
		margin-top: 2rem;
		padding: 1rem;
		background-color: #f0f0f0;
		border-radius: 8px;
	}

	h2 {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	ul {
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
	}
</style>
