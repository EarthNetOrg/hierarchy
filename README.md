# Svelte Hierarchical Data Editor

A customizable Svelte component for editing hierarchical data with support for nested categories, values, descriptions, and rationales.

## Features

- Edit hierarchical data with unlimited nesting
- Expand/collapse nodes for better organization
- Add subcategories dynamically
- Edit values with sliders or direct input
- Add rationales for each value
- Fully customizable styling
- TypeScript support

## Installation

```bash
npm install svelte-evaluation-hierarchy
# or
pnpm add svelte-evaluation-hierarchy
# or
yarn add svelte-evaluation-hierarchy
```

## Usage

```svelte
<script>
	import { HierarchicalDataEditor } from 'svelte-evaluation-hierarchy';

	// Your hierarchical data
	let data = [
		{
			axis: 'Category 1',
			value: 3,
			description: 'This is the first category',
			children: [
				{
					axis: 'Subcategory 1.1',
					value: 2,
					description: 'A subcategory'
				}
			]
		},
		{
			axis: 'Category 2',
			value: -1,
			description: 'This is the second category'
		}
	];

	function handleChange(event) {
		// Handle data changes
		console.log(event.detail.data);
	}
</script>

<HierarchicalDataEditor {data} min={-5} max={5} step={0.1} on:change={handleChange} />
```

## Props

| Prop                | Type         | Default | Description                                          |
| ------------------- | ------------ | ------- | ---------------------------------------------------- |
| `data`              | `DataItem[]` | `[]`    | The hierarchical data to edit                        |
| `min`               | `number`     | `-5`    | Minimum value for sliders                            |
| `max`               | `number`     | `5`     | Maximum value for sliders                            |
| `step`              | `number`     | `0.1`   | Step increment for sliders                           |
| Various CSS classes | `string`     | `''`    | Classes for styling different parts of the component |

## Events

- `change` - Fired when data is modified, with the updated data in `event.detail.data`

## Types

```typescript
type DataItem = {
	axis: string;
	value: number;
	description?: string;
	rationale?: string;
	children?: DataItem[];
	[key: string]: string | number | boolean | DataItem[] | undefined;
};
```

## Styling

The component accepts various CSS class props for styling different parts of the UI:

- `axisTitleClass`
- `categoryContainerClass`
- `categoryHeaderClass`
- `descriptionClass`
- `rationaleClass`
- `valueButtonClass`
- `valueClass`
- `valueUpdatedClass`
- `sliderContainerClass`
- `sliderClass`
- `rationaleEditClass`
- `rationaleTextareaClass`

## License

MIT
