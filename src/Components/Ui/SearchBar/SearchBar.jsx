import React, { useState, useEffect, useRef } from "react";
import { SearchResults } from "../SearchResults/SearchResults";

export const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const debounceTimeoutRef = useRef(null);

  const searchProducts = async (searchTerm) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`https://accesoriosapolobackend.onrender.com/busqueda-general?q=${encodeURIComponent(searchTerm)}`, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const results = await response.json();

      const transformedResults = results.map(item => ({
        id: item.id,
        title: item.nombre,
        brand: item.marca || '',
        category: item.categoria || '',
        subcategory: item.subcategoria || '',
        image: [item.url_imagen || '/placeholder-image.jpg'],
        price: item.precio_unidad,
        currentPrice: item.precio_descuento || item.precio_unidad,
        originalPrice: item.precio_unidad,
        discount: item.precio_descuento ? true : false,
        stock: item.stock_general,
        tipo: item.tipo, 
        slug: item.id 
      }));

      setFilteredProducts(transformedResults);
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Error en la búsqueda:', error);
      setError('Error al buscar productos. Por favor, inténtalo de nuevo.');
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Limpiar timeout anterior
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (value.trim() === "") {
      setFilteredProducts([]);
      setError(null);
      return;
    }

    // Aplicar debounce de 300ms
    debounceTimeoutRef.current = setTimeout(() => {
      searchProducts(value.trim());
    }, 300);
  };

  const handleCloseResults = () => {
    setSearchValue("");
    setFilteredProducts([]);
    setError(null);

    // Cancelar búsqueda en curso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Limpiar timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  };

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar productos..."
        className="search-input"
        value={searchValue}
        onChange={handleInputChange}
      />
      <span className="search-icon">
        <i className="hgi hgi-stroke hgi-search-01"></i>
      </span>

      {searchValue && (
        <SearchResults
          results={filteredProducts}
          onClose={handleCloseResults}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};