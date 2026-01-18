# 🏥 AI-Powered Health Risk Profiler

This backend service processes user health data (via text or image) to generate a structured risk profile and **non-diagnostic** lifestyle recommendations.

It uses a **Resilient Hybrid AI Architecture** focused on reliability, safety, and real-time inference.

---

## 🧠 Architecture Overview

### 1️⃣ OCR (Tesseract.js)
Digitizes handwritten or printed health notes from uploaded images.

### 2️⃣ AI Inference (Groq Llama 3.3)
Uses Groq Cloud for ultra-low-latency parsing, risk factor extraction, and recommendation generation.

### 3️⃣ Smart Fallback Layer
Ensures the API **never crashes**, even if external AI services are unavailable.

---

## 🚀 Features

- **Multi-Modal Input** (Text + Image)
- **4-Step Processing Pipeline**
- **AI-Driven Intelligence**
- **Smart Failover System**
- **Safety Guardrails**
- **Deterministic Risk Scoring**

---

## 🛠️ Tech Stack

- **Runtime:** Node.js + Express
- **OCR:** Tesseract.js
- **AI Inference:** Groq Cloud (`llama-3.3-70b-versatile`)
- **Uploads:** Multer
- **Config:** Dotenv

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/plum-health-profiler.git
cd plum-health-profiler



2. Install Dependencies

npm install


3. Configure Environment Variables

Create a .env file in the root directory:

PORT=3000
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxx


Get your API key from: https://console.groq.com

4. Run the Server

npm run dev


You should see:

🚀 Server running on http://localhost:3000


📡 API Usage

Endpoint: POST /api/health-profile

Option 1: Text Input (JSON)

Headers:

Content-Type: application/json


Body:

{
  "text": "I am 45 years old, I smoke a pack a day and I love eating sweets. I rarely run."
}


Option 2: Image Input (Multipart/Form-Data)

Body:

Key: image

Type: File

Value: [Select your image file]

📄 Example Response (4-Step Output)

The API returns a structured breakdown aligned with the assignment’s evaluation criteria.

{
  "step_1_parsing": {
    "answers": {
      "age": 45,
      "smoker": true,
      "diet": "high sugar",
      "exercise": "rarely"
    },
    "missing_fields": [],
    "confidence": 0.92
  },
  "step_2_extraction": {
    "factors": [
      "smoker",
      "high sugar diet",
      "sedentary lifestyle (low exercise)"
    ],
    "confidence": 0.95
  },
  "step_3_risk_scoring": {
    "risk_level": "High",
    "score": 65,
    "rationale": [
      "smoker",
      "high sugar diet",
      "sedentary lifestyle (low exercise)"
    ]
  },
  "step_4_final_output": {
    "risk_level": "High",
    "factors": [
      "smoker",
      "high sugar diet",
      "sedentary lifestyle (low exercise)"
    ],
    "recommendations": [
      "Consider reducing smoking gradually.",
      "Reduce daily sugar intake over time.",
      "Aim for a short daily walk."
    ],
    "status": "ok"
  }
}


🧠 Architecture Decisions

1. Why Groq (Llama 3.3)?

For real-time health profiling, latency is critical. Groq’s LPU-based inference delivers near-instant responses compared to traditional CPU/GPU-based APIs. The llama-3.3-70b-versatile model provides strong instruction-following capabilities and reliable structured output generation.

2. Why Not Hugging Face?

Hugging Face Inference APIs were initially evaluated during development. However, free-tier inference suffered from frequent model cold starts, availability issues (404/410 responses), and inconsistent latency. To ensure a stable and reliable demo experience, Groq Cloud was selected for its consistently available models, predictable performance, and production-grade inference reliability.

3. Resilience & Fallback Strategy

Problem: External AI APIs can experience downtime or rate limits.

Solution: All AI calls are wrapped in a try/catch mechanism. If Groq is unavailable, the system automatically degrades to local keyword-based logic.

Result: The backend always returns a valid JSON response, ensuring reliability during demos and real-world usage.

4. Safety Guardrails

To prevent hallucination or unsafe medical advice:

Input Validation: Minimum input length checks.

Output Sanitization: Filters restricted medical terms such as “diagnose”, “cure”, or “prescription”.

Non-Diagnostic Design: All recommendations are general wellness guidance only.

5. Confidence Scores

Confidence values are heuristic indicators derived from AI certainty and deterministic logic. They are not clinical probabilities and should be interpreted only as signal-strength indicators.

⚠️ Limitations

This system provides non-diagnostic wellness guidance only. It is intended for educational and risk-awareness purposes and does not replace professional medical consultation.

🏁 Final Notes

This project demonstrates:

✅ AI-first backend design

✅ Production-grade resilience

✅ Safe and responsible AI usage

✅ Clear alignment with the assignment’s 4-step evaluation pipeline



