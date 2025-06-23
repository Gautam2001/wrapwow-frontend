import React from "react";
import "./CategoriesPopup.css"; 

const CategoryPopup = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  selectedCategory,
  onStatusToggle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="cg-overlay">
      <div className="cg-popup">
        <h3>
          {selectedCategory
            ? `Update Category: ${selectedCategory.category}`
            : "Add New Category"}
        </h3>
        <form className="cg-form" onSubmit={onSubmit}>
          <label className="cg-label">Category Title:</label>
          <input
            className="cg-field"
            name="category"
            value={formData.category}
            onChange={onChange}
            required
          />

          <label className="cg-label">Upload Image:</label>
          <input
            className="cg-field"
            name="image"
            type="file"
            accept="image/*"
            onChange={onChange}
          />

          {formData.image ? (
            <div className="cg-image-preview">
              <img src={URL.createObjectURL(formData.image)} alt="Preview" />
            </div>
          ) : (
            selectedCategory?.path && (
              <div className="cg-image-preview">
                <img src={selectedCategory.path} alt="Current" />
              </div>
            )
          )}

          <div className="cg-buttons">
            {selectedCategory && (
              <button
                type="button"
                onClick={onStatusToggle}
                className="cg-submit-button"
              >
                {selectedCategory.categoryStatus === "ACTIVE"
                  ? "Deactivate"
                  : "Activate"}
              </button>
            )}
            <button type="submit" className="cg-submit-button">
              {selectedCategory ? "Update" : "Submit"}
            </button>
            <button type="button" onClick={onClose} className="cg-close-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryPopup;
