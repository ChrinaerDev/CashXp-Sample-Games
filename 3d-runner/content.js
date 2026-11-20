export const manifest = {
  id: "sky-runner-reference",
  version: "1.1.0",
  apiVersion: 1,
  entry: "game.min.js",
  renderer: "three",
  engine: { apiVersion: 1, minVersion: "1.0.0", maxVersionExclusive: "2.0.0" },
  orientation: "any",
  genre: "Action",
  durationSeconds: 60,
  media: {
    wide: "media/cover-wide.png",
    square: "media/cover-square.png",
    logo: "media/logo.png",
  },
  settings: [
    {
      id: "speed",
      label: "Running speed",
      type: "range",
      min: 6,
      max: 16,
      step: 1,
      default: 9,
    },
    { id: "obstacles", label: "Obstacles", type: "boolean", default: true },
    {
      id: "theme",
      label: "Track theme",
      type: "select",
      options: ["Aurora", "Sunset", "Midnight"],
      default: "Aurora",
    },
    {
      id: "coinPoints",
      label: "Points per crystal",
      type: "number",
      min: 1,
      max: 100,
      step: 1,
      default: 20,
    },
  ],
};
export const copy = {
  en: {
    title: "Sky Runner",
    rules:
      "A collision or falling ends the run. Pauses do not extend the timer. Match results wait for an opponent.",
    manual:
      "# Controls\n- **Left / Right:** switch lanes.\n- **Space / Up:** jump.\n- **Touch:** swipe to change lanes, tap or swipe up to jump.\n\n![Sky Runner track](assets/tutorial-scene.png)",
    description:
      "Run along a floating skyway, jump over barriers, and collect glowing crystals.",
    goal: "Cover the most distance and collect crystals. Jump over obstacles and stay on the platform.",
    tutorial: [
      {
        text: "Use the left and right arrows to change lanes. Press Space or Arrow Up to jump.",
      },
      {
        text: "On a phone, swipe left or right to change lanes and swipe up or tap to jump.",
      },
      {
        text: "Collect crystals for extra points. A collision or a fall ends your run.",
      },
    ],
  },
  fr: {
    title: "Sky Runner",
    rules:
      "Une collision ou une chute termine la partie. Les pauses ne prolongent pas le temps. Le résultat attend un adversaire.",
    manual:
      "# Commandes\n- **Gauche / Droite :** changer de voie.\n- **Espace / Haut :** sauter.\n- **Tactile :** balayez pour changer de voie, touchez ou balayez vers le haut pour sauter.\n\n![Piste Sky Runner](assets/tutorial-scene.png)",
    description:
      "Courez sur une piste suspendue, sautez les obstacles et ramassez les cristaux lumineux.",
    goal: "Parcourez la plus grande distance et ramassez les cristaux. Sautez les obstacles et restez sur la piste.",
    tutorial: [
      {
        text: "Utilisez les flèches gauche et droite pour changer de voie. Appuyez sur Espace ou la flèche haut pour sauter.",
      },
      {
        text: "Sur téléphone, balayez à gauche ou à droite pour changer de voie. Balayez vers le haut ou touchez pour sauter.",
      },
      {
        text: "Ramassez les cristaux pour gagner des points. Une collision ou une chute termine la partie.",
      },
    ],
  },
};
