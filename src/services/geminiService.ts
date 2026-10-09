import { ProfessionalProfile, Service } from '../types';

export interface AiMatchResult {
  category?: string;
  suggestedKeywords: string[];
  explanation: string;
  matchedProfiles: {
    profile: ProfessionalProfile;
    matchingServices: Service[];
    score: number;
    matchReason: string;
  }[];
}

export async function matchExpertsWithAi(
  userQuery: string,
  profiles: ProfessionalProfile[],
  services: Service[]
): Promise<AiMatchResult> {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are VETEREN's AI Matching Engine. Extract key requirements from the client prompt and output ONLY valid JSON with keys:
"category" (one of: Finance, Engineering, Technology, Teaching, Career Mentoring, Human Resources, Business Management, Project Advisory, Training),
"keywords" (array of strings),
"explanation" (brief sentence explaining what the client is looking for).

Client Prompt: "${userQuery}"`
              }]
            }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return filterDatabaseByCriteria(userQuery, parsed.category, parsed.keywords, parsed.explanation, profiles, services, true);
        }
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to rule-based match engine", e);
    }
  }

  // Fallback to Rule-based natural language matching
  return fallbackRuleBasedMatching(userQuery, profiles, services);
}

function filterDatabaseByCriteria(
  originalQuery: string,
  category: string | undefined,
  keywords: string[] = [],
  explanation: string,
  profiles: ProfessionalProfile[],
  services: Service[],
  isAiPowered: boolean
): AiMatchResult {
  const queryLower = originalQuery.toLowerCase();

  const results = profiles.map(profile => {
    let score = 0;
    const reasons: string[] = [];

    // Category match
    if (category && profile.industries.some(i => i.toLowerCase().includes(category.toLowerCase()))) {
      score += 40;
      reasons.push(`Specializes in ${category}`);
    }

    // Skill & Bio keyword matches
    keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (profile.headline.toLowerCase().includes(kwLower) || profile.biography.toLowerCase().includes(kwLower)) {
        score += 20;
        reasons.push(`Matches keyword "${kw}"`);
      }
      if (profile.skills.some(s => s.toLowerCase().includes(kwLower))) {
        score += 25;
        reasons.push(`Expert in ${kw}`);
      }
    });

    // General query terms
    const queryTerms = queryLower.split(' ').filter(w => w.length > 3);
    queryTerms.forEach(term => {
      if (profile.headline.toLowerCase().includes(term) || profile.skills.some(s => s.toLowerCase().includes(term))) {
        score += 10;
      }
    });

    const matchingServices = services.filter(s => s.professionalUid === profile.uid);

    return {
      profile,
      matchingServices,
      score,
      matchReason: reasons.length > 0 
        ? reasons.join(' • ') 
        : `${profile.experienceYears} years of senior expertise in ${profile.industries.join(', ')}`
    };
  })
  .filter(item => item.score > 0 || queryLower.length < 5)
  .sort((a, b) => b.score - a.score);

  return {
    category,
    suggestedKeywords: keywords,
    explanation: isAiPowered ? explanation : `Parsed request: Looking for expertise in ${category || 'consulting & mentoring'}`,
    matchedProfiles: results
  };
}

function fallbackRuleBasedMatching(
  query: string,
  profiles: ProfessionalProfile[],
  services: Service[]
): AiMatchResult {
  const categories = [
    'Finance', 'Engineering', 'Technology', 'Teaching', 
    'Career Mentoring', 'Human Resources', 'Business Management', 'Project Advisory', 'Training'
  ];

  const queryLower = query.toLowerCase();
  const detectedCategory = categories.find(c => queryLower.includes(c.toLowerCase()));
  const keywords = queryLower.split(/\s+/).filter(w => w.length > 3 && !['need', 'want', 'looking', 'help', 'for', 'with', 'some'].includes(w));

  return filterDatabaseByCriteria(
    query,
    detectedCategory,
    keywords,
    `Smart Keyword Engine: Extracted ${keywords.length} target criteria from prompt.`,
    profiles,
    services,
    false
  );
}
