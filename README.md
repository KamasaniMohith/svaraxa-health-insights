<div align="center">
  <h1>🏥 SVARAXA</h1>
  <p><strong>AI-Powered Early Health Risk Detection Platform</strong></p>
  
  ![Live](https://img.shields.io/badge/Live-svaraxa.workers.dev-blue)
  ![Models](https://img.shields.io/badge/Models-XGBoost-green)
  ![AUC](https://img.shields.io/badge/Heart%20AUC-0.926-brightgreen)
  ![License](https://img.shields.io/badge/License-MIT-yellow)
</div>

---

## 🎯 What is SVARAXA?

SVARAXA is a production-grade healthcare AI platform that provides 
early risk detection for Heart Disease, Diabetes, and Breast Cancer 
using explainable machine learning models.

> ⚠️ **Disclaimer:** For educational and awareness purposes only. 
> Not a medical diagnosis. Always consult a licensed healthcare professional.

---

## ✨ Features

- **Multi-Disease Risk Prediction** — Heart Disease, Diabetes, Breast Cancer
- **Explainable AI** — SHAP-based factor importance, not just a black box
- **Health Age Score** — Biological age computed from risk profile  
- **Personalized Recommendations** — Evidence-based actionable steps
- **PDF Report Generation** — Professional downloadable health report
- **User Authentication** — Clerk-powered auth with Google sign-in
- **Assessment History** — Save and track risk assessments over time
- **Medical Disclaimers** — Prominent safety messaging throughout

---

## 🧠 ML Models

| Disease | Algorithm | Accuracy | AUC-ROC |
|---|---|---|---|
| Heart Disease | XGBoost | 86.7% | **0.926** |
| Diabetes | XGBoost | 75.3% | **0.821** |
| Breast Cancer | XGBoost | 96.5% | **0.994** |

**Explainability:** SHAP TreeExplainer with pre-computed feature importance  
**Datasets:** UCI Cleveland Heart Disease, Pima Indians Diabetes, 
Wisconsin Breast Cancer

---

## 🏗️ Architecture

```
Frontend (TanStack Start)     Backend (FastAPI)
┌─────────────────────┐      ┌──────────────────────┐
│  Assessment Forms   │ ───▶ │  /predict/heart       │
│  Results Dashboard  │      │  /predict/diabetes    │
│  PDF Generator      │      │  /predict/breast-     │
│  History Page       │      │   cancer              │
│  Clerk Auth         │      │                       │
└─────────────────────┘      │  XGBoost Models       │
         │                   │  SHAP Explainability  │
    Cloudflare               └──────────────────────┘
      Workers                   Hugging Face Spaces
                                    (Free tier)
```

---

## 🛠️ Tech Stack

**Frontend:** TanStack Start, React, Tailwind CSS, shadcn/ui  
**Backend:** FastAPI, Python  
**ML:** XGBoost, SHAP, scikit-learn, pandas  
**Auth:** Clerk  
**PDF:** jsPDF  
**Deployment:** Cloudflare Workers (frontend), Hugging Face Spaces (backend)  
**Dev Tools:** GitHub Copilot, VS Code  

---

## 🚀 Running Locally

```bash
# Clone
git clone https://github.com/KamasaniMohith/svaraxa-health-insights.git
cd svaraxa-health-insights

# Install
npm install

# Add environment variables
echo "VITE_CLERK_PUBLISHABLE_KEY=your_key_here" > .env

# Run
npm run dev
```

Backend runs separately on Hugging Face Spaces — 
no local setup needed for the API.

---

## 📁 Project Structure

```
svaraxa-health-insights/
├── src/
│   ├── routes/          # TanStack pages
│   │   ├── index.tsx    # Landing page
│   │   ├── assess/      # Assessment forms
│   │   ├── results.tsx  # Results dashboard
│   │   └── history.tsx  # Saved assessments
│   ├── lib/
│   │   ├── api.ts       # Backend API calls
│   │   ├── store.ts     # Result state
│   │   └── generatePDF.ts # PDF generation
│   └── components/      # Shared UI components
├── public/
└── wrangler.jsonc       # Cloudflare config
```

---

## 🔮 Roadmap

- [ ] **Phase 2** — PostgreSQL history, cloud sync
- [ ] **Phase 3** — AI chatbot with RAG medical knowledge base
- [ ] **Phase 4** — ECG + Mammogram image upload (CNN/ViT)
- [ ] **Phase 5** — Wearables integration (Fitbit, Apple Health)
- [ ] **Phase 6** — MLOps pipeline, model monitoring

---

## 👤 Author

**Mohith Kamasani**  
[GitHub](https://github.com/KamasaniMohith)

---

<div align="center">
  Built with GitHub Copilot · Deployed on Cloudflare Workers
</div>