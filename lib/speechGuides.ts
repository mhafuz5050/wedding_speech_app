import type { SpeechTypeSlug } from "@/lib/speechTypes";

export interface SpeechGuide {
  slug: string;
  speechTypeSlug: SpeechTypeSlug;
  title: string;
  description: string;
  intro: string;
  structure: { heading: string; description: string }[];
  mistakes: string[];
  exampleLines: string[];
}

const COMMON_STRUCTURE_TAIL = [
  {
    heading: "Wishes",
    description: "A few genuine, specific wishes for their future together.",
  },
  {
    heading: "The toast",
    description: "A short closing line that cues the room to raise a glass.",
  },
];

export const SPEECH_GUIDES: SpeechGuide[] = [
  {
    slug: "best-man-speech-guide",
    speechTypeSlug: "best-man",
    title: "Best Man Speech Guide",
    description:
      "How to structure a best man speech, how long it should be, and the mistakes to avoid.",
    intro:
      "Being best man means the room is on your side before you even start — they want you to do well. A good best man speech is warm, funny in the right places, and clearly about the groom, not about you.",
    structure: [
      {
        heading: "Opening hook",
        description:
          "Something that grabs attention in the first few lines — a short, true, specific line works better than a generic joke.",
      },
      {
        heading: "Who you are",
        description:
          "How you know the groom and how long you've known him — quick, so you can get to the good part.",
      },
      {
        heading: "Stories",
        description:
          "Two or three stories that show who he is — pick moments that made you laugh or that say something real about him.",
      },
      {
        heading: "Tribute",
        description:
          "A genuine, less jokey moment about the couple and what their relationship means.",
      },
      ...COMMON_STRUCTURE_TAIL,
    ],
    mistakes: [
      "Making it entirely about embarrassing him — a few laughs, then something real.",
      "Mentioning exes, in-jokes only three people understand, or anything that needs a trigger warning.",
      "Speaking on an empty stomach after too many drinks at the bar.",
      "Going long — aim for the time you actually planned for, not twice that.",
      "Forgetting to actually toast the couple at the end.",
    ],
    exampleLines: [
      "\"I've known James for twelve years, which means I've had twelve years to collect embarrassing stories — don't worry, I'm only using the good ones.\"",
      "\"The first time he told me about Sarah, he wouldn't stop talking about her laugh. Tonight, hearing it across the room, I finally understand why.\"",
    ],
  },
  {
    slug: "maid-of-honour-speech-guide",
    speechTypeSlug: "maid-of-honour",
    title: "Maid of Honour Speech Guide",
    description:
      "How to structure a maid of honour speech, how long it should be, and the mistakes to avoid.",
    intro:
      "A maid of honour speech works best when it feels like a close friend talking — proud, a little emotional, genuinely funny. It doesn't need to be polished; it needs to sound like you.",
    structure: [
      {
        heading: "Opening hook",
        description: "A warm, attention-grabbing first line — set the tone early.",
      },
      {
        heading: "Who you are",
        description: "How you know the bride, and how long you've been friends.",
      },
      {
        heading: "Stories",
        description:
          "A couple of stories that capture your friendship and who she is — funny is great, but pick ones that mean something.",
      },
      {
        heading: "Tribute",
        description: "What you've watched her partner bring out in her.",
      },
      ...COMMON_STRUCTURE_TAIL,
    ],
    mistakes: [
      "Reading it for the first time on the day — practise it out loud beforehand.",
      "Inside jokes that only make sense to you and the bride.",
      "Comparing the couple to your own relationship (or lack of one).",
      "Going over time — a tight 3–5 minutes lands better than a rambling 10.",
      "Forgetting to actually address the room, not just the bride.",
    ],
    exampleLines: [
      "\"Sarah and I have been best friends since we were eleven, which means I've seen every single version of her — and tonight might be the happiest one yet.\"",
      "\"I used to think I knew everything about her. Then James came along, and I watched her become even more herself.\"",
    ],
  },
  {
    slug: "father-of-the-bride-speech-guide",
    speechTypeSlug: "father-of-the-bride",
    title: "Father of the Bride Speech Guide",
    description:
      "How to structure a father of the bride speech, how long it should be, and the mistakes to avoid.",
    intro:
      "As father of the bride, you're often speaking first — setting the tone, welcoming everyone, and saying something true about your daughter before handing the room over to the rest of the evening.",
    structure: [
      {
        heading: "Welcome",
        description:
          "Thank everyone for coming, and welcome the new family joining yours.",
      },
      {
        heading: "Who you are",
        description: "A brief word on your role today — no need to over-explain it.",
      },
      {
        heading: "Stories",
        description:
          "A memory or two of your daughter growing up, and how you've watched her relationship grow.",
      },
      {
        heading: "Tribute",
        description: "What you've come to admire in her partner, in your own words.",
      },
      ...COMMON_STRUCTURE_TAIL,
    ],
    mistakes: [
      "Making it only about \"giving her away\" — modern speeches usually focus more on welcoming and celebrating.",
      "Going on too long about her childhood at the expense of the couple's future.",
      "Forgetting to formally welcome guests and thank the hosts, if that's expected at your venue.",
      "Reading from a phone with the screen dimming mid-sentence — print it out.",
      "Skipping practice — a steady, unhurried delivery matters more than clever lines here.",
    ],
    exampleLines: [
      "\"To everyone who's travelled to be here today — thank you, and welcome. Today isn't just a wedding; it's the day our family gets a little bigger.\"",
      "\"I've watched Sarah grow into the woman standing up there for twenty-eight years. I can tell you: James, you're getting the best of us.\"",
    ],
  },
  {
    slug: "groom-speech-guide",
    speechTypeSlug: "groom",
    title: "Groom Speech Guide",
    description:
      "How to structure a groom speech, how long it should be, and the mistakes to avoid.",
    intro:
      "The groom speech usually comes with thank-yous to get through before you get to the part everyone's really listening for — what you have to say about your new spouse.",
    structure: [
      {
        heading: "Thank-yous",
        description:
          "Thank both families, the wedding party, and anyone who helped make the day happen.",
      },
      {
        heading: "Opening hook",
        description: "A line that moves things from thank-yous into something more personal.",
      },
      {
        heading: "Your story",
        description: "How you met, or a moment that captures your relationship well.",
      },
      {
        heading: "Tribute to your partner",
        description:
          "The main event — what you love about them, in your own words, not a card.",
      },
      ...COMMON_STRUCTURE_TAIL,
    ],
    mistakes: [
      "Forgetting someone in the thank-yous — write the list down first, separately.",
      "Making the tribute vague (\"you're amazing\") instead of specific (\"you drove four hours in a storm to be there\").",
      "Trying to be funnier than the best man — that's not the job here.",
      "Not mentioning your new in-laws, if that fits your family.",
      "Rushing the ending — slow down for the last line, then raise your glass.",
    ],
    exampleLines: [
      "\"Before I say anything else, I need to thank the two people who somehow raised me well enough that Sarah said yes.\"",
      "\"People ask when I knew. It was the drive back from that terrible camping trip, soaked through, laughing so hard I nearly missed the turning — that's when I knew.\"",
    ],
  },
];

export function getSpeechGuide(slug: string): SpeechGuide | undefined {
  return SPEECH_GUIDES.find((guide) => guide.slug === slug);
}
