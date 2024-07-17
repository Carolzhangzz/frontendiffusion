let storedPRD = null;
let storedImageUrl = null;
let storedImageUrls = null;

module.exports = {
  getStoredPRD: () => storedPRD,
  setStoredPRD: (value) => { storedPRD = value; },

  getStoredImageUrl: () => storedImageUrl,
  setStoredImageUrl: (value) => { storedImageUrl = value; },

  getStoredImageUrls: () => storedImageUrls,
  setStoredImageUrls: (value) => { storedImageUrls = value; },  
};
