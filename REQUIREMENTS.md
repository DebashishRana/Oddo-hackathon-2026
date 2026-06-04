# Dectra Docs Redesign Prompt: xAI-Style Developer Documentation

## Overview
Transform the current Dectra documentation site into a premium, xAI-inspired developer documentation experience. Preserve all Dectra branding (logo, purple primary color) while adopting xAI's layout patterns, spacing, typography, and component architecture. The current design is dark-themed with purple accents; elevate it to match xAI's polished, high-contrast developer aesthetic.

---

## 1. Global Layout & Structure

### Three-Column Grid
| Column | Width | Behavior |
|--------|-------|----------|
| Left Navigation | 260px fixed | Scrollable independently, sticky top |
| Main Content | max-width 768px | Centered, scrollable |
| Right TOC | 240px fixed | Sticky, highlights active section |

### Top Navigation Bar
- **Left:** Dectra logo (purple icon + "Dectra" wordmark)
- **Center-left:** "Docs" dropdown with chevron
- **Center-right:** Search bar with placeholder "Search" and ⌘K shortcut badge inside
- **Far right:** "API Console" pill button (purple background, white text, rounded-full)

### Background & Colors
- **Page background:** `#0a0a0a` (pure dark, not current lighter shade)
- **Card backgrounds:** `#161616` or `#1a1a1a`
- **Borders:** `1px solid #27272a` (zinc-800), hover state `#3f3f46`
- **Text primary:** `#ffffff`
- **Text secondary:** `#a1a1aa` (zinc-400)
- **Text muted:** `#71717a` (zinc-500)
- **Accent purple:** `#a855f7` (purple-500)
- **Accent purple light:** `#c084fc` (purple-400)
- **Gradient text:** `linear-gradient(135deg, #a855f7, #6366f1)`

### Typography
- **Font family:** Inter or Geist
- **H1:** 48px / 700 weight / line-height 1.1
- **H2:** 32px / 600 weight / line-height 1.2
- **H3:** 24px / 600 weight
- **Body:** 16px / 400 weight / line-height 1.6 / color `#a1a1aa`
- **Labels/captions:** 14px / 500 weight

---

## 2. Hero Section (Homepage / Welcome)

Replace the current single-column "Accelerate Identity Verification" hero with a **split two-column layout** inside a large elevated card (`bg-[#161616]`, rounded-3xl, border, padding 48px).

### Left Column (55%)
- **Status badge:** Green dot (`bg-green-500`, 8px circle) + "Available" text inside a rounded pill (`bg-zinc-800/50`, `border-zinc-700`, `text-zinc-300`, 12px, padding 6px 12px)
- **H1:** "Get started with Dectra" — "Dectra" rendered in purple gradient text
- **Subtitle:** "Complete identity verification solution with document validation, face recognition, and compliance reporting." (max-width 480px, color zinc-400)
- **CTA row:**
  - Primary: "Create API key →" — white background, black text, rounded-full, padding 12px 24px
  - Secondary: "Get Started" — transparent background, `border-zinc-700`, white text, rounded-full

### Right Column (45%)
- **Dark code window:** `bg-[#0d0d0d]`, `border-zinc-800`, rounded-2xl, overflow-hidden, subtle shadow
- **Language tabs:** Python | JavaScript | Python (OpenAI) | JavaScript (OpenAI) | Bash
  - Active: white text, purple bottom border (`border-b-2 border-purple-500`)
  - Inactive: `text-zinc-500`
- **Code content:** Syntax highlighted Dectra SDK initialization code
- **Copy button:** Absolute positioned top-right, clipboard icon, `text-zinc-500 hover:text-white`

---

## 3. "Jump Straight In" Interactive Section

Add this section below the hero on the homepage.

### Header
- **H2:** "Jump straight in"
- **Subtitle:** "Try document, face, image, and compliance verification below" (zinc-400)

### Layout: Two Columns
- **Left (60%):** Tabbed code block
- **Right (40%):** API info card

### Media-Type Tabs (Above Code Block)
Pill-shaped tab group:
- Container: `bg-zinc-900`, rounded-full, padding 4px
- Active tab: `bg-white text-black` (inverted), rounded-full
- Inactive: `text-zinc-400`
- Options: Text | Voice | Image | Video

### Right Info Card
- **Title:** "Verification API" (20px, white, bold)
- **Description:** "Verify identities, validate documents, and build compliance-ready applications." (zinc-400, 14px)
- **Feature list (checkmarks):**
  - ✓ Document OCR
  - ✓ Multi-turn chat
  - ✓ Function calling
- **Pricing:** "$1.25 / 1M input tokens" / "$2.50 / 1M output tokens" with dollar icons
- **CTA:** "Read docs" — full-width outline button, `border-zinc-700`, rounded-lg

---

## 4. Models Section

Replace current model cards with **specification cards** in a 3-column grid (responsive to 1 column on mobile).

### Card Design
- Background: `#161616`
- Border: `1px solid #27272a`
- Border-radius: 24px (rounded-3xl)
- Padding: 24px

### Card Content
**Header row:**
- Model name left (20px, 600 weight, white)
- Icon right (document, face, or image icon in zinc-400)

**Description:**
- 14px, zinc-400, 2-3 lines max

**Spec Table (inside card):**
Two-column layout, label left / value right, no visible table borders:
- Labels: `text-zinc-500`, 14px
- Values: `text-white`, 14px, right-aligned

Example rows:
| Label | Value |
|-------|-------|
| Context | 1 million tokens |
| Input | $1.25 / 1M tokens |
| Output | $2.50 / 1M tokens |
| Reasoning | Configurable ↗ |

**Footer (two stacked buttons):**
1. Primary: "View model" or "Read docs" — `bg-white text-black`, full-width, rounded-lg, 14px/600
2. Secondary: "Try in playground" — `border-zinc-700 text-white`, full-width, rounded-lg. If unavailable: disabled state showing "Playground coming soon" in zinc-600.

---

## 5. Quickstart Page Layout

Route: `/docs/quickstart`

### Page Header
- **Breadcrumb:** "Quickstart" — small, 14px, zinc-500, above H1
- **H1:** "Quickstart" — 48px, bold, white
- **Action bar below H1:**
  - "Copy for LLM" — icon button with clipboard icon
  - "View as Markdown" — icon button with document icon
  - "Create API key" — primary pill button (purple bg, white text)

### Intro Paragraph
"Welcome! In this guide, we'll walk you through the basics of using the Dectra API, from creating an account to making your first request." (zinc-400, max-width 600px)

### Step Sections (H2)
Format each step as a clear H2:
- "Step 1: Create a Dectra account"
- "Step 2: Generate an API key"
- "Step 3: Install an SDK"
- "Step 4: Make your first request"
- "Step 5: Verify a document"

### Step 2: API Key
- Instruction text with hyperlink to "API Keys page" (dotted underline, white)
- **Code block 1 (Bash tab):**
  ```bash
  export DECTRA_API_KEY="your_api_key"
  ```
- Instruction: "Or add it to a .env file in your project directory:"
- **Code block 2 (Bash tab):**
  ```bash
  DECTRA_API_KEY="your_api_key"
  ```

### Step 3: Install SDK
- Text: "Pick your language and install the SDK:"
- **Code block tabs:** Python | Python (OpenAI) | JavaScript | JavaScript (OpenAI)
- **Active (Python):**
  ```bash
  pip install dectra-sdk
  ```

### Step 4: First Request
- Text: "Send a document to Dectra and get a verification result:"
- **Code block tabs:** Python | Python (OpenAI) | JavaScript | JavaScript (OpenAI) | Bash
- **Active (Python):**
  ```python
  import os
  from dectra_sdk import Client
  from dectra_sdk.verification import document, face

  client = Client(api_key=os.getenv("DECTRA_API_KEY"))

  result = client.verify.create(model="dectra-v3")
  result.append(document("passport.jpg"))
  result.append(face("selfie.jpg"))

  response = result.process()
  print(response.status)
  ```

### Right TOC Sidebar Content
Sticky sidebar titled "On this page":
- Step 1: Create a Dectra account
- Step 2: Generate an API key
- Step 3: Install an SDK
- Step 4: Make your first request
- Step 5: Verify a document
- What's next
  - Resources
- Copy for LLM
- Share feedback

Active section: `text-white` with smooth scroll tracking. Inactive: `text-zinc-500`. Hamburger icon at top-right of TOC for mobile collapse.

---

## 6. Code Block Component (Critical)

All code blocks site-wide must use this exact pattern:

### Window Styling
- Background: `#0d0d0d`
- Border: `1px solid #27272a`
- Border-radius: 12px (rounded-xl)
- Overflow: hidden

### Tab Bar
- Horizontal row of language names at top
- Active tab: white text, purple bottom border (`border-b-2 border-purple-500`)
- Inactive tabs: `text-zinc-500`, hover `text-zinc-300`
- Tab options: Python, JavaScript, Python (OpenAI), JavaScript (OpenAI), Bash, cURL
- Separator: `1px solid #27272a` below tabs

### Copy Button
- Position: absolute, top-right, 12px from edges
- Icon: clipboard
- Color: `text-zinc-500`, hover `text-white`
- Click feedback: scale(0.95) + checkmark icon swap

### Syntax Highlighting (Custom Dark Theme)
| Token | Color |
|-------|-------|
| Keywords (import, from, def, return) | `#ff7b72` (red) |
| Strings | `#a5d6ff` (blue) |
| Comments | `#8b949e` (gray) |
| Functions/Methods | `#d2a8ff` (purple) |
| Variables/Params | `#79c0ff` (light blue) |
| Numbers | `#79c0ff` |
| Classes | `#ffa657` (orange) |

---

## 7. Navigation

### Left Sidebar
- **Section headers:** "GET STARTED", "BUILD", "RESOURCES" — uppercase, 12px, `text-zinc-500`, letter-spacing 0.05em, margin-top 24px, margin-bottom 8px
- **Nav items:** 14px, `text-zinc-400`, padding-y 8px, padding-x 12px
- **Hover:** `text-white`, `bg-zinc-800/30`, rounded-md
- **Active item:** `text-white`, left purple border indicator (`border-l-2 border-purple-500`), slight left padding increase
- **Collapsible groups:** Chevron icon rotates 90deg when expanded

**Navigation structure:**