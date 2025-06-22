import React, { useState } from "react";
import { products } from "../../products.js";
import { SearchResults } from "../SearchResults/SearchResults";

export const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const results = products.filter((product) =>
      `${product.title} ${product.brand} ${product.category}`.toLowerCase().includes(value.toLowerCase())
    );


    setFilteredProducts(results);
  };

  const handleCloseResults = () => {
    setSearchValue("");
    setFilteredProducts([]);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar..."
        className="search-input"
        value={searchValue}
        onChange={handleInputChange}
      />
      <span className="search-icon">
        <i className="hgi hgi-stroke hgi-search-01"></i>
      </span>

      {searchValue && (
        <SearchResults results={filteredProducts} onClose={handleCloseResults} />
      )}
    </div>
  );
};
