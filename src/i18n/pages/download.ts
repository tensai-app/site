const en = {
  title: "Download",
  description: "tensai is not public yet. The first public release is 1.0. Requirements for Android phones.",
  heading: "Download",
  notice: {
    text: "tensai is not public yet. The first public release is 1.0.",
    changelog: "Follow the changelog",
    engine: "is already on GitHub",
  },
  requirements: {
    heading: "Requirements",
    items: [
      { label: "Android 10 or newer", detail: "" },
      { label: "64-bit ARM", detail: "arm64-v8a" },
      { label: "Storage for models", detail: "" },
    ],
    fit: "Phones are slow on big models. tensai measures the phone's memory and rates every model before you download it.",
    fitLabels: ["Runs well", "Tight fit", "Won't fit"],
  },
};

const fr: typeof en = {
  title: "Télécharger",
  description: "tensai n'est pas encore public. La première version publique sera la 1.0. Prérequis pour les téléphones Android.",
  heading: "Télécharger",
  notice: {
    text: "tensai n'est pas encore public. La première version publique sera la 1.0.",
    changelog: "Suivre le changelog",
    engine: "est déjà sur GitHub",
  },
  requirements: {
    heading: "Prérequis",
    items: [
      { label: "Android 10 ou plus récent", detail: "" },
      { label: "ARM 64 bits", detail: "arm64-v8a" },
      { label: "Stockage pour les modèles", detail: "" },
    ],
    fit: "Les téléphones sont lents sur les gros modèles. tensai mesure la mémoire de l'appareil et note chaque modèle avant le téléchargement.",
    fitLabels: ["Passe bien", "Juste", "Ne passe pas"],
  },
};

export const download = { en, fr };
