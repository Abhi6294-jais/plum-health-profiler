const Groq = require("groq-sdk");
const config = require('../config');

// Initialize Groq Client
const groq = new Groq({ apiKey: config.GROQ_API_KEY });

// --- LOCAL FALLBACK (Safety Net) ---
function localFactorExtraction(text) {
  console.log("[Fallback] ⚠️ AI unavailable. Using local keyword logic.");
  const lowerText = text.toLowerCase();
  const factors = [];
  
  if (lowerText.match(/smoke|cigarette|tobacco|nicotine/)) factors.push({ factor: "smoker", confidence: 0.9 });
  if (lowerText.match(/sugar|sweet|candy|soda|dessert/)) factors.push({ factor: "high sugar diet", confidence: 0.8 });
  if (lowerText.match(/alcohol|beer|wine|liquor/)) factors.push({ factor: "high alcohol consumption", confidence: 0.8 });
  if (lowerText.match(/weight|fat|obese|bmi/)) factors.push({ factor: "obesity or overweight", confidence: 0.8 });
  if (lowerText.match(/lazy|sit|desk|inactive/)) factors.push({ factor: "sedentary lifestyle (low exercise)", confidence: 0.7 });
  if (lowerText.match(/run|gym|walk|yoga|workout/)) factors.push({ factor: "regular exercise", confidence: 0.9 });
  if (lowerText.match(/salad|veg|fruit|diet/)) factors.push({ factor: "balanced diet", confidence: 0.9 });

  return factors;
}

// --- HELPER: Clean JSON String ---
function cleanJsonString(str) {
  return str.replace(/```json/g, "").replace(/```/g, "").trim();
}

// --- MAIN FUNCTIONS ---

// [NEW] Step 1: Parse Raw Text into Structured Answers
async function parseMedicalForm(text) {
  console.log(`[AI-Parsing] Structured extraction...`);
  const prompt = `
    Extract key health fields from the text below into a JSON object.
    Fields to look for: "age" (number), "smoker" (boolean), "exercise" (string), "diet" (string).
    
    Text: "${text}"

    Return ONLY JSON. Example: {"age": 40, "smoker": false}
    If a field is missing, do not include it.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: config.AI_MODEL,
      temperature: 0,
    });

    let rawContent = cleanJsonString(chatCompletion.choices[0]?.message?.content || "{}");
    return JSON.parse(rawContent);
  } catch (error) {
    console.error(`[AI-Parsing] Error: ${error.message}`);
    return {}; // Return empty object on failure
  }
}

// Step 2: Extract Risk Factors
async function extractRiskFactors(text) {
  console.log(`[AI-Factors] Sending text to Groq (${config.AI_MODEL})...`);

  const prompt = `
    Analyze the health text below and identify if any of these specific risk factors are present:
    - smoker
    - high sugar diet
    - high alcohol consumption
    - sedentary lifestyle (low exercise)
    - obesity or overweight
    - healthy lifestyle
    - regular exercise
    - balanced diet

    Text: "${text}"

    Instructions:
    1. Return ONLY a JSON array of strings (e.g., ["smoker", "high sugar diet"]).
    2. Do NOT write any other words.
    3. If no factors are found, return [].
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: config.AI_MODEL,
      temperature: 0,
    });

    let rawContent = cleanJsonString(chatCompletion.choices[0]?.message?.content || "[]");
    const factorsArray = JSON.parse(rawContent);
    
    return factorsArray.map(f => ({ factor: f, confidence: 0.95 }));

  } catch (error) {
    console.error(`[AI-Factors] Error: ${error.message}`);
    return localFactorExtraction(text);
  }
}

// Step 4: Recommendations
async function generateRecommendations(factors, riskLevel) {
  if (factors.length === 0) return ["Maintain your healthy habits!"];

  console.log(`[AI-Recs] Generating advice for Risk: ${riskLevel}`);

  const prompt = `
    You are a helpful health coach.
    User Risk Level: ${riskLevel}
    Identified Factors: ${factors.join(", ")}

    Task: Provide exactly 3 short, actionable lifestyle tips.
    Constraints: 
    - Do NOT diagnose diseases. 
    - Do NOT use medical jargon.
    - Return plain text, numbered 1, 2, 3.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: config.AI_MODEL,
      temperature: 0.6,
    });

    const rawText = chatCompletion.choices[0]?.message?.content || "";
    const recs = rawText.split(/\d\./).map(s => s.trim()).filter(s => s.length > 5);
    return recs.length > 0 ? recs : ["Eat healthy.", "Exercise daily.", "Sleep well."];

  } catch (error) {
    console.error(`[AI-Recs] Error: ${error.message}`);
    return ["Eat balanced meals.", "Exercise daily.", "Sleep well."];
  }
}

module.exports = { parseMedicalForm, extractRiskFactors, generateRecommendations };

