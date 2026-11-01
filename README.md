# Mental Beacon (MB)
### Impact-Driven Wellbeing & Social Grounding Space for Young Adults (15–35)

> **Core Thesis**: *Not a mood tracker and not a therapist booking directory.* Built for consistent engagement, authentic peer connection, nervous system regulation, multi-level safety escalation, and financial sustainability.

---

## 🌟 Key Features Implemented

### 1. Sub-divided Communities & Frequent Problem Tracking
- **6 Focus Communities**:
  1. *Quarter-Life & Navigating the Unknown* (Graduation shock, feeling behind peers)
  2. *Early Career, Grind Culture & Burnout* (First jobs, imposter syndrome, Slack boundary anxiety)
  3. *Cost of Living & Financial Dread* (Rent spikes, student debt, social spending guilt)
  4. *Social Shifts, Modern Dating & Loneliness* (Adult friend-making, dating fatigue)
  5. *Family Boundaries & Breaking Cycles* (Immigrant parent expectations, boundary guilt)
  6. *Sensory Overload & Doomscroll Detox* (Revenge bedtime procrastination, screen fatigue)
- **Frequent Problem Analytics**: Automatically tracks and visualizes what obstacles are most frequent across each community.
- **Pseudonymous Handles**: Safe participation using handles (e.g. `@QuietWanderer24`) without exposing real identities or social accounts.

### 2. Multi-Level Lower Threshold & Emergency (Trusted) Circle
- Automatic and manual escalation based on check-in scores or distress indicators:
  - **Level 1**: Prompt user to join relevant peer community to combat isolation
  - **Level 2**: Suggest psychoeducational articles and somatic grounding steps
  - **Level 3**: Activate visual breathing (4-7-8, Box) and acoustic noise synthesizer
  - **Level 4**: Suggest reaching out to Trusted Contacts with pre-composed, low-pressure messages
  - **Level 5**: Recommend vetted MB specialists, 988 Suicide & Crisis Lifeline, and Crisis Text Line (741741)
  - **Level 6**: Automated safe messaging dispatched to designated Trusted Contacts to check in on the user.
- **Trusted Contacts Management**: Configure names, relationships, phone numbers, emails, and personal grounding notes.

### 3. Check-ups that Hold Patterns of the User
- Daily 60-second sensory-biometric check-in (Stress 1-10, Energy 1-10, Focus 1-10, Emotional Texture, Life Domains).
- **Pattern Diagnostics**: Visualizes 7-day stress vs. energy trajectories, identifies recurring life triggers (e.g., Work vs. Rent), and detects stress trend directions.
- Automatically calculates and surfaces lower threshold levels.

### 4. Private Journal & Contextual Prompts
- Private, client-side & vault encrypted journaling.
- **Prompt Generator**: Developmental writing prompts designed to dissolve overthinking, comparison, and impostor syndrome.
- Filter by mood, tags, and date with zero public visibility.

### 5. Somatic Breathwork & Audio Synthesizer
- **Visual Breathing Pacer**: Animated expanding/contracting visual guides for:
  - *4-7-8 Deep Relaxation*
  - *Box Breathing (4-4-4-4)*
  - *Resonance Coherence (5.5s HRV)*
  - *7-11 Panic Release*
- **Pure Web Audio Synthesizer**: Generates **Brown Noise** (deep, warm rumble), **White Noise** (crisp static mask), **Pink Noise** (gentle rain slope), and **432Hz Delta Drone** directly in the browser with zero external audio assets.

### 6. Calming Micro-Games
- **Zen River Stone Balancer**: Mindful physics-inspired stone stacking to center focus.
- **Thought Cloud Unhooker**: Cognitive defusion tool to type anxious thoughts and tap them to dissolve as clouds.
- **5-4-3-2-1 Sensory Grounder**: Interactive step-by-step panic reduction walkthrough.

### 7. Beacon AI Companion (Chatbot)
- Directly linked to the user's latest check-up, stress level, and active life domain context.
- Detects acute distress keywords and automatically suggests lower-threshold escalations.
- Empathetic, CBT/ACT-informed reframing for career, financial, and relational dilemmas.

### 8. Financial Sustainability Model
- **Free Core Tier ($0/forever)**: All crisis escalation, communities, journal, breathwork, and soundscapes are 100% free for youth.
- **University & Employer B2B Sponsorship**: Higher-ed institutions and employers license Mental Beacon to eliminate 6-week campus counseling backlogs.
- **Optional Beacon Pro ($4.99/mo)**: Quarterly longitudinal reports, certified peer circles, and offline audio downloads.

### 9. Transparent Data Architecture & Success Metrics
- **Zero-Ad Commitment**: No third-party ad tracking pixels (Meta, Google, TikTok).
- **One-Click Data Export**: Download complete user history as standardized JSON (`/api/analytics/export-user-data`).
- **Complete Data Erasure**: One-click wipe of all personal logs.
- **Live Impact Dashboard**: Tracks repeat users (76.4%), 30-day retention (69.2%), app usage breakdown, and CSAT scores (4.85/5.0).

---

## 🚀 Running the Application with Bun

### Prerequisites
- [Bun](https://bun.sh/) (v1.3+ installed)

### 1. Start the Backend API
```bash
cd backend
bun install
bun run dev # runs on http://localhost:5000
```

### 2. Start the Frontend React App
```bash
cd frontend
bun install
bun run dev # runs on http://localhost:3000
```

Visit **http://localhost:3000** in your web browser.
