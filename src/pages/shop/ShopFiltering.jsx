import React from "react";

const ShopFiltering = ({
  filters = {
    categories: [],
    colors: [],
    priceRanges: [],
  },
  filtersState = {
    category: "all",
    color: "all",
    priceRange: "all",
  },
  setFiltersState,
  clearFilters,
}) => {
  return (
    <div className="space-y-5 flex-shrink-0">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

      {/* Category Filter */}
      <div className="flex flex-col space-y-2">
        <h4 className="font-medium text-base text-gray-800">Category</h4>
        <hr className="border-gray-200" />
        {filters.categories?.map((category) => (
          <label key={category} className="capitalize cursor-pointer text-sm text-gray-700 hover:text-gray-900">
            <input
              type="radio"
              name="category"
              value={category}
              checked={filtersState.category === category}
              onChange={(e) =>
                setFiltersState({ ...filtersState, category: e.target.value })
              }
              className="mr-2 accent-[#5A1A2B]"
            />
            <span>{category}</span>
          </label>
        ))}
      </div>

      {/* Color Filter */}
      <div className="flex flex-col space-y-2">
        <h4 className="font-medium text-base text-gray-800">Color</h4>
        <hr className="border-gray-200" />
        {filters.colors?.map((color) => (
          <label key={color} className="capitalize cursor-pointer text-sm text-gray-700 hover:text-gray-900">
            <input
              type="radio"
              name="color"
              value={color}
              checked={filtersState.color === color}
              onChange={(e) =>
                setFiltersState({ ...filtersState, color: e.target.value })
              }
              className="mr-2 accent-[#5A1A2B]"
            />
            <span>{color}</span>
          </label>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="flex flex-col space-y-2">
        <h4 className="font-medium text-base text-gray-800">Price Range</h4>
        <hr className="border-gray-200" />
        {filters.priceRanges?.map((range) => (
          <label key={range.label} className="cursor-pointer text-sm text-gray-700 hover:text-gray-900">
            <input
              type="radio"
              name="priceRange"
              value={`${range.min}-${range.max}`}
              checked={filtersState.priceRange === `${range.min}-${range.max}`}
              onChange={(e) =>
                setFiltersState({ ...filtersState, priceRange: e.target.value })
              }
              className="mr-2 accent-[#5A1A2B]"
            />
            <span>{range.label}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        className="mt-2 w-full bg-[#5A1A2B] hover:bg-[#7A2A3B] py-2 px-4 text-white text-sm font-medium rounded-lg transition-colors"
        onClick={() =>
          clearFilters({
            category: "all",
            color: "all",
            priceRange: "all",
          })
        }
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default ShopFiltering;
