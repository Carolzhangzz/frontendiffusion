const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Function to fetch image from Pexels API
const fetchImageFromAPI = async (searchTerm, size) => {
  const response = await fetch(`https://api.pexels.com/v1/search?query=${searchTerm}&per_page=1`, {
    method: "GET",
    headers: {
      "Authorization": process.env.PEXELS_API_KEY
    }
  });

  if (response.ok) {
    const data = await response.json();
    if (data.photos.length > 0) {
      const photo = data.photos[0];
      switch(size) {
        case 'large':
          return photo.src.large;
        case 'medium':
          return photo.src.medium;
        case 'small':
          return photo.src.small;
        case 'portrait':
          return photo.src.portrait;
        case 'landscape':
          return photo.src.landscape;
        default:
          return photo.src.medium; // Default to medium if size is not specified
      }
    } else {
      throw new Error("No images found for the given search term");
    }
  } else {
    throw new Error("Error fetching image from API");
  }
};

// Function to extract keywords from PRD
const extractKeywords = (prd) => {
  const keywordPattern = /\[(.*?)\]/g;
  const matches = [...prd.matchAll(keywordPattern)];

  const keywords = matches.map(match => {
    const parts = match[1].split('(');
    const term = parts[0].trim();
    const size = parts[1] ? parts[1].replace(')', '').trim() : '';
    return { term, size };
  });

  // Remove duplicates
  const uniqueKeywords = [];
  const keywordSet = new Set();

  for (const keyword of keywords) {
    const key = `${keyword.term}-${keyword.size}`;
    if (!keywordSet.has(key)) {
      uniqueKeywords.push(keyword);
      keywordSet.add(key);
    }
  }

  return uniqueKeywords;
};

module.exports = { fetchImageFromAPI, extractKeywords };
