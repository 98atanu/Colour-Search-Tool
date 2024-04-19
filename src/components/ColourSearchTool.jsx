// src/ColorSearchTool.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import convert from "color-convert";
import ColourCard from "./ColourCard";

const ColourSearchTool = () => {
  const [colors, setColors] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAPIFailed, setIsAPIFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const COLORS_URL =
    "https://raw.githubusercontent.com/NishantChandla/color-test-resources/main/xkcd-colors.json";

  const fetchColors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(COLORS_URL);

      const normalisedColors = response.data.colors.map(({ color, hex }) => ({
        color,
        hex,
        rgb: convert.hex.rgb(hex),
        hsl: convert.hex.hsl(hex),
      }));

      setColors(normalisedColors);

      setIsAPIFailed(false);
    } catch (error) {
      setIsAPIFailed(true);
      console.error("Error fetching colors:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setColors, setIsAPIFailed]);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(searchInput.toLowerCase());
    }
  };

  const calculateColorSimilarity = (color1, color2) => {
    const rDiff = color1[0] - color2[0];
    const gDiff = color1[1] - color2[1];
    const bDiff = color1[2] - color2[2];
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  };

  const handleSearch = (query) => {
    if (query.length === 0) return setErrorMessage("");

    let inputColorObject;
    if (isValidHexColor(query)) {
      inputColorObject = convert.hex.rgb(query); 
    } else if (isValidRGBColor(query)) {
      inputColorObject = query.split(",").map((val) => parseInt(val.trim()));
    } else {
      setSearchResults([]);
      setErrorMessage(
        "Invalid color. Please enter a valid hex color or RGB values separated by commas!!"
      );
      return;
    }

    setSearchedQuery(query);
    setErrorMessage("");

    const sortedColors = colors
      .map((color) => ({
        ...color,
        similarity: calculateColorSimilarity(
          inputColorObject,
          convert.hex.rgb(color.hex)
        ),
      }))
      .sort((a, b) => a.similarity - b.similarity)
      .slice(0, 100);

    setSearchResults(sortedColors);
  };

  const isValidHexColor = (hex) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const isValidRGBColor = (rgb) => {
    const rgbPattern = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/;
    return rgbPattern.test(rgb);
  };

  return (
    <div className="mt-5">
      <div className="mb-8 ">
        <h1 className="font-semibold">Colour</h1>
        <input
          className="rounded-md w-72 px-2 py-1  mr-1 outline-none"
          type="text"
          placeholder="Enter Colour"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          className="rounded-md w-8  px-1 py-0.5   outline-none"
          type="color"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="ml-6 px-2 py-1 bg-zinc-600 rounded-md text-white font-semibold  "
          onClick={() => handleSearch(searchInput.toLowerCase())}
        >
          Search
        </button>
      </div>

      {isAPIFailed && (
        <div className=" mb-10">
          <p className="text-3xl font-semibold mb-3 text-red-600">
            API Failed!!! Please try again!!!
          </p>
          <button
            className="bg-red-500 px-3 py-1 rounded-md text-white font-semibold hidden sm:inline-block "
            onClick={fetchColors}
          >
            Retry
          </button>
        </div>
      )}

      {isLoading && <h2>Loading...</h2>}

      {!isAPIFailed && errorMessage.length > 0 ? (
        <p className="text-red-600 font-semibold">{errorMessage}</p>
      ) : (
        <div>
          {!isLoading && !isAPIFailed && errorMessage.length === 0 && (
            <div>
              {searchedQuery.length > 0 ? (
                <h2 className="text-sm">Searched for ' {searchedQuery} '</h2>
              ) : (
                <h2 className="text-sm">All Colours.</h2>
              )}
              <table className="lg:w-[60vw] w-full">
                <thead>
                  <tr className="text-xl">
                    <th className="pl-7 text-left">Name</th>
                    <th className="text-left">Hex</th>
                    <th className="text-left">RGB</th>
                    <th className="text-left">HSL</th>
                  </tr>
                </thead>
                <tbody className="ml-5 p-1 ">
                  {searchResults.length > 0
                    ? searchResults.map((item, index) => (
                        <ColourCard
                          key={index}
                          color={item.color}
                          hex={item.hex}
                          rgb={item.rgb}
                          hsl={item.hsl}
                        />
                      ))
                    : colors.map((item, index) => (
                        <ColourCard
                          key={index}
                          color={item.color}
                          hex={item.hex}
                        />
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
