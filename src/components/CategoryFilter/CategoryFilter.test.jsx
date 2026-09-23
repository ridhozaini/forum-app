import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CategoryFilter from './CategoryFilter';

/**
 * Skenario pengujian CategoryFilter:
 * - should render nothing when there is one category or fewer
 * - should render a tab/pill for every category when given more than one category
 * - should mark the activeCategory pill as selected
 * - should call onSelectCategory with the clicked category's name
 */
describe('CategoryFilter component', () => {
  it('should render nothing when there is one category or fewer', () => {
    const { container } = render(
      <CategoryFilter categories={['Semua']} activeCategory="Semua" onSelectCategory={jest.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render a tab/pill for every category when given more than one category', () => {
    render(
      <CategoryFilter
        categories={['Semua', 'React', 'Redux']}
        activeCategory="Semua"
        onSelectCategory={jest.fn()}
      />,
    );

    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('should mark the activeCategory pill as selected', () => {
    render(
      <CategoryFilter
        categories={['Semua', 'React']}
        activeCategory="React"
        onSelectCategory={jest.fn()}
      />,
    );

    expect(screen.getByRole('tab', { name: 'React' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Semua' })).toHaveAttribute('aria-selected', 'false');
  });

  it("should call onSelectCategory with the clicked category's name", async () => {
    const user = userEvent.setup();
    const onSelectCategory = jest.fn();

    render(
      <CategoryFilter
        categories={['Semua', 'React']}
        activeCategory="Semua"
        onSelectCategory={onSelectCategory}
      />,
    );

    await user.click(screen.getByRole('tab', { name: 'React' }));

    expect(onSelectCategory).toHaveBeenCalledWith('React');
  });
});
