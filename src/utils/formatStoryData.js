// src/utils/formatStoryData.js
export const formatStoryData = (response) => {
    // Split the response using the new "||" delimiter
    const [story, ...options] = response.split("||").map((item) => item.trim());
  
    // Map each option to an object containing a type and the response text.
    // It expects each option to follow the format: (Role): <Response text>
    const formattedOptions = options.map((option, index) => {
      const [rolePart, ...textParts] = option.split(":");
      const role = rolePart ? rolePart.replace(/[()]/g, "").trim() : "";
      const text = textParts.join(":").trim();
      return { id: index, type: role, text };
    });
  
    return { story, options: formattedOptions };
  };
  