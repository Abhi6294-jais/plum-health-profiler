require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  // UPDATED: 'llama3-8b-8192' is deprecated. 
  // We now use 'llama-3.3-70b-versatile' which is the current stable free model.
  AI_MODEL: "llama-3.3-70b-versatile" 
};
