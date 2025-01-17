import { MLTObjectTypes } from "./MLTObjectTypes.js";
import { MLTStore } from "../../Store/Store.js";

const SourceURL = "https://raw.githubusercontent.com/TravisAlanH/PulseAuditData/refs/heads/main/data.json";

export const getMLT = async () => {
  const response = await fetch(SourceURL);
  let data = await response.json();
  let returnedData = [];
  data.rows.forEach((item, index) => {
    if (MLTObjectTypes.hasOwnProperty(item["Model"])) {
      item = { ...item, Object: MLTObjectTypes[item["Model"]].ObjectType, index: index };
    }
    returnedData.push(item);
  });
  MLTStore.getState().setMLT(returnedData);

  const countMap = { Make: {} };
  // Loop through the array of objects
  returnedData.forEach((obj) => {
    // Loop through each key in the object
    Object.keys(obj).forEach((key) => {
      if (key === "Make") {
        // Initialize the count map for this value if it doesn't exist
        if (!countMap[key][obj[key]]) {
          countMap[key][obj[key]] = 0;
        }
        // Increment the count for this value
        countMap[key][obj[key]]++;
      }
    });
  });

  // Function to get the top 40 most common values
  function getTopValues(countObj) {
    return Object.keys(countObj)
      .sort((a, b) => countObj[b] - countObj[a]) // Sort by frequency, descending
      .slice(0, 40); // Get the top 40 most common values
  }

  // Get the top 40 most common values for both "Make"
  const topMakes = getTopValues(countMap.Make);

  const masterObject = {};

  // Second pass: build the masterObject, but only add top 40 values for "Make" and "Model"
  returnedData.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (key === "Model") return;
      // Check if value is a number, skip this key
      if (typeof obj[key] === "number") return;
      // Check if value is a float after converting from string, skip this key
      if (!isNaN(parseFloat(obj[key]))) return;
      // If the string is "0.00", skip this key
      if (obj[key] === "0.00") return;

      // For "Make" and "Model", only add the top 40 most common values
      if (key === "Make" && !topMakes.includes(obj[key])) return;

      // If the key doesn't exist in the masterObject, initialize it as an empty array
      if (!masterObject[key]) {
        masterObject[key] = [];
      }

      // If the value is not already in the array, push it to ensure unique values
      if (!masterObject[key].includes(obj[key])) {
        masterObject[key].push(obj[key]);
      }
    });
  });

  // Sort the arrays in the masterObject
  Object.keys(masterObject).forEach((key) => {
    masterObject[key].sort((a, b) => a - b); // Sorting numbers in ascending order
  });
  MLTStore.getState().setUniqueHeaders(masterObject);
};
