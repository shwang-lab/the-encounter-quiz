// ============================================================
// English Through Films — The Encounter
// Listening Comprehension Quiz — 25 MCQ
// ============================================================

const QUIZ_TITLE = "English Through Films — The Encounter";
const QUIZ_SUBTITLE = "Listening Comprehension Quiz (25 Questions)";

// Each "block" is one audio clip. It covers one or more questions.
// questions[].correct is the 0-based index into options.
const QUIZ_BLOCKS = [
  {
    audio: "audio/q01.mp3",
    questions: [
      {
        num: 1,
        prompt: 'What does Catherine mean by "a fresh start"?',
        options: [
          "She wants to move to another country.",
          "She wants to return to her old routine.",
          "She wants to forget about her family.",
          "She wants to begin a new chapter in her life."
        ],
        correct: 3
      }
    ]
  },
  {
    audio: "audio/q02.mp3",
    questions: [
      {
        num: 2,
        prompt: 'What does Kayla mean when she says she is "just passing through"?',
        options: [
          "She is looking for a job in the area.",
          "She is returning home after living there.",
          "She is planning to move there permanently.",
          "She is only staying in the area temporarily."
        ],
        correct: 3
      }
    ]
  },
  {
    audio: "audio/q03.mp3",
    questions: [
      {
        num: 3,
        prompt: 'What is Nick doing when he asks, "If I say yes, will you let me through?"',
        options: [
          "He is asking for directions to Silverton.",
          "He is trying to find out whether admitting his identity will allow him to pass.",
          "He is asking the officer whether he can borrow a phone.",
          "He is apologizing for causing a traffic problem."
        ],
        correct: 1
      }
    ]
  },
  {
    audio: "audio/q04.mp3",
    questions: [
      {
        num: 4,
        prompt: 'What is Kayla implying when she says she had "hours before I would have died from exposure"?',
        options: [
          "She says she was already seriously injured.",
          "She believes the cold or conditions were dangerous, but she was not in immediate danger.",
          "She says she had been waiting for several days.",
          "She believes the road was completely safe."
        ],
        correct: 1
      }
    ]
  },
  {
    audio: "audio/q05.mp3",
    questions: [
      {
        num: 5,
        prompt: 'What does Kayla mean when she says, "I pay my own way"?',
        options: [
          "She wants someone else to pay for her meal.",
          "She wants to leave without ordering anything.",
          "She wants to lend money to Melissa.",
          "She wants to be financially independent rather than depend on other people."
        ],
        correct: 3
      }
    ]
  },
  {
    audio: "audio/q06.mp3",
    questions: [
      {
        num: 6,
        prompt: 'What does Jesus mean by "an offer you don\'t want to pass up"?',
        options: [
          "It is a warning that someone should ignore.",
          "It is an offer that must be accepted immediately because of a rule.",
          "It is a very good opportunity that someone should not reject.",
          "It is an offer that is probably too expensive."
        ],
        correct: 2
      }
    ]
  },
  {
    audio: "audio/q07.mp3",
    questions: [
      {
        num: 7,
        prompt: 'What does Catherine mean when she says she is "due back on planet Earth"?',
        options: [
          "She is telling the others that she is lost.",
          "She is saying that she has been physically away from Earth.",
          "She is preparing to travel into space.",
          "She is joking that she needs to return to reality and leave the unusual conversation."
        ],
        correct: 3
      }
    ]
  },
  {
    audio: "audio/q08.mp3",
    questions: [
      {
        num: 8,
        prompt: 'What does Catherine mean by "That puts him one up on you"?',
        options: [
          "He has defeated you in a competition.",
          "He has an advantage over you because he knows something before you do.",
          "He is physically stronger than you.",
          "He has earned more money than you."
        ],
        correct: 1
      }
    ]
  },
  {
    audio: "audio/q09.mp3",
    questions: [
      {
        num: 9,
        prompt: 'What does Jesus mean by "If I hadn\'t intervened tonight, you\'d be dead"?',
        options: [
          "Jesus is saying that Nick caused the accident.",
          "Jesus is warning Nick that he will die tomorrow.",
          "Jesus believes that his intervention prevented Nick from dying.",
          "Jesus is asking Nick to leave the diner."
        ],
        correct: 2
      }
    ]
  },
  {
    audio: "audio/q10.mp3",
    questions: [
      {
        num: 10,
        prompt: 'What does Nick mean by "in that department"?',
        options: [
          "He means in the dining area.",
          "He means inside a specific office.",
          "He means in that particular area or aspect of life.",
          "He means in a government department."
        ],
        correct: 2
      }
    ]
  },
  {
    audio: "audio/q11.mp3",
    questions: [
      {
        num: 11,
        prompt: 'What does Nick mean when he says, "I don\'t take you up on that offer"?',
        options: [
          "He is asking someone else to accept the offer.",
          "He is asking Jesus to repeat the offer.",
          "He is declining or refusing the offer.",
          "He is accepting the offer immediately."
        ],
        correct: 2
      }
    ]
  },
  {
    audio: "audio/q12.mp3",
    questions: [
      {
        num: 12,
        prompt: 'Why does Jesus respond, "Who do you say I am, Kayla?"',
        options: [
          "He wants Kayla to leave the diner.",
          "He wants Kayla to introduce him to Britney Spears.",
          "He wants Kayla to tell him her own name.",
          "He wants Kayla to explain what she herself believes about his identity."
        ],
        correct: 3
      }
    ]
  },
  {
    audio: "audio/q13.mp3",
    questions: [
      {
        num: 13,
        prompt: 'Who does "He" refer to in "How did he know that stuff about my boyfriend?"',
        options: ["Hank", "Jesus", "Officer Deville", "Nick"],
        correct: 1
      }
    ]
  },
  {
    audio: "audio/q14.mp3",
    questions: [
      {
        num: 14,
        prompt: 'What does Nick mean when he says Hank is "buying this whole Jesus thing"?',
        options: [
          "Hank is planning to work for Jesus.",
          "Hank is trying to sell something to Jesus.",
          "Hank is beginning to accept or believe in what Jesus is saying.",
          "Hank is spending money on religious items."
        ],
        correct: 2
      }
    ]
  },
  {
    audio: "audio/q15.mp3",
    questions: [
      {
        num: 15,
        prompt: 'What is the meaning of "going through a rough spot" in Jesus\'s description of Hank?',
        options: [
          "Recovering from a physical injury.",
          "Traveling through a dangerous place.",
          "Looking for a new place to live.",
          "Experiencing a difficult period in life."
        ],
        correct: 3
      }
    ]
  },
  {
    audio: "audio/q16.mp3",
    questions: [
      {
        num: 16,
        prompt: 'What can be inferred about Hank from his response, "There\'s more to life than money"?',
        options: [
          "He has decided to stop working permanently.",
          "He believes that important things in life go beyond financial wealth.",
          "He wants Nick to give him more money.",
          "He believes money is the most important thing in life."
        ],
        correct: 1
      }
    ]
  },
  {
    audio: "audio/q17_18.mp3",
    questions: [
      {
        num: 17,
        prompt: 'What does Hank mean by "Or he\'s a lunatic"?',
        options: [
          "Jesus may be a stranger who needs directions.",
          "Jesus may be angry with everyone.",
          "If Jesus is not who he claims to be, Hank thinks he may be mentally unstable.",
          "Jesus may be a very successful businessman."
        ],
        correct: 2
      },
      {
        num: 18,
        prompt: 'Why does Hank say he has "seen no evidence of him being crazy"?',
        options: [
          "Because Jesus's behavior has not given Hank a reason to think he is mentally unstable.",
          "Because Jesus has shown Hank his medical records.",
          "Because Nick told Hank that Jesus is normal.",
          "Because Hank has known Jesus for many years."
        ],
        correct: 0
      }
    ]
  },
  {
    audio: "audio/q19_20.mp3",
    questions: [
      {
        num: 19,
        prompt: 'Melissa says she is going "up north." What is she referring to?',
        options: [
          "A general location farther north from where they are.",
          "A specific building directly above them.",
          "A country outside the United States.",
          "A nearby restaurant."
        ],
        correct: 0
      },
      {
        num: 20,
        prompt: "Why does Melissa say that her boyfriend is a mining engineer?",
        options: [
          "She is telling Kayla that he owns the diner.",
          "She is asking Kayla to help him find a job.",
          "She is explaining where or why he is working in the area she is traveling to.",
          "She is explaining why she wants to become an engineer."
        ],
        correct: 2
      }
    ]
  },
  {
    audio: "audio/q21.mp3",
    questions: [
      {
        num: 21,
        prompt: 'Why does Nick ask, "What diner?"',
        options: [
          "He wants to know what food the diner serves.",
          "He is confused because Melissa refers to a diner that he does not believe exists on that road.",
          "He wants Melissa to pay for his meal.",
          "He is trying to remember the diner's phone number."
        ],
        correct: 1
      }
    ]
  },
  {
    audio: "audio/q22_23_24.mp3",
    questions: [
      {
        num: 22,
        prompt: "What does Jesus's response suggest about Kayla?",
        options: [
          "He does not understand Kayla at all.",
          "He wants Kayla to prepare dinner herself.",
          "He thinks Kayla is only interested in religion.",
          "He seems to know her desires and needs very well, including what she would like to eat."
        ],
        correct: 3
      },
      {
        num: 23,
        prompt: "Why does Jesus move from Kayla's larger desires to the question of dinner?",
        options: [
          "He wants Kayla to leave the diner.",
          "He is trying to change the subject because he is angry.",
          "He gives a humorous, concrete example of the difference between what someone wants and what she needs at the moment.",
          "He wants to avoid talking about Kayla's personal life."
        ],
        correct: 2
      },
      {
        num: 24,
        prompt: "What is the tone of Jesus's statement about Kayla's desires and the burrito?",
        options: [
          "Angry and threatening.",
          "Sad and apologetic.",
          "Playful and reassuring.",
          "Formal and distant."
        ],
        correct: 2
      }
    ]
  },
  {
    audio: "audio/q25.mp3",
    questions: [
      {
        num: 25,
        prompt: 'Why does Hank say, "We should\'ve picked her up"?',
        options: [
          "He realizes they made a mistake by not stopping to help Kayla.",
          "He wants Kayla to find another vehicle.",
          "He thinks Kayla should have stayed at the diner.",
          "He is asking Catherine to pick him up."
        ],
        correct: 0
      }
    ]
  }
];

// Flat list of all 25 questions, in order, each tagged with its block's audio file.
const QUIZ_QUESTIONS = QUIZ_BLOCKS.flatMap(block =>
  block.questions.map(q => ({ ...q, audio: block.audio }))
);

const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length; // 25
const MAX_PLAYS_PER_AUDIO = 2;
