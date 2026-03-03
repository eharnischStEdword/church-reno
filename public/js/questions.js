const QUIZ_SECTIONS = [
  {
    "id": 1,
    "title": "Vision & Identity",
    "description": "What should this church say about who you are as a parish?",
    "questions": [
      {
        "id": "v1_feel",
        "type": "multi_select",
        "text": "What should people feel walking in for the first time?",
        "options": [
          "Awe",
          "Peace",
          "Welcome",
          "Reverence",
          "Joy",
          "Stillness",
          "Wonder",
          "Safety",
          "Challenge"
        ]
      },
      {
        "id": "v1_emphasize",
        "type": "multi_select",
        "text": "What should the space emphasize?",
        "options": [
          "Transcendence",
          "Intimacy",
          "Reverence",
          "Community",
          "Beauty",
          "Simplicity",
          "Tradition"
        ]
      },
      {
        "id": "v1_identity",
        "type": "multi_select",
        "text": "How would you describe this parish? (Select all that apply)",
        "options": [
          "Traditional",
          "Evangelical",
          "Contemplative",
          "Family-centered",
          "Mission-driven",
          "Liturgically serious",
          "Welcoming"
        ]
      },
      {
        "id": "v1_known_for",
        "type": "single_choice",
        "text": "If St. Edward could be known for one quality in its built environment, which would you choose?",
        "options": [
          "Beauty",
          "Warmth",
          "Clarity",
          "Boldness"
        ]
      },
      {
        "id": "v1_posture",
        "type": "single_choice",
        "text": "Which best describes what this renovation should do?",
        "options": [
          "Restore something that was lost",
          "Correct something that went wrong",
          "Proclaim something new about who we are now"
        ]
      },
      {
        "id": "v1_vision",
        "type": "open_text",
        "text": "In 15-20 years, what do you hope people say about St. Edward when they walk in?"
      },
      {
        "id": "v1_homily",
        "type": "open_text",
        "text": "If the building itself could preach a one-sentence homily, what should it say?"
      },
      {
        "id": "v1_regret",
        "type": "open_text",
        "text": "Is there anything about the current space you would regret losing?"
      },
      {
        "id": "v1_principle",
        "type": "open_text",
        "text": "What theological or liturgical principle should drive every design decision?"
      }
    ]
  },
  {
    "id": 2,
    "title": "Liturgical Experience",
    "description": "How should the space serve the liturgy?",
    "questions": [
      {
        "id": "l2_altar_focus",
        "type": "scale",
        "text": "The altar should be the dominant visual focus of the entire space.",
        "low_label": "One of several focal points",
        "high_label": "The unmistakable center of everything"
      },
      {
        "id": "l2_tabernacle_focus",
        "type": "scale",
        "text": "The tabernacle should command visual attention upon entering.",
        "low_label": "Present but not competing with the altar",
        "high_label": "Immediately visible and prominent"
      },
      {
        "id": "l2_ambo_focus",
        "type": "scale",
        "text": "The ambo (pulpit) should have strong visual weight.",
        "low_label": "Understated, deferring to the altar",
        "high_label": "A substantial, matched presence"
      },
      {
        "id": "l2_hierarchy",
        "type": "scale",
        "text": "The sanctuary should emphasize processional hierarchy and formality.",
        "low_label": "Closeness and accessibility",
        "high_label": "Procession, hierarchy, and formality"
      },
      {
        "id": "l2_sacred_threshold",
        "type": "scale",
        "text": "A child should instinctively know they have crossed into sacred ground.",
        "low_label": "Gentle, gradual transition",
        "high_label": "Clear, unmistakable threshold"
      },
      {
        "id": "l2_weekday_light",
        "type": "single_choice",
        "text": "What should weekday Mass lighting feel like?",
        "options": [
          "Soft and contemplative",
          "Warm and golden",
          "Bright and clear",
          "Dim and candlelit",
          "Natural daylight"
        ]
      },
      {
        "id": "l2_frustration",
        "type": "open_text",
        "text": "What about the current space frustrates you liturgically?"
      },
      {
        "id": "l2_inhibits",
        "type": "open_text",
        "text": "What about the current space inhibits reverence or prayer?"
      },
      {
        "id": "l2_one_change",
        "type": "open_text",
        "text": "If you could change one thing about how the liturgy is experienced in this space, what would it be?"
      }
    ]
  },
  {
    "id": 3,
    "title": "Sanctuary Design",
    "description": "The physical design of the sanctuary, the sacred heart of the church.",
    "questions": [
      {
        "id": "s3_steps_feel",
        "type": "scale",
        "text": "Steps into the sanctuary should feel like...",
        "low_label": "An invitation to draw closer",
        "high_label": "A separation between sacred and ordinary"
      },
      {
        "id": "s3_set_apart",
        "type": "scale",
        "text": "The sanctuary should be...",
        "low_label": "Gently distinguished from the nave",
        "high_label": "Clearly set apart and elevated"
      },
      {
        "id": "s3_boundary",
        "type": "single_choice",
        "text": "What type of boundary between nave and sanctuary feels right?",
        "options": [
          "Rails, elevation change, and distinct materials",
          "Subtle material or lighting change",
          "Minimal or no visible boundary"
        ]
      },
      {
        "id": "s3_altar_dominance",
        "type": "scale",
        "text": "The altar should visually dominate the sanctuary.",
        "low_label": "Proportional to other elements",
        "high_label": "Clearly the largest and most prominent element"
      },
      {
        "id": "s3_tabernacle_placement",
        "type": "single_choice",
        "text": "Where should the tabernacle be placed?",
        "options": [
          "Central axis, behind the altar",
          "Prominent but to the side",
          "In a separate Blessed Sacrament chapel",
          "No strong preference"
        ]
      },
      {
        "id": "s3_steps_count",
        "type": "single_choice",
        "text": "How many steps up to the sanctuary feels right?",
        "options": [
          "1-2 steps",
          "3 steps (traditional)",
          "4-5 steps",
          "No preference"
        ]
      },
      {
        "id": "s3_altar_elevation",
        "type": "scale",
        "text": "The altar itself should be elevated above the sanctuary floor.",
        "low_label": "At the same level as the sanctuary",
        "high_label": "Raised on its own platform or predella"
      },
      {
        "id": "s3_communion_rail",
        "type": "single_choice",
        "text": "What is your preference for a communion rail?",
        "options": [
          "Full communion rail",
          "Partial or symbolic rail",
          "Material change only (e.g., different flooring)",
          "Open, no rail or material change"
        ]
      }
    ]
  },
  {
    "id": 4,
    "title": "Light, Materials & Aesthetics",
    "description": "The physical textures, light, and material palette of the space.",
    "questions": [
      {
        "id": "m4_altar_drama",
        "type": "scale",
        "text": "How much lighting drama should surround the altar?",
        "low_label": "Even, consistent lighting",
        "high_label": "Dramatic, focused illumination"
      },
      {
        "id": "m4_light_temp",
        "type": "scale",
        "text": "Overall lighting color temperature:",
        "low_label": "Warm (amber, golden, candlelight)",
        "high_label": "Bright (clear, white, daylight)"
      },
      {
        "id": "m4_nave_dimmer",
        "type": "scale",
        "text": "The nave should be dimmer than the sanctuary.",
        "low_label": "Same brightness throughout",
        "high_label": "Clear dimming in the nave, brighter sanctuary"
      },
      {
        "id": "m4_natural_light",
        "type": "scale",
        "text": "The space should rely on natural vs. artificial light.",
        "low_label": "Primarily artificial/controlled light",
        "high_label": "Primarily natural light"
      },
      {
        "id": "m4_stained_glass",
        "type": "single_choice",
        "text": "Stained glass preference:",
        "options": [
          "Traditional figurative (saints, scripture scenes)",
          "Abstract/geometric with symbolic color",
          "Clear or lightly tinted glass for maximum daylight",
          "Mix of figurative and abstract",
          "No strong preference"
        ]
      },
      {
        "id": "m4_permanence",
        "type": "scale",
        "text": "Materials should prioritize...",
        "low_label": "Warmth and comfort (wood, fabric, carpet)",
        "high_label": "Permanence and weight (stone, marble, tile)"
      },
      {
        "id": "m4_richness",
        "type": "scale",
        "text": "The overall aesthetic should lean toward...",
        "low_label": "Simplicity and restraint",
        "high_label": "Richness and ornamentation"
      },
      {
        "id": "m4_timeless",
        "type": "scale",
        "text": "Design language should be...",
        "low_label": "Timeless and historical",
        "high_label": "Contemporary and fresh"
      },
      {
        "id": "m4_aging",
        "type": "scale",
        "text": "Finishes and surfaces should...",
        "low_label": "Age with grace (patina, natural wear)",
        "high_label": "Stay crisp and maintained"
      },
      {
        "id": "m4_100year",
        "type": "scale",
        "text": "How important is it that materials still look good in 100 years?",
        "low_label": "Less important than current beauty/cost",
        "high_label": "The most important material criterion"
      }
    ]
  },
  {
    "id": 5,
    "title": "Sacred Art & Imagery",
    "description": "The role of art, icons, statues, and imagery in the space.",
    "questions": [
      {
        "id": "a5_crucifix",
        "type": "scale",
        "text": "The crucifix should be...",
        "low_label": "Restrained and refined",
        "high_label": "Large, dominant, and unmissable"
      },
      {
        "id": "a5_marian",
        "type": "scale",
        "text": "Marian presence (statue, shrine, imagery) should be...",
        "low_label": "Subtle and integrated",
        "high_label": "Prominent and devotional"
      },
      {
        "id": "a5_saints",
        "type": "single_choice",
        "text": "How should saints be represented?",
        "options": [
          "Architectural integration (built into walls, niches, windows)",
          "Movable/seasonal (statues, icons that rotate)",
          "Both architectural and movable",
          "Minimal saint imagery"
        ]
      },
      {
        "id": "a5_catechize",
        "type": "scale",
        "text": "The walls and surfaces should actively catechize (teach the faith through imagery).",
        "low_label": "Clean walls, let the architecture speak",
        "high_label": "Rich visual storytelling throughout"
      }
    ]
  },
  {
    "id": 6,
    "title": "Feel & Atmosphere",
    "description": "The intangible qualities of the space. Trust your gut on these.",
    "questions": [
      {
        "id": "f6_majestic",
        "type": "scale",
        "text": "The space should feel...",
        "low_label": "Approachable and human-scaled",
        "high_label": "Majestic and awe-inspiring"
      },
      {
        "id": "f6_quiet",
        "type": "scale",
        "text": "The space should feel...",
        "low_label": "Quiet and still",
        "high_label": "Radiant and alive"
      },
      {
        "id": "f6_monastic",
        "type": "scale",
        "text": "The overall character should lean...",
        "low_label": "Monastic (spare, contemplative, focused)",
        "high_label": "Cathedral (grand, layered, celebratory)"
      },
      {
        "id": "f6_simple",
        "type": "scale",
        "text": "The interior should be...",
        "low_label": "Simple and unified",
        "high_label": "Layered and rich with detail"
      },
      {
        "id": "f6_smallness",
        "type": "scale",
        "text": "When you sit in the pew, you should feel...",
        "low_label": "Small before God (transcendence)",
        "high_label": "Embraced by God (immanence)"
      },
      {
        "id": "f6_not_want",
        "type": "open_text",
        "text": "What do you NOT want this space to feel like? (Name a church, a style, a feeling, anything.)"
      },
      {
        "id": "f6_diversity",
        "type": "scale",
        "text": "The diverse community of the parish should be reflected in the physical space.",
        "low_label": "The space should be universal, not reflecting any particular culture",
        "high_label": "The space should visibly celebrate the parish's diversity"
      }
    ]
  },
  {
    "id": 7,
    "title": "Courage & Priorities",
    "description": "How bold are you willing to be? What matters most when trade-offs come?",
    "questions": [
      {
        "id": "c7_boldness",
        "type": "scale",
        "text": "I am comfortable with a design that is bold and distinctive, even if it surprises people.",
        "low_label": "Play it safe, avoid controversy",
        "high_label": "Be bold, make a statement"
      },
      {
        "id": "c7_pushback",
        "type": "scale",
        "text": "I can handle pushback from parishioners if we make the right decision.",
        "low_label": "We need broad consensus first",
        "high_label": "We should lead, even if some disagree"
      },
      {
        "id": "c7_controversial",
        "type": "scale",
        "text": "I would stand by a decision I believe is right even if it is controversial.",
        "low_label": "Strongly prefer to avoid controversy",
        "high_label": "Will defend what is right"
      },
      {
        "id": "c7_priority",
        "type": "single_choice",
        "text": "If you could only optimize for one thing, which would it be?",
        "options": [
          "Beauty",
          "Durability",
          "Flexibility",
          "Cost-effectiveness",
          "Liturgical correctness"
        ]
      },
      {
        "id": "c7_hill",
        "type": "open_text",
        "text": "What is your architectural hill to die on? The one thing you will fight for in this renovation."
      },
      {
        "id": "c7_anything",
        "type": "open_text",
        "text": "Anything else you want the design team to know?"
      }
    ]
  }
];
