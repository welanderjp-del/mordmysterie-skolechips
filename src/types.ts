export type Language = 'da' | 'en' | 'de';

export interface Translation {
  title: string;
  intro: string;
  timeLabel: string;
  noTime: string;
  minutes: string;
  startButton: string;
  who: string;
  what: string;
  where: string;
  when: string;
  backButton: string;
  timeUp: string;
  nextRound: string;
}

export const translations: Record<Language, Translation> = {
  da: {
    title: "Vidnet med Hukommelsestab",
    intro: "Hvem, hvad, hvor og hvornår? Du har glemt alt! Beskriv billederne for din makker uden at bruge ordet på kortet.",
    timeLabel: "Tid pr. runde:",
    noTime: "Ingen tid",
    minutes: "min",
    startButton: "Start Mysteriet",
    who: "Hvem",
    what: "Hvad",
    where: "Hvor",
    when: "Hvornår",
    backButton: "Menu",
    timeUp: "Tiden er gået!",
    nextRound: "Næste runde",
  },
  en: {
    title: "Amnesiac Witness",
    intro: "Who, what, where, and when? You've forgotten everything! Describe the images to your partner without using the word on the card.",
    timeLabel: "Time per round:",
    noTime: "No limit",
    minutes: "min",
    startButton: "Start Mystery",
    who: "Who",
    what: "What",
    where: "Where",
    when: "When",
    backButton: "Menu",
    timeUp: "Time's up!",
    nextRound: "Next round",
  },
  de: {
    title: "Zeuge mit Amnesie",
    intro: "Wer, was, wo und wann? Du hast alles vergessen! Beschreibe deinem Partner die Bilder, ohne das Wort auf der Karte zu nennen.",
    timeLabel: "Zeit pro Runde:",
    noTime: "Kein Limit",
    minutes: "Min",
    startButton: "Rätsel starten",
    who: "Wer",
    what: "Was",
    where: "Wo",
    when: "Wann",
    backButton: "Menü",
    timeUp: "Zeit ist um!",
    nextRound: "Nächste Runde",
  },
};

export interface MysteryItem {
  id: string;
  da: string;
  en: string;
  de: string;
  imageSeed: string;
}

export interface MysteryState {
  who: MysteryItem;
  what: MysteryItem;
  where: MysteryItem;
  when: MysteryItem;
}
