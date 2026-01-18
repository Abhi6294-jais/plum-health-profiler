const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extractTextFromImage } = require('../services/ocrService');
const { extractRiskFactors, generateRecommendations, parseMedicalForm } = require('../services/aiService');
const { calculateRiskScore, sanitizeRecommendations } = require('../utils/riskLogic');

const upload = multer({ dest: 'uploads/' });

router.post('/health-profile', upload.single('image'), async (req, res) => {
  try {
    let rawText = "";

    // --- OCR / RAW INPUT ---
    if (req.file) {
      rawText = await extractTextFromImage(req.file.path);
    } else if (req.body.text) {
      rawText = req.body.text;
    } else {
      return res.status(400).json({ status: "error", message: "No text or image provided." });
    }

    if (!rawText || rawText.length < 5) {
      return res.json({ status: "incomplete_profile", reason: "Input too short." });
    }

    // =========================================================
    // STEP 1: PARSING (Text -> Structured Answers)
    // =========================================================
    const structuredAnswers = await parseMedicalForm(rawText);
    
    // Calculate missing fields
    const requiredFields = ["age", "smoker", "exercise", "diet"];
    const missingFields = requiredFields.filter(field => !structuredAnswers[field]);

    const step1Output = {
      answers: structuredAnswers,
      missing_fields: missingFields,
      confidence: 0.92 // Mocked for parsing step
    };

    // Guardrail: >50% fields missing (2 out of 4)
    if (missingFields.length > 2) {
      return res.json({ 
        step_1: step1Output,
        status: "incomplete_profile", 
        reason: ">50% fields missing" 
      });
    }

    // =========================================================
    // STEP 2: FACTOR EXTRACTION
    // =========================================================
    const aiFactors = await extractRiskFactors(rawText);
    
    const step2Output = {
      factors: aiFactors.map(f => f.factor),
      confidence: aiFactors.length > 0 ? aiFactors[0].confidence : 0.88
    };

    // =========================================================
    // STEP 3: RISK CLASSIFICATION
    // =========================================================
    const { score, riskLevel, factorsList } = calculateRiskScore(aiFactors);

    const step3Output = {
      risk_level: riskLevel,
      score: score,
      rationale: factorsList
    };

    // =========================================================
    // STEP 4: RECOMMENDATIONS (FINAL)
    // =========================================================
    let rawRecommendations = await generateRecommendations(factorsList, riskLevel);
    const safeRecommendations = sanitizeRecommendations(rawRecommendations);

    const step4Output = {
      risk_level: riskLevel,
      factors: factorsList,
      recommendations: safeRecommendations,
      status: "ok"
    };

    // =========================================================
    // FINAL COMPOSITE RESPONSE
    // =========================================================
    res.json({
      step_1_parsing: step1Output,
      step_2_extraction: step2Output,
      step_3_risk_scoring: step3Output,
      step_4_final_output: step4Output
    });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ status: "error", message: "Internal server error." });
  }
});

module.exports = router;