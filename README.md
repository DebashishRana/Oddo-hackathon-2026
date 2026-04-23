<!-- markdownlint-disable first-line-h1 -->
<!-- markdownlint-disable html -->
<!-- markdownlint-disable no-duplicate-header -->

<div align="center">
  <img src="https://github.com/user-attachments/assets/31ba39d0-2752-4db8-8701-8561b33ff7dc" />
   
</div>
<hr>
<div align="center" style="line-height: 1;">
  <a href="https://www.deepseek.com/"><img alt="Homepage"
    src="https://github.com/deepseek-ai/DeepSeek-V2/blob/main/figures/badge.svg?raw=true"/></a>
  <a href="https://chat.deepseek.com/"><img alt="API"
    src="https://img.shields.io/badge/🤖%20Chat-DeepSeek%20V3-536af5?color=536af5&logoColor=white"/></a>
  <a href="https://huggingface.co/deepseek-ai"><img alt="Hugging Face"
    src="https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-DeepSeek%20AI-ffc107?color=ffc107&logoColor=white"/></a>
  <br>
  <a href="https://discord.gg/Tc7c45Zzu5"><img alt="Discord"
    src="https://img.shields.io/badge/Discord-DeepSeek%20AI-7289da?logo=discord&logoColor=white&color=7289da"/></a>
  <a href="https://twitter.com/deepseek_ai"><img alt="Twitter Follow"
    src="https://img.shields.io/badge/Twitter-deepseek_ai-white?logo=x&logoColor=white"/></a>
  <br>
  <a href="https://github.com/deepseek-ai/DeepSeek-V3/blob/main/LICENSE-CODE"><img alt="Code License"
    src="https://img.shields.io/badge/Code_License-MIT-f5de53?&color=f5de53"/></a>
  <a href="https://github.com/deepseek-ai/DeepSeek-V3/blob/main/LICENSE-MODEL"><img alt="Model License"
    src="https://img.shields.io/badge/Model_License-Model_Agreement-f5de53?&color=f5de53"/></a>
  <br>
  <a href="https://1drv.ms/p/c/efd2dbbfc9e2248f/IQBsWKMXM_pPTLdMKi1ilpHrATarO8GMZ8A1mTBzYax9wYE?e=HQfx1c"><b>Case paper</b></a>
</div>

## Table of Contents

1. [Introduction](#1-introduction)
2. [Model Summary](#2-Modelsummary)
3. [Evaluation Results](#3-MainWebsite&API Platform)
4. [Chat Website & API Platform](# MainWebsite)
5. [How to Run Locally](#6-how-to-run-locally)
6. [License](#7-license)
7. [Contact](#9-contact)


## 1. Introduction

Dectra is a AI-first API that enables instant verification, extraction, and validation of identity documents such as Aadhaar and PAN.

Built for real-world reliability, Dectra transforms unstructured documents into structured, verifiable data in a single API call.

Unlike traditional OCR pipelines, Dectra combines document understanding, validation logic, and confidence scoring to deliver production-ready outputs — not just raw text.
<p align="center">
  <img width="80%" src="C:\Users\simon\Documents\Dectra\Logos.jpg">
</p>

# 2. Model Summary

**Architecture: Document Intelligence + Validation Engine**

<img width="1920" height="1080" alt="Blue Green Professional Flowchart Template Brainstorm" src="https://github.com/user-attachments/assets/a302c955-e86d-4125-ab14-0579d4be3b42" />



Dectra combines multiple AI components into a unified pipeline designed for real-world document verification:

📄 Document Understanding — extracts structured fields from unstructured inputs (PDFs, images)
🧾 Entity Recognition — identifies key attributes such as name, DOB, ID numbers
✅ Validation Layer — applies rule-based and learned checks to verify authenticity
📊 Confidence Scoring — assigns reliability scores to each extracted field

Unlike traditional OCR systems, Dectra is built to understand and verify, not just read.

---

**⚡ Inference Optimization: Fast & Scalable**

Dectra is optimized for production use:

Low-latency responses suitable for real-time workflows
Efficient processing of large documents and low-quality images
Designed for horizontal scaling across API workloads

This ensures consistent performance even under high request volumes.

---

**🧪 Training Approach: Real-World Robustness**

The system is trained and refined using:

Diverse document formats (scanned, photographed, compressed)
Noisy and imperfect inputs (blur, glare, partial data)
Iterative feedback loops to improve extraction accuracy

This makes Dectra reliable in non-ideal, real-world conditions—not just clean datasets.

🔍 Post-Processing: Intelligence Layer

After extraction, Dectra applies:

Cross-field validation (e.g., format checks, logical consistency)
Error correction and normalization
Output standardization for downstream systems

---




## 4. Main Website & API Platform

<img width="1869" height="903" alt="image" src="https://github.com/user-attachments/assets/3741b640-3cb4-4eeb-b498-cb78c319955a" />

You can access Dectra on our official website: [dectra-two.vercel.app](https://dectra-two.vercel.app/)

We also provide : [platform.dectra.com](https://platform.dectra.com/)

yarn install
## 5. How to Run Locally

Dectra can be deployed and run locally using the following steps:

### 1. Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js), yarn, or pnpm
- Git

### 2. Clone the Repository

```bash
git clone https://github.com/DebashishRana/Dectra.git
cd Dectra
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 4. Environment Variables

Copy the example environment file and fill in your secrets:

```bash
cp .env.example .env.local
```

Edit `.env.local` and provide your database, Stripe, and OpenRouter credentials as needed.

### 5. Database Setup

You can use any local or remote PostgreSQL database. To initialize the schema and sample data, run:

```bash
npm run db:setup
```

Or manually execute the SQL files in `sql-queries` using your preferred SQL client.

### 6. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.


# 📜 License & Usage

This repository is private and proprietary.

All code, models, and associated assets under Dectra are protected under copyright law and are not open-source.

Access is granted on an invite-only basis for evaluation and development purposes.
Unauthorized use, distribution, modification, or reproduction of any part of this repository is strictly prohibited.

Commercial usage of Dectra is subject to separate agreements and licensing terms.

For access requests or partnership inquiries, please contact the maintainers.


## 9. Contact
If you have any questions, please raise an issue or contact us at [hi@dectra.in](hi@dectra.in).
