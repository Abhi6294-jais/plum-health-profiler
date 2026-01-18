function calculateRiskScore(aiFactors) {
  let score = 0;
  const factorsList = [];

  const riskMap = {
    "smoker": 30, "obesity or overweight": 25, "high sugar diet": 20,
    "high alcohol consumption": 20, "sedentary lifestyle (low exercise)": 15,
    "healthy lifestyle": -10, "regular exercise": -10, "balanced diet": -5
  };

  aiFactors.forEach(item => {
    const factorName = item.factor;
    if (riskMap.hasOwnProperty(factorName)) {
      score += riskMap[factorName];
      if (riskMap[factorName] > 0) factorsList.push(factorName);
    }
  });

  score = Math.max(0, Math.min(score, 100)); // Keep between 0-100

  let riskLevel = "Low";
  if (score > 60) riskLevel = "High";
  else if (score > 30) riskLevel = "Medium";

  return { score, riskLevel, factorsList };
}

function sanitizeRecommendations(recommendations) {
  const forbiddenWords = ["diagnose", "cure", "medicine", "cancer", "diabetes", "prescription"];
  
  const cleanRecs = recommendations.filter(rec => {
    const lowerRec = rec.toLowerCase();
    const hasForbidden = forbiddenWords.some(word => lowerRec.includes(word));
    return !hasForbidden;
  });

  return cleanRecs.slice(0, 3);
}

module.exports = { calculateRiskScore, sanitizeRecommendations };