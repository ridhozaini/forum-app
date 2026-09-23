import React from 'react';
import PropTypes from 'prop-types';
import './CategoryFilter.css';

function CategoryFilter({ categories, activeCategory, onSelectCategory }) {
  if (categories.length <= 1) return null;

  return (
    <div className="category-filter" role="tablist" aria-label="Filter kategori thread">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={category === activeCategory}
          className={`category-filter__pill ${category === activeCategory ? 'is-active' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.string.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
};

export default CategoryFilter;
