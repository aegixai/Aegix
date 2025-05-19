export const sentimentKeywords = {
  positive: [
    "growth", "profit", "acquisition", "record", "expand", "success", "rise", "gain", "strong", "optimism",
    "investment", "award", "approval", "partnership", "expansion", "milestone", "leadership", "innovation", "boom", "revenue"
  ],
  negative: [
    "loss", "fraud", "decline", "lawsuit", "regulation", "risk", "crisis", "drop", "weak", "controversy",
    "bankruptcy", "scandal", "protest", "boycott", "fine", "hack", "data breach", "violation", "downturn", "collapse"
  ],
  neutral: [
    "announcement", "report", "statement", "update", "forecast", "meeting", "market", "news", "plan", "launch",
    "schedule", "briefing", "communication", "memo", "agenda", "timeline", "document", "disclosure", "media", "public"
  ],
  finance: {
    positive: ["acquisition", "merger", "growth", "IPO", "dividend", "expansion", "profit", "investment", "funding", "valuation",
      "record earnings", "revenue increase", "debt reduction", "buyback", "credit upgrade", "market share", "strategic alliance",
      "capital gain", "successful audit", "shareholder return"],
    negative: ["fraud", "lawsuit", "regulatory fine", "insolvency", "litigation", "risk exposure", "downgrade", "earnings miss",
      "dividend cut", "financial scandal", "accounting error", "tax evasion", "cash crunch", "default", "delisting",
      "revenue drop", "stock plummet", "audit warning", "shareholder dispute", "asset freeze"],
    neutral: ["quarterly report", "balance sheet", "market update", "analyst rating", "fiscal year", "budget", "announcement",
      "guidance", "estimate", "consensus", "portfolio", "rebalancing", "index", "valuation", "presentation", "overview",
      "trading volume", "market cap", "regulatory note", "projection"]
  },
  tech: {
    positive: ["launch", "breakthrough", "AI", "expansion", "partnership", "innovation", "milestone", "record downloads",
      "adoption", "patent", "acquisition", "integration", "productivity", "user growth", "open source", "secure system",
      "cloud scaling", "data analytics", "startup funding", "platform success"],
    negative: ["data breach", "layoffs", "antitrust", "regulatory probe", "outage", "lawsuit", "IP theft", "security flaw",
      "hack", "phishing", "software failure", "blackout", "platform ban", "technical debt", "crash", "malware",
      "service interruption", "downtime", "compliance issue", "API abuse"],
    neutral: ["feature update", "roadmap", "user report", "beta launch", "dev log", "whitepaper", "source code", "release note",
      "product review", "open beta", "patch", "rollout", "timeline", "reporting", "issue tracker", "platform analysis",
      "status page", "interface", "architecture", "infrastructure"]
  },
  geopolitical: {
    positive: ["peace", "summit", "agreement", "alliance", "cooperation", "trade deal", "diplomacy", "accord", "treaty",
      "development aid", "UN resolution", "bilateral meeting", "ceasefire", "mediation", "joint statement", "engagement",
      "reconciliation", "goodwill", "investment pact", "humanitarian support"],
    negative: ["conflict", "war", "sanctions", "escalation", "protest", "military action", "occupation", "airstrike", "blockade",
      "terrorism", "coup", "embargo", "diplomatic rift", "border dispute", "unrest", "nuclear threat", "cyberattack",
      "hostility", "oppression", "detention"],
    neutral: ["parliament session", "foreign visit", "press conference", "ambassador statement", "policy outline", "government agenda",
      "election update", "regional report", "budget speech", "international forum", "public address", "non-binding resolution",
      "task force", "briefing", "council statement", "strategic document", "position paper", "timetable", "legislative draft", "motion"]
  },
  political: {
    positive: ["victory", "reform", "coalition", "agreement", "dialogue", "approval", "policy success", "election win",
      "majority", "leadership", "diplomacy", "strategic move", "negotiation", "consensus", "new mandate", "coalition deal",
      "stability", "unity", "support", "endorsement"],
    negative: ["scandal", "corruption", "resignation", "backlash", "censorship", "fraud", "polarization", "boycott",
      "conflict", "power struggle", "coup", "sanction", "oppression", "protest", "violence", "extremism", "shutdown",
      "obstruction", "dissent", "populism"],
    neutral: ["campaign", "statement", "bill", "parliament", "vote", "policy", "agenda", "platform", "amendment",
      "press briefing", "hearing", "ruling", "party meeting", "conference", "announcement", "manifesto", "election results",
      "coalition talks", "lawmaker response", "committee"]
  },
  journalism: {
    positive: ["investigative", "exclusive", "award", "exposé", "editorial praise", "freedom", "transparency",
      "breaking news", "special report", "truth", "verified", "clarification", "scoop", "access", "analysis", "impact",
      "courage", "ethical", "reliable", "fact-checked"],
    negative: ["bias", "manipulation", "disinformation", "censorship", "propaganda", "inaccuracy", "hoax", "plagiarism",
      "fake news", "clickbait", "agenda", "distortion", "conflict of interest", "defamation", "retraction", "misleading",
      "anonymous source", "incomplete", "sensationalism", "fabrication"],
    neutral: ["headline", "coverage", "media", "source", "reporting", "byline", "column", "newsroom", "article",
      "segment", "interview", "broadcast", "op-ed", "fact box", "press release", "footage", "timeline", "quote",
      "transcript", "publication"]
  }
};