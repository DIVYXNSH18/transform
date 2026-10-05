# TransformAI: Easy-to-Explain Demo Script (Word-for-Word & Action)
### Smart India Hackathon — Problem Statement 26154
**Project:** PRISM: Provenance-Reasoned Intelligent Synthesis for Multi-Channel Content  
**Target Duration:** ~2:30 to 3:00 Minutes  
**Style:** Simple, Conversational, High-Impact English (No complicated tongue-twisters!)

---

## 📋 Copy This Memo Before You Start Recording (Ctrl + C):

```text
Incident Memo: Critical Database Latency Spike & Failover Response
Date: October 5, 2026 | Severity: P1 Critical | Lead: DevOps Engineering

During our Q3 peak load at 14:15 IST, the primary PostgreSQL payment cluster experienced a 340% query latency spike, reaching 1,820ms due to an unindexed foreign key lock. Over 14,200 checkout transactions timed out within 18 minutes, resulting in an estimated revenue impact of ₹3.4 Crores.

Immediate Actions Taken:
1. Initiated read-replica failover at 14:28 IST, restoring baseline p99 latency to 42ms.
2. Isolated anomalous worker pool and deployed hotfix patch #8824.
3. Notified tier-1 enterprise banking partners and initiated reconciliation jobs.

Mandatory Next Steps & Deadlines:
- Database Team: Implement automated partition pruning and index validation by October 8, 18:00 IST.
- SRE Team: Upgrade Redis cache clustering and lower failover trigger threshold to 15 seconds by October 10.
- Compliance: Submit full root-cause audit report to CERT-In within 24 hours.
```

---

## 🎬 Act I: The Problem & The Idea (0:00 – 0:30)

### [0:00 – 0:10]
* **SCREEN ACTION:**  
  Start with the mouse hovering gently over the **TransformAI** logo at `http://localhost:3000/capture`.
* **SAY (Simple & Clear):**  
  > *"Hello everyone! After a team meeting, whiteboard session, or incident response, leaders usually have just a quick voice memo or rough notes."*

### [0:10 – 0:20]
* **SCREEN ACTION:**  
  Scroll down slowly to show the 3 cards: **Voice Memo**, **Whiteboard Image OCR**, and **Document Ingestion**.
* **SAY (Simple & Clear):**  
  > *"Turning those notes into executive briefings, slides, and reports takes over an hour of manual work. And generic AI tools often change the facts and invent numbers."*

### [0:20 – 0:30]
* **SCREEN ACTION:**  
  Pause scrolling right above the main text input box.
* **SAY (Simple & Clear):**  
  > *"That’s why we built **TransformAI** — an intelligent platform that turns raw notes into seven ready-to-use business formats in seconds, with zero made-up facts."*

---

## ⚙️ Act II: Easy Ingestion (0:30 – 0:55)

### [0:30 – 0:42]
* **SCREEN ACTION:**  
  Click into the text box and press **`Ctrl + V`** to paste the incident memo.
* **SAY (Simple & Clear):**  
  > *"We can record voice, upload whiteboard photos, or simply paste our notes. Here, I'm pasting an urgent operational incident report with real metrics and deadlines."*

### [0:42 – 0:50]
* **SCREEN ACTION:**  
  Scroll down to the **Format Selector**. Click the **Language** dropdown, hover over Hindi & Tamil, then click back to English.
* **SAY (Simple & Clear):**  
  > *"TransformAI lets us customize the tone and even generate content in six Indian regional languages, including Hindi and Tamil."*

### [0:50 – 0:55]
* **SCREEN ACTION:**  
  Click the primary button:  
  👉 **"Generate TransformAI Package"** (or click `/studio` in top navbar).
* **SAY (Simple & Clear):**  
  > *"With all seven formats selected, let’s click Generate and enter the Studio."*

---

## 📦 Act III: The 7 Deliverables Tour (0:55 – 1:45)

### [0:55 – 1:07] Deliverable 1: Executive Briefing
* **SCREEN ACTION:**  
  On `http://localhost:3000/studio`. Scroll down to show the **Executive Briefing** and point mouse to green citation `[1]`.
* **SAY (Simple & Clear):**  
  > *"In just seconds, all seven formats are ready at once.  
  > First is the **Executive Briefing** — complete with key takeaways, action tables, and citations linking every fact back to our original notes."*

### [1:07 – 1:17] Deliverable 2: Slide Deck (.pptx)
* **SCREEN ACTION:**  
  Click **"Slide Deck"** tab. Show the 16:9 slide cards, then point cursor to **`.PPTX`** button in the bottom floating bar.
* **SAY (Simple & Clear):**  
  > *"Second is the **Slide Deck** — structured 16:9 slides with speaker notes. One click on the PPTX button downloads an actual PowerPoint file."*

### [1:17 – 1:28] Deliverable 3: Video Package & Teleprompter
* **SCREEN ACTION:**  
  Click **"Video Package"** tab. Switch to **"Teleprompter Script"** sub-tab. Click:  
  👉 **"Read Script (TTS)"**  
  *(Wait 3 seconds while browser audio reads aloud)*.  
  Click **"Stop Voiceover"**.
* **SAY (Simple & Clear):**  
  > *"Third is the **Video Package** — complete scene storyboards, subtitle files, and an interactive teleprompter that reads the script aloud with built-in voice."*

### [1:28 – 1:35] Deliverable 4: Structured Advisory
* **SCREEN ACTION:**  
  Click **"Structured Advisory"** tab. Show the P1 / P2 / P3 priority table.
* **SAY (Simple & Clear):**  
  > *"Fourth is the **Structured Advisory**, organizing mandatory actions and security compliance for operational teams."*

### [1:35 – 1:42] Deliverable 5: Infographic Spec & 1-Click PNG
* **SCREEN ACTION:**  
  Click **"Infographic Spec"** tab. Click:  
  👉 **"Download Graphic (.PNG)"** *(PNG file instantly downloads)*.
* **SAY (Simple & Clear):**  
  > *"Fifth is the **Infographic** — highlighting key metrics, with a one-click button to download a high-resolution PNG image."*

### [1:42 – 1:45] Deliverables 6 & 7: Social Posts
* **SCREEN ACTION:**  
  Click **"LinkedIn Post"**, then click **"Twitter / X Thread"**.
* **SAY (Simple & Clear):**  
  > *"And finally, professional LinkedIn posts and a ready-to-publish Twitter thread within character limits."*

---

## ⚡ Act IV: The PRISM Fact Graph & Dynamic Update (1:45 – 2:25)
*(🌟 THIS IS YOUR MAIN HIGHLIGHT — EXPLAIN IT SIMPLY & PROUDLY)*

### [1:45 – 2:00] The 3-Tier Fact Graph
* **SCREEN ACTION:**  
  Click the green tab:  
  👉 **"Fact Graph & Provenance"**
* **SAY (Simple & Clear):**  
  > *"Now, here is our core breakthrough: the **PRISM Fact Graph**.*  
  > *Instead of guessing, our system connects three layers:*  
  > *Tier 1 is our source note.*  
  > *Tier 2 extracts verified facts and numbers.*  
  > *And Tier 3 anchors those facts across all seven deliverables."*

### [2:00 – 2:10] Interactive Highlighting
* **SCREEN ACTION:**  
  Click on any fact node card in the middle column (Tier 2).  
  *(Watch the right column deliverables light up with blue `ANCHORED ⚡` badges)*.
* **SAY (Simple & Clear):**  
  > *"When I click any fact, TransformAI highlights exactly which deliverables use that information in real time."*

### [2:10 – 2:25] Live 1-Second Update Everywhere
* **SCREEN ACTION:**  
  Click top-right button:  
  👉 **"Edit Fact & Sync All 7"**  
  - Change value: type `30 seconds` (or any new number).  
  - Click **"Propagate Update"**.  
  *(Green checkmark notification appears)*.
* **SAY (Simple & Clear):**  
  > *"And watch what happens if a number changes!  
  > If I update this fact and click 'Propagate', TransformAI updates the single source of truth and automatically re-syncs all seven deliverables in less than a second — with zero inconsistency!"*

---

## 🏆 Act V: Accuracy Scorecard & Closing (2:25 – 2:50)

### [2:25 – 2:40]
* **SCREEN ACTION:**  
  Close edit modal. Click the top header pill:  
  👉 **"99.4% Faithfulness • 0.0% Drift"** *(Scorecard modal opens)*.
* **SAY (Simple & Clear):**  
  > *"We don't just assume accuracy — we mathematically verify it.*  
  > *Our built-in scorecard confirms a **99.4% factual accuracy score** and **zero percent hallucination drift**."*

### [2:40 – 2:50]
* **SCREEN ACTION:**  
  Close modal. Move cursor across the bottom export buttons (`.PPTX`, `.DOCX`, `.PDF`, `.VTT`). Smile at the camera!
* **SAY (Simple & Clear):**  
  > *"From rough notes to boardroom slides, videos, and advisories in seconds — accurate, faithful, and production-ready.*  
  > *This is TransformAI. Thank you!"*

---

## 💡 Quick Tips for Easy Speaking
1. **Speak at a steady, relaxed pace.** Don't rush; you have plenty of time.
2. **Short sentences:** Take a natural breath at the end of each bullet point.
3. **If you stumble:** Just pause 1 second, repeat the sentence clearly, and keep going (easy to trim later).
