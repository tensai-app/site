const en = {
  title: "Contribute · tensai",
  description:
    "Three ways to help tensai: report how it runs on your phone, request or test a model, or send code. What a report holds, and what stays private.",
  heading: "Contribute",
  lead: "tensai is built and tested on one phone. Three ways to help, shortest first.",
  test: {
    heading: "Test on your phone",
    intro: "No code needed. Five minutes and a GitHub account.",
    pendingNote:
      "The benchmark ships in the version after v{version}, which is the current release. Until that version is out, the Benchmark entry is not in the app.",
    steps: [
      { text: "Install the APK from GitHub releases, in a version that has the benchmark.", linkLabel: "Open releases" },
      { text: "Load a model.", linkLabel: "" },
      { text: "Settings, This device, Benchmark. Run it (2 to 5 minutes, you can stop it), then tap Copy.", linkLabel: "" },
      { text: "Open a Device report issue and paste what you copied.", linkLabel: "Open a Device report" },
    ],
    why: "Why it matters: the maintainer has one test phone, a Dimensity 900. It cannot say what happens on other SoCs, GPUs and RAM sizes. The reports are what the fit rating and the backend defaults get recalibrated on, by hand. Nothing is tuned automatically.",
  },
  model: {
    heading: "Request or test a model",
    text: "A model you want in the list, or one you tried and want to report on (works, slow, crashes): open a model request.",
    linkLabel: "Open a model request",
  },
  code: {
    heading: "Send code",
    intro: "Each repo has a CONTRIBUTING.md: how to run it, where things are, the checks to pass, the commit format.",
    repos: [
      { term: "tensai", text: "The Android app, Kotlin and Compose." },
      { term: "llama.kt", text: "The JNI binding to llama.cpp." },
      { term: "site", text: "This website and the docs." },
    ],
    linkLabel: "CONTRIBUTING.md",
  },
  data: {
    heading: "What a report holds",
    paragraphs: [
      "The app sends nothing. A report holds only what you paste. Issues are public on GitHub: read the text before you submit it.",
    ],
    intro: "The Benchmark output holds:",
    items: [
      "app version, phone model, SoC, RAM, Android version",
      "model, quantization, backend, thread count",
      "speeds, charging state, thermal state",
    ],
    outro: "It holds no conversation content.",
  },
};

const fr: typeof en = {
  title: "Contribuer · tensai",
  description:
    "Trois façons d'aider tensai : rapporter comment il tourne sur ton téléphone, demander ou tester un modèle, ou envoyer du code. Ce que contient un rapport.",
  heading: "Contribuer",
  lead: "tensai est construit et testé sur un seul téléphone. Trois façons d'aider, de la plus courte à la plus longue.",
  test: {
    heading: "Tester sur ton téléphone",
    intro: "Pas de code. Cinq minutes et un compte GitHub.",
    pendingNote:
      "Le benchmark arrive dans la version après la v{version}, qui est la version actuelle. Tant qu'elle n'est pas sortie, l'entrée Benchmark n'est pas dans l'app.",
    steps: [
      { text: "Installe l'APK depuis les releases GitHub, dans une version qui a le benchmark.", linkLabel: "Ouvrir les releases" },
      { text: "Charge un modèle.", linkLabel: "" },
      { text: "Paramètres, Cet appareil, Benchmark. Lance-le (2 à 5 minutes, tu peux l'arrêter), puis touche Copier.", linkLabel: "" },
      { text: "Ouvre une issue Device report et colles-y ce que tu as copié.", linkLabel: "Ouvrir un Device report" },
    ],
    why: "Pourquoi c'est utile : le mainteneur n'a qu'un téléphone de test, un Dimensity 900. Il ne peut rien dire de ce qui se passe sur d'autres SoC, d'autres GPU et d'autres quantités de RAM. Les rapports servent à recalibrer, à la main, la note d'adéquation et les backends par défaut. Rien n'est réglé automatiquement.",
  },
  model: {
    heading: "Demander ou tester un modèle",
    text: "Un modèle que tu veux dans la liste, ou un modèle essayé dont tu veux rendre compte (marche, lent, plante) : ouvre une demande de modèle.",
    linkLabel: "Ouvrir une demande de modèle",
  },
  code: {
    heading: "Envoyer du code",
    intro: "Chaque dépôt a un CONTRIBUTING.md : comment le lancer, où sont les choses, les vérifications à passer, le format des commits.",
    repos: [
      { term: "tensai", text: "L'application Android, Kotlin et Compose." },
      { term: "llama.kt", text: "Le binding JNI de llama.cpp." },
      { term: "site", text: "Ce site et les docs." },
    ],
    linkLabel: "CONTRIBUTING.md",
  },
  data: {
    heading: "Ce que contient un rapport",
    paragraphs: [
      "L'app n'envoie rien. Un rapport ne contient que ce que tu colles. Les issues sont publiques sur GitHub : relis le texte avant de l'envoyer.",
    ],
    intro: "La sortie du Benchmark contient :",
    items: [
      "version de l'app, modèle du téléphone, SoC, RAM, version d'Android",
      "modèle, quantification, backend, nombre de threads",
      "vitesses, état de charge, état thermique",
    ],
    outro: "Elle ne contient aucun contenu de conversation.",
  },
};

export const contribute = { en, fr };
