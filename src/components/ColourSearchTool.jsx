// src/ColorSearchTool.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import ColourCard from "./ColourCard";

const ColourSearchTool = () => {
  const [colors, setColors] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const fetchColors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/NishantChandla/color-test-resources/main/xkcd-colors.json"
        );
        setColors(response.data.colors);
      } catch (error) {
        console.error("Error fetching colors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColors();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const calculateColorSimilarity = (color1, color2) => {
    // Your implementation of color similarity calculation
    // This function should return a numerical value indicating the similarity between two colors
    // You can use color distance algorithms like Euclidean distance, Manhattan distance, or Delta E (CIE76 or CIEDE2000)
    // Here's a simple example using Euclidean distance for demonstration
    const rDiff = color1.r - color2.r;
    const gDiff = color1.g - color2.g;
    const bDiff = color1.b - color2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  };

  const handleSearch = () => {
    const inputColor = searchInput.toLowerCase();
    if (!isValidHexColor(inputColor)) {
      setSearchResults([]);
      setErrorMessage("Invalid color. Please enter a valid hex color!!");
      return;
    } else {
      setErrorMessage("");
    }

    const inputColorObject = hexToRgb(inputColor); // Convert hex to RGB

    const sortedColors = colors
      .map((color) => ({
        ...color,
        similarity: calculateColorSimilarity(inputColorObject, hexToRgb(color.hex))
      }))
      .sort((a, b) => a.similarity - b.similarity)
      .slice(0, 100);

    setSearchResults(sortedColors);
  };

  const hexToRgb = (hex) => {
    // Convert hex color to RGB object
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return { r, g, b };
  };
  const isValidHexColor = (hex) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  return (
    <div className="mt-5">
      <div className="mb-16">
        <h1>Colour</h1>
        <input
          className="rounded-md w-72 px-2 py-1 mt-2 mr-1 outline-none"
          type="text"
          placeholder="Enter Colour"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          className="rounded-md w-8  px-1 py-0.5 mt-2 outline-none"
          type="color"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="ml-6 px-2 py-1 bg-zinc-600 rounded-md text-white"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {errorMessage.length>0 ? <p className="text-red-500">{errorMessage}</p> : (
        <div>
      {isLoading ? <h2>Loading...</h2> : (
      <div>
        {searchInput.length > 0 ? (
          <h2 className="text-sm">Searched for ' {searchInput} '</h2>
        ) : (
          <h2 className="text-sm">All Colours.</h2>
        )}
        <table className="lg:w-[60vw] w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Hex</th>
              <th>RGB</th>
              <th>HSL</th>
            </tr>
          </thead>
          <tbody className="ml-5 p-1 ">
            {searchResults.length > 0
              ? searchResults.map((item, index) => (
                  <ColourCard key={index} color={item.color} hex={item.hex} />
                ))
              : colors.map((item, index) => (
                  <ColourCard key={index} color={item.color} hex={item.hex} />
                ))}
          </tbody>
        </table>
      
      </div>
      )}
      </div>
      )}
    </div>
  );
};

export default ColourSearchTool;
