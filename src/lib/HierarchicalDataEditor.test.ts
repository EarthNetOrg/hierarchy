import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import HierarchicalDataEditor from './HierarchicalDataEditor.svelte';

describe('HierarchicalDataEditor', () => {
	const sampleData = [
		{
			axis: 'Category 1',
			value: 3,
			description: 'This is a test category'
		},
		{
			axis: 'Category 2',
			value: -1,
			description: 'This is another test category',
			children: [
				{
					axis: 'Subcategory 2.1',
					value: 2,
					description: 'This is a test subcategory'
				}
			]
		}
	];

	test('should render categories', () => {
		render(HierarchicalDataEditor, { props: { data: sampleData } });

		// Check if categories are rendered
		expect(screen.getByText('Category 1')).toBeInTheDocument();
		expect(screen.getByText('Category 2')).toBeInTheDocument();
	});

	test('should render descriptions', () => {
		render(HierarchicalDataEditor, { props: { data: sampleData } });

		// Check if descriptions are rendered
		expect(screen.getByText('This is a test category')).toBeInTheDocument();
		expect(screen.getByText('This is another test category')).toBeInTheDocument();
	});

	// Note: Testing event dispatching in Svelte components with the current testing setup
	// is challenging. For a more comprehensive test, we would need to set up a more
	// complex testing environment or use a different testing approach.
	// This is a simplified test that just checks if the component renders correctly.
});
