const en = {
  title: "tensai · AI models on your Android phone",
  description:
    "tensai runs open models on your Android phone: chat, reasoning and an agent that can act. No account, no cloud. Open source, public release with 1.0.",
  hero: {
    markLabel: "天, the tensai mark",
    heading: "Your phone, your AI.",
    sub: "tensai runs open models directly on your Android phone. Chat, reasoning and an agent that can act, with nothing leaving the device unless you ask for it.",
    cta: "Download, soon",
    ctaNote: "Public release with 1.0",
    how: "How it works",
    engine: "llama.kt is already public",
    shotAlt: "A tensai chat: a short reply to a question about phone battery, with its speed stats under the reply",
  },
  pillars: [
    {
      icon: "smartphone",
      title: "On the device",
      text: "Models run on your phone's CPU or GPU through llama.cpp. Once a model is downloaded, tensai works offline.",
    },
    {
      icon: "deployed_code",
      title: "Any open model",
      text: "Import a GGUF file or pick one from Hugging Face. A fit check rates it against your phone's memory.",
      fit: true,
    },
    {
      icon: "verified_user",
      title: "An agent, with guardrails",
      text: "Tools for dates, maths, memory, timers, calendar and messages. Anything that sends or deletes asks you first. Internet tools stay off until you enable them.",
    },
  ],
  fit: {
    label: "Fit check labels",
    ok: "Runs well",
    tight: "Tight fit",
    no: "Won't fit",
  },
  shots: {
    heading: "What it looks like",
    items: [
      {
        key: "picker",
        alt: "The model picker: the loaded model with a check, another model marked Tight fit, then Manage models and Discover models",
        caption: "Pick a model. The fit check shows what your phone can run.",
      },
      {
        key: "reasoning",
        alt: "A chat where the model is reasoning: the Thinking block is open under the question about whether 391 is a prime number",
        caption: "Read the model's reasoning, or fold it away.",
      },
      {
        key: "tool",
        alt: "A tool call waiting for confirmation: tensai wants to delete a fact from memory, with Deny and Allow",
        caption: "Anything that deletes or sends waits for your answer.",
      },
      {
        key: "context",
        alt: "The context sheet: how much of the window is used, the runtime and the agent's tool calls",
        caption: "See what fills the context, agent activity included.",
      },
    ],
  },
  numbers: {
    heading: "Measured",
    text: "Your phone will differ. Big models are slow on phones; tensai tells you before you download.",
    setup: "Dimensity 900 · Qwen3 1.7B Q4_K_M · CPU",
    rows: [
      { label: "first message once ready", value: "~1 s" },
      { label: "reply speed", value: "~5.5 tok/s", accent: true },
      { label: "model load", value: "~7 s" },
    ],
    note: "The tool list is prepared in the background after loading, about a minute on this phone.",
  },
  next: {
    heading: "Coming next",
    items: ["MCP and skills", "1.0: public release", "API server on your network"],
  },
  band: {
    text: "Apache 2.0. The engine, llama.kt, is already public.",
    github: "llama.kt on GitHub",
    docs: "Read the docs",
  },
};

const fr: typeof en = {
  title: "tensai · Des modèles d'IA sur le téléphone Android",
  description:
    "tensai fait tourner des modèles ouverts sur Android : chat, raisonnement et agent capable d'agir. Sans compte ni cloud. Open source, publique avec la 1.0.",
  hero: {
    markLabel: "天, la marque tensai",
    heading: "Ton téléphone, ton IA.",
    sub: "tensai fait tourner des modèles ouverts directement sur le téléphone Android. Chat, raisonnement et un agent capable d'agir, sans que rien ne quitte l'appareil sauf demande explicite.",
    cta: "Télécharger, bientôt",
    ctaNote: "Version publique avec la 1.0",
    how: "Comment ça marche",
    engine: "llama.kt est déjà public",
    shotAlt: "Un chat tensai : une réponse courte à une question sur la batterie du téléphone, avec ses statistiques de vitesse sous la réponse",
  },
  pillars: [
    {
      icon: "smartphone",
      title: "Sur l'appareil",
      text: "Les modèles tournent sur le CPU ou le GPU du téléphone, via llama.cpp. Une fois un modèle téléchargé, tensai fonctionne hors ligne.",
    },
    {
      icon: "deployed_code",
      title: "Tout modèle ouvert",
      text: "Importer un fichier GGUF ou en choisir un sur Hugging Face. Un test d'adéquation le compare à la mémoire du téléphone.",
      fit: true,
    },
    {
      icon: "verified_user",
      title: "Un agent, avec des garde-fous",
      text: "Des outils pour les dates, le calcul, la mémoire, les minuteurs, l'agenda et les messages. Tout ce qui envoie ou supprime demande confirmation. Les outils Internet restent désactivés tant qu'ils ne sont pas activés.",
    },
  ],
  fit: {
    label: "Niveaux du test d'adéquation",
    ok: "Passe bien",
    tight: "Juste",
    no: "Ne passe pas",
  },
  shots: {
    heading: "À quoi ça ressemble",
    items: [
      {
        key: "picker",
        alt: "Le sélecteur de modèle : le modèle chargé avec une coche, un autre modèle marqué Juste, puis Gérer les modèles et Découvrir des modèles",
        caption: "Choisir un modèle. Le test d'adéquation montre ce que le téléphone peut faire tourner.",
      },
      {
        key: "reasoning",
        alt: "Un chat où le modèle raisonne : le bloc de réflexion est ouvert sous la question sur la primalité de 391",
        caption: "Lire le raisonnement du modèle, ou le replier.",
      },
      {
        key: "tool",
        alt: "Un appel d'outil en attente de confirmation : tensai veut supprimer un fait de la mémoire, avec Refuser et Autoriser",
        caption: "Tout ce qui supprime ou envoie attend une réponse.",
      },
      {
        key: "context",
        alt: "La feuille Contexte : la part de fenêtre utilisée, l'exécution et les appels d'outils de l'agent",
        caption: "Voir ce qui remplit le contexte, activité de l'agent comprise.",
      },
    ],
  },
  numbers: {
    heading: "Mesuré",
    text: "Les résultats varient selon le téléphone. Les gros modèles sont lents sur un téléphone : tensai prévient avant le téléchargement.",
    setup: "Dimensity 900 · Qwen3 1.7B Q4_K_M · CPU",
    rows: [
      { label: "premier message une fois prêt", value: "~1 s" },
      { label: "vitesse de réponse", value: "~5,5 tok/s", accent: true },
      { label: "chargement du modèle", value: "~7 s" },
    ],
    note: "La liste d'outils est préparée en arrière-plan après le chargement, environ une minute sur ce téléphone.",
  },
  next: {
    heading: "La suite",
    items: ["MCP et skills", "1.0 : version publique", "Serveur d'API sur le réseau local"],
  },
  band: {
    text: "Apache 2.0. Le moteur, llama.kt, est déjà public.",
    github: "llama.kt sur GitHub",
    docs: "Lire la doc",
  },
};

export const home = { en, fr };
