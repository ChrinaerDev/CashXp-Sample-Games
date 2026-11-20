export const manifest = {
  id: "snake-reference",
  version: "1.2.1",
  apiVersion: 1,
  entry: "game.min.js",
  renderer: "canvas2d",
  engine: { apiVersion: 1, minVersion: "1.0.0", maxVersionExclusive: "2.0.0" },
  orientation: "any",
  genre: "Arcade",
  durationSeconds: 60,
  media: {
    wide: "media/cover-wide.png",
    square: "media/cover-square.png",
    logo: "media/logo.png",
  },
  settings: [
    {
      id: "difficulty",
      type: "range",
      label: "Speed",
      min: 1,
      max: 10,
      step: 1,
      default: 4,
    },
    {
      id: "wrapEdges",
      type: "boolean",
      label: "Wrap around walls",
      default: false,
    },
    {
      id: "theme",
      type: "select",
      label: "Snake color",
      options: ["Aurora", "Midnight", "Ember"],
      default: "Aurora",
    },
    {
      id: "points",
      type: "number",
      label: "Points per orb",
      min: 1,
      max: 100,
      step: 1,
      default: 10,
    },
  ],
};

export const copy = {
  en: {
    title: "Snake",
    rules:
      "Avoid your tail. The clock keeps running during pauses. Your score waits for an opponent before the match result is decided.",
    manual:
      "# Controls\nUse **arrow keys** or swipe to turn.\n\n![Snake arena](assets/tutorial-scene.png)\n\n## Scoring\nCollect gold orbs to earn points.",
    description:
      "Guide a growing snake across the arena and collect as many orbs as you can.",
    goal: "Earn points by collecting orbs. Avoid your tail and, when wrapping is off, the walls.",
    tutorial: [
      { text: "Use arrow keys or swipe to turn." },
      { text: "Collect the gold orbs before time runs out." },
    ],
  },
  fr: {
    title: "Snake",
    rules:
      "Évitez votre queue. Le temps continue pendant les pauses. Le résultat du match attend le score d’un adversaire.",
    manual:
      "# Commandes\nUtilisez les **flèches** ou balayez pour tourner.\n\n![Arène Snake](assets/tutorial-scene.png)\n\n## Points\nRamassez les orbes dorés pour gagner des points.",
    description:
      "Dirigez un serpent qui grandit et ramassez autant d’orbes que possible.",
    goal: "Gagnez des points en ramassant des orbes. Évitez votre queue et les murs si la traversée est désactivée.",
    tutorial: [
      { text: "Utilisez les flèches ou balayez l’écran pour tourner." },
      { text: "Ramassez les orbes dorés avant la fin du temps." },
    ],
  },
};
