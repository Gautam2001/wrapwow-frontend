import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./SidebarFilter.css";

const SidebarFilter = ({ categories, filters, setFilters }) => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    if (state?.categoryId && categories.length > 0) {
      const selected = categories.find(
        (c) => c.categoryId === parseInt(state.categoryId)
      );

      if (selected) {
        setFilters((prev) => ({
          ...prev,
          category: [selected.category],
        }));
      }
    }
  }, [categories, location.state, setFilters]);

  const handleCategoryChange = (category) => {
    const updatedCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];

    setFilters({ ...filters, category: updatedCategories });
  };

  return (
    <div className="sf-page">
      <h3 className="sf-title">Filter by Category</h3>
      {categories.map((category) => (
        <div key={category.categoryId} className="sf-container">
          <label className="sf-label">
            <input
              type="checkbox"
              checked={filters.category.includes(category.category)}
              onChange={() => handleCategoryChange(category.category)}
              className="sf-input"
            />
            <span className="sf-cat-name">{category.category}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default SidebarFilter;
