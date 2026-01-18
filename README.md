# 🏥 AI-Powered Health Risk Profiler

This backend service processes user health data (via text or image) to generate a structured risk profile and actionable, non-diagnostic lifestyle recommendations.

It is designed using a **Resilient Hybrid AI Architecture** that prioritizes reliability, safety, and real-time inference.

---

## 🧠 Architecture Overview

1.  **OCR (Tesseract.js):** Digitizes handwritten or printed health notes from uploaded images.
2.  **AI Inference (Groq Llama 3.3):** Uses Groq Cloud for ultra-low-latency parsing, risk factor extraction, and recommendation generation.
3.  **Smart Fallback Layer:** A robust local fallback ensures the API never crashes, even if external AI services are unavailable.

---

## 🚀 Features

* **Multi-Modal Input:** Accepts structured JSON text or image uploads (OCR-based).
* **4-Step Processing Pipeline:** Parsing → Factor Extraction → Risk Scoring → Recommendations.
* **AI-Driven Intelligence:** Uses Groq Cloud (`llama-3.3-70b-versatile`) for high-precision reasoning.
* **Smart Failover:** Automatically switches to local regex-based logic if the AI API is unreachable.
* **Safety Guardrails:** Strict filtering ensures no medical diagnosis or unsafe advice is generated.
* **Risk Scoring:** Deterministic scoring logic combined with AI understanding.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js + Express
* **OCR:** Tesseract.js (Local, Free)
* **AI Inference:** Groq Cloud (`llama-3.3-70b-versatile`) ⚡
* **File Uploads:** Multer
* **Config Management:** Dotenv

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd plum-health-profiler
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a .env file in the root directory:
```bash
PORT=3000
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxx
```

Get your API key from: https://console.groq.com

### 4. Run the Server
```bash
npm run dev
```

You should see:
```bash
🚀 Server running on http://localhost:3000
```

## 📡 API Usage

### Endpoint:  POST /api/health-profile




#### Headers:
```bash
Content-Type: application/json
```

### Body:
```json
{
  "text": "I am 45 years old, I smoke a pack a day and I love eating sweets. I rarely run."
}
```

### Option 2: Image Input (Multipart/Form-Data)

### Body:

- **Key:** image  
- **Type:** File  
- **Value:** Select your image file  




The API returns a structured breakdown aligned with the assignment’s evaluation criteria.
```bash
{
  "step_1_parsing": {
    "answers": {
      "age": 45,
      "smoker": true,
      "diet": "high sugar",
      "exercise": "rarely"
    }
    ,
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
```

## 🧠 Architecture Decisions



Problem: External AI APIs can experience downtime or rate limits.

Solution: All AI calls are wrapped in a try/catch mechanism. If Groq is unavailable, the system automatically degrades to local keyword-based logic.

Result: The backend always returns a valid JSON response, ensuring reliability during demos and real-world usage.



To prevent hallucination or unsafe medical advice:

Input Validation: Minimum input length checks.

Output Sanitization: Filters restricted medical terms such as “diagnose”, “cure”, or “prescription”.

Non-Diagnostic Design: All recommendations are general wellness guidance only.



This system provides non-diagnostic wellness guidance only. It is intended for educational and risk-awareness purposes and does not replace professional medical consultation.

## 🏁 Final Notes

This project demonstrates:

✅ AI-first backend design

✅ Production-grade resilience

✅ Safe and responsible AI usage

✅ Clear alignment with the assignment’s 4-step evaluation pipeline

