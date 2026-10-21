const en = {
  title: "Privacy · tensai",
  description:
    "What tensai keeps on your phone, what can leave it and to whom, which Android permissions it asks for, and what this website does.",
  heading: "Privacy",
  updated: "Last updated",
  summaryLabel: "Summary",
  summary: [
    "The app runs on your phone.",
    "It has no account and no telemetry.",
    "Internet tools only run if you turn them on.",
  ],
  stays: {
    heading: "What stays on the phone",
    paragraphs: [
      "Models, chats, the facts tensai remembers, saved sessions and settings are stored on your phone. tensai has no account, no server of its own and no sync.",
      "Models run on the phone's own CPU or GPU. What you type is processed on the device and is not sent anywhere to generate a reply.",
    ],
  },
  leaves: {
    heading: "What can leave it, and to whom",
    intro:
      "Some features need the network. They run only when you turn them on or ask for them. Each one sends what it needs to the service named below, and that service sees your IP address, as with any web request. Their own privacy policies apply.",
    items: [
      {
        term: "Hugging Face",
        text: "Model downloads. It receives requests for the model files you browse and download, and your access token if you added one for gated models.",
      },
      {
        term: "Web search",
        text: "Internet tools only, off by default. DuckDuckGo by default, with Wikipedia and Marginalia as fallbacks, or Tavily or Brave with your own key (the key goes to that provider). The provider receives the search query. The model writes the query from the whole conversation, which can include results of other tools (calendar, contacts, clipboard), so it can contain anything that is in the chat.",
      },
      {
        term: "Pages you ask it to read",
        text: "Internet tools only. The web_fetch tool opens pages you ask for, over HTTPS only. The model writes the URL from the whole conversation, which can include results of other tools too. The site of that page receives a normal request, as it would from a browser.",
      },
      {
        term: "Open-Meteo",
        text: "Weather questions, internet tools only. It receives the place you ask about, or the approximate location for \"here\".",
      },
      {
        term: "Wikipedia",
        text: "Lookups, internet tools only. It receives the article title or search term the model looks up.",
      },
    ],
    outro: "tensai has no account and sends no telemetry or analytics.",
  },
  permissions: {
    heading: "Android permissions and why",
    intro:
      "Internet and Alarms are granted by Android at install, without a prompt. The others are asked the first time a feature needs them. Those can be refused or revoked in Android settings; the related tool then stops working.",
    items: [
      {
        term: "Notifications",
        text: "Model load progress, and the notification shown while tensai keeps the loaded model running in the background (foreground service).",
      },
      {
        term: "Calendar (read)",
        text: "The read_calendar tool, when you ask about your schedule. Adding an event goes through your calendar app.",
      },
      {
        term: "Contacts (read)",
        text: "The find_contact tool, to pick the right person when you ask for a message draft.",
      },
      {
        term: "Location (approximate)",
        text: "Weather and \"here\" questions.",
      },
      {
        term: "Internet",
        text: "Model downloads and, if you turn them on, internet tools.",
      },
      {
        term: "Alarms",
        text: "Setting alarms and timers through your clock app.",
      },
      {
        term: "Installed apps",
        text: "No permission involved. To offer phone actions, tensai can see which installed apps can handle them (timer, alarm, calendar, messages, e-mail, browser, media) and which apps can be opened. This stays on the phone, nothing is sent anywhere.",
      },
    ],
    outro:
      "tensai never sends a message itself. It opens your messaging or e-mail app with a draft, and you send it.",
  },
  website: {
    heading: "This website",
    paragraphs: [
      "tensai.page sets no cookies and runs no analytics or tracking scripts. Your theme choice is kept in your browser's local storage and never leaves it.",
      "The site is hosted by Cloudflare, which processes visitors' IP addresses to deliver the pages and protect the site from abuse.",
    ],
  },
  contact: {
    heading: "Contact",
    text: "Questions about privacy:",
  },
};

const fr: typeof en = {
  title: "Confidentialité · tensai",
  description:
    "Ce que tensai garde sur le téléphone, ce qui peut en sortir et vers qui, les permissions Android demandées, et ce que fait ce site.",
  heading: "Confidentialité",
  updated: "Dernière mise à jour",
  summaryLabel: "Résumé",
  summary: [
    "L'application tourne sur le téléphone.",
    "Elle n'a ni compte ni télémétrie.",
    "Les outils Internet ne tournent que s'ils sont activés.",
  ],
  stays: {
    heading: "Ce qui reste sur le téléphone",
    paragraphs: [
      "Les modèles, les conversations, les faits mémorisés par tensai, les sessions sauvegardées et les réglages sont stockés sur le téléphone. tensai n'a ni compte, ni serveur propre, ni synchronisation.",
      "Les modèles tournent sur le CPU ou le GPU du téléphone. Ce qui est saisi est traité sur l'appareil et n'est envoyé nulle part pour générer une réponse.",
    ],
  },
  leaves: {
    heading: "Ce qui peut en sortir, et vers qui",
    intro:
      "Certaines fonctions ont besoin du réseau. Elles ne tournent que lorsqu'elles sont activées ou demandées. Chacune envoie le nécessaire au service indiqué ci-dessous, et ce service voit l'adresse IP, comme pour toute requête web. Leurs propres politiques de confidentialité s'appliquent.",
    items: [
      {
        term: "Hugging Face",
        text: "Téléchargement des modèles. Il reçoit les requêtes pour les fichiers de modèles parcourus et téléchargés, et le jeton d'accès s'il a été ajouté pour les modèles à accès restreint.",
      },
      {
        term: "Recherche web",
        text: "Outils Internet uniquement, désactivés par défaut. DuckDuckGo par défaut, avec Wikipedia et Marginalia en repli, ou Tavily ou Brave avec une clé personnelle (la clé part chez ce fournisseur). Le fournisseur reçoit la requête de recherche. Le modèle écrit la requête à partir de toute la conversation, qui peut inclure des résultats d'autres outils (agenda, contacts, presse-papiers) : elle peut donc contenir tout ce qui figure dans le chat.",
      },
      {
        term: "Pages à lire",
        text: "Outils Internet uniquement. L'outil web_fetch ouvre les pages demandées, en HTTPS uniquement. Le modèle écrit l'URL à partir de toute la conversation, qui peut aussi inclure des résultats d'autres outils. Le site de la page reçoit une requête ordinaire, comme depuis un navigateur.",
      },
      {
        term: "Open-Meteo",
        text: "Questions météo, outils Internet uniquement. Il reçoit le lieu demandé, ou la position approximative pour « ici ».",
      },
      {
        term: "Wikipedia",
        text: "Recherches, outils Internet uniquement. Elle reçoit le titre d'article ou le terme que le modèle cherche.",
      },
    ],
    outro: "tensai n'a pas de compte et n'envoie ni télémétrie ni statistiques d'usage.",
  },
  permissions: {
    heading: "Permissions Android et pourquoi",
    intro:
      "Internet et Alarmes sont accordées par Android à l'installation, sans demande. Les autres sont demandées la première fois qu'une fonction en a besoin. Celles-ci peuvent être refusées ou retirées dans les réglages Android ; l'outil concerné cesse alors de fonctionner.",
    items: [
      {
        term: "Notifications",
        text: "Progression du chargement d'un modèle, et notification affichée pendant que tensai garde le modèle chargé actif en arrière-plan (service au premier plan).",
      },
      {
        term: "Agenda (lecture)",
        text: "L'outil read_calendar, quand une question porte sur l'emploi du temps. L'ajout d'un événement passe par l'application agenda.",
      },
      {
        term: "Contacts (lecture)",
        text: "L'outil find_contact, pour trouver la bonne personne quand un brouillon de message est demandé.",
      },
      {
        term: "Position (approximative)",
        text: "Questions météo et « ici ».",
      },
      {
        term: "Internet",
        text: "Téléchargement des modèles et, s'ils sont activés, outils Internet.",
      },
      {
        term: "Alarmes",
        text: "Programmer des alarmes et minuteurs via l'application horloge.",
      },
      {
        term: "Applications installées",
        text: "Aucune permission en jeu. Pour proposer des actions sur le téléphone, tensai peut voir quelles applications installées savent les traiter (minuteur, alarme, agenda, messages, e-mail, navigateur, média) et lesquelles peuvent être ouvertes. Cela reste sur le téléphone, rien n'est envoyé.",
      },
    ],
    outro:
      "tensai n'envoie jamais de message lui-même. Il ouvre l'application de messagerie ou de mail avec un brouillon, et l'envoi reste manuel.",
  },
  website: {
    heading: "Ce site",
    paragraphs: [
      "tensai.page ne dépose aucun cookie et n'exécute aucun script d'analyse ou de suivi. Le choix de thème est conservé dans le stockage local du navigateur et n'en sort pas.",
      "Le site est hébergé par Cloudflare, qui traite les adresses IP des visiteurs pour délivrer les pages et protéger le site des abus.",
    ],
  },
  contact: {
    heading: "Contact",
    text: "Questions sur la confidentialité :",
  },
};

export const privacy = { en, fr };
