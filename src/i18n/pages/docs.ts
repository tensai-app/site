/**
 * The docs: one article per page, written from the app's own code and strings (nothing here is a promise the app does not keep).
 * Inline markup in text: `code` and [label](/locale-less/path/). Blocks are rendered by src/views/Docs.astro.
 */
export type Block =
  | { t: "p"; x: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "note"; title: string; x: string }
  | { t: "code"; label: string; text: string; accent?: string }
  | { t: "dl"; items: [string, string][]; mono?: boolean }
  | { t: "h3"; id: string; x: string }
  | { t: "fit" }
  | { t: "measured" }
  | { t: "numbers" }
  | { t: "shot"; name: string; alt: string; caption: string }
  | { t: "faq"; items: { q: string; a: string }[] };

export interface Section {
  id: string;
  h: string;
  blocks: Block[];
}

export interface Article {
  /** Page title (h1), also the label in the menus. */
  title: string;
  /** Meta description, 120 to 160 characters. */
  description: string;
  lead: string;
  sections: Section[];
}

export const slugs = ["install", "first-model", "import-gguf", "huggingface", "tools", "performance", "faq"] as const;
export type Slug = (typeof slugs)[number];

/** Locale-less route of each article. The install page is the docs home. */
export const routes: Record<Slug, string> = {
  install: "/docs/",
  "first-model": "/docs/first-model/",
  "import-gguf": "/docs/import-gguf/",
  huggingface: "/docs/huggingface/",
  tools: "/docs/tools/",
  performance: "/docs/performance/",
  faq: "/docs/faq/",
};

/** Sidebar: groups open on their articles, the rest are single links. "privacy" is the existing page. */
export const nav: ({ group: string; items: Slug[] } | { item: Slug | "privacy" })[] = [
  { group: "start", items: ["install"] },
  { group: "models", items: ["first-model", "import-gguf", "huggingface"] },
  { item: "tools" },
  { item: "performance" },
  { item: "privacy" },
  { item: "faq" },
];

/** Reading order, for the previous and next links. */
export const order: (Slug | "privacy")[] = ["install", "first-model", "import-gguf", "huggingface", "tools", "performance", "privacy", "faq"];

interface Chrome {
  docs: string;
  sectionsLabel: string;
  menu: string;
  groups: Record<"start" | "models", string>;
  onThisPage: string;
  previous: string;
  next: string;
  edit: string;
  copy: string;
  copied: string;
  fit: { classModel: string; classNote: string; model: string; file: string; fileShort: string; ram: string; unit: string; labels: [string, string, string]; region: string };
  measured: { model: string; quant: string; backend: string; pp: string; tg: string; faster: string; caption: string };
}

export interface DocsLocale {
  chrome: Chrome;
  articles: Record<Slug, Article>;
}

const en: DocsLocale = {
  chrome: {
    docs: "Docs",
    sectionsLabel: "Docs",
    menu: "Docs sections",
    groups: { start: "Getting started", models: "Models" },
    onThisPage: "On this page",
    previous: "Previous",
    next: "Next",
    edit: "Edit on GitHub",
    copy: "Copy",
    copied: "Copied",
    fit: { classModel: "{n}-class model, Q4", classNote: "The {n} row is a typical file of that class, not a model in tensai's list.", model: "Model", file: "File size", fileShort: "Size", ram: "Phone RAM", unit: "GB", labels: ["Runs well", "Tight fit", "Won't fit"], region: "Fit of each model by phone memory, scrolls sideways" },
    measured: { model: "Model", quant: "Quant", backend: "Backend", pp: "pp", tg: "tg", faster: "faster backend", caption: "Measured speed in tok/s, CPU and Vulkan" },
  },
  articles: {
    install: {
      title: "Install",
      description: "Install tensai on Android 10 or newer from the signed APK, and what the first launch asks. Not public yet: the first public release is 1.0.",
      lead: "tensai is not public yet. This is how installing will work at 1.0, and what the first launch does.",
      sections: [
        {
          id: "before",
          h: "Before you start",
          blocks: [
            { t: "note", title: "Not public yet", x: "The first public release is 1.0. Follow the [changelog](/changelog/) to know when it lands. The engine, llama.kt, is already on GitHub." },
            { t: "ul", items: ["Android 10 or newer.", "A 64-bit ARM phone (`arm64-v8a`).", "Storage for the models you choose. The ones tensai recommends are files from about 0.5 GB to 2.5 GB each."] },
          ],
        },
        {
          id: "install",
          h: "Install the APK",
          blocks: [
            { t: "ol", items: ["Get the APK from the [download page](/download/) or from the GitHub releases. At 1.0 it will be on both.", "Android asks once to allow installs from your browser or file manager. Allow it.", "Open tensai."] },
            { t: "p", x: "The APK is signed. The download page gives its SHA-256 and the signing certificate fingerprint, with the commands to check them." },
          ],
        },
        {
          id: "first-launch",
          h: "First launch",
          blocks: [
            { t: "p", x: "tensai starts with a short setup: theme and language. Then it suggests a first model that fits your phone, or lets you import a GGUF file you already have." },
            { t: "shot", name: "welcome", alt: "The welcome screen of tensai", caption: "The welcome screen. Everything runs on the phone." },
            { t: "p", x: "Next: [choose your first model](/docs/first-model/)." },
          ],
        },
        {
          id: "updates",
          h: "Updates",
          blocks: [
            { t: "p", x: "Updates are new APKs on the GitHub releases, with their checksums and release notes. [Obtainium](/download/#update-h) can watch them and update tensai for you. F-Droid is not available yet." },
            { t: "p", x: "What changed in each version is on the [changelog](/changelog/), and in the app under Settings, About, Version." },
          ],
        },
      ],
    },
    "first-model": {
      title: "Choose your first model",
      description: "How to pick a first model for tensai: what the file name says, how much memory each size needs, and what the fit check lights mean.",
      lead: "Start small. A model that fits comfortably is faster and more useful than a big one that barely loads.",
      sections: [
        {
          id: "start",
          h: "Start small",
          blocks: [
            { t: "p", x: "On first launch tensai suggests the biggest model of its built-in list that runs well on your phone, judged on your RAM, or the smallest one if none does. The other models of the list sit under it, each with its own verdict." },
            { t: "p", x: "Models of 1 to 2 billion parameters are the comfortable ones. Move up once you know how your phone handles them." },
            { t: "note", title: "The fit check does the maths", x: "tensai compares each model with your phone's memory and shows Runs well, Tight fit or Won't fit before anything downloads." },
          ],
        },
        {
          id: "file",
          h: "The file to look for",
          blocks: [
            { t: "p", x: "Models come as `GGUF` files. The file name tells you the model, its size and how it is compressed." },
            { t: "code", label: "file name", text: "Qwen_Qwen3-1.7B-Q4_K_M.gguf", accent: "Q4_K_M" },
            { t: "h3", id: "name", x: "Reading the name" },
            {
              t: "dl",
              mono: true,
              items: [
                ["Qwen3", "The model family."],
                ["1.7B", "Parameters, in billions. More parameters usually means a smarter model, and a slower one."],
                ["Q4_K_M", "The quantization: how much the weights are compressed. It is the one every model of tensai's built-in list uses."],
              ],
            },
          ],
        },
        {
          id: "size",
          h: "Size vs memory",
          blocks: [
            { t: "p", x: "The app's own verdict for a few models, by the amount of RAM of the phone. Your phone also needs room for the conversation itself, so a tight fit gets slower as chats grow." },
            { t: "fit" },
            { t: "p", x: "4 GB phones are at the limit. The table describes a phone class: the app checks your actual phone and the actual file." },
          ],
        },
        {
          id: "fit-check",
          h: "The fit check",
          blocks: [
            { t: "p", x: "Each model gets a light, computed on your phone from numbers the app can read: your total RAM and the model's file and shape." },
            {
              t: "dl",
              items: [
                ["Usable memory", "Your total RAM minus 1.5 GiB, kept for Android and your other apps."],
                ["What a model needs", "Its file, plus about 300 MiB of working buffers, plus a buffer and a KV cache that grow with the context. With the Auto context the verdict prices it at 4096 tokens, or the model's trained length if that is shorter, with an F16 cache. With a fixed size or Max, it uses the plan the load would really run."],
                ["Runs well", "It fits in the usable memory and is not expected to be slow."],
                ["Tight fit", "It loads, but it needs more than the memory free right now, or it is expected to be slow: models of 3.5 billion parameters or more, and the Gemma 3n and Gemma 4 families, are marked tight even when they fit."],
                ["Won't fit", "It needs more than the usable memory. For a file you imported, even the smallest context the load can shrink to (1024 tokens) does not fit."],
              ],
            },
            { t: "p", x: "Two more labels exist: Not supported, when the engine does not know the model's architecture yet, and Draft model, for speculative decoding heads that cannot run alone. Neither has a way to load." },
            { t: "p", x: "A red light does not forbid anything: Load anyway is there, kept quiet on purpose. On the model's detail page, Estimated memory shows the number behind the light." },
          ],
        },
        {
          id: "app",
          h: "In the app",
          blocks: [
            { t: "p", x: "Open the model picker from the chip in the input bar. Each model shows its quantization, file size, backend and fit for this phone. Manage models and Discover models are under the list." },
            { t: "shot", name: "picker", alt: "The model picker of tensai, with the fit label next to each model", caption: "The model picker. Each model shows its quantization, size, backend and fit for this phone." },
            { t: "p", x: "In Discover, Recommended for your device comes first, and the Fits my phone filter hides what would not load. See [Download from Hugging Face](/docs/huggingface/)." },
          ],
        },
      ],
    },
    "import-gguf": {
      title: "Import a GGUF file",
      description: "Import a GGUF model you already have on your phone into tensai: what the app does with the file, the chat template, and what the errors mean.",
      lead: "You already have a GGUF file on the phone. tensai can use it as it is.",
      sections: [
        {
          id: "import",
          h: "Import a file",
          blocks: [
            { t: "ol", items: ["Open Models, then Add a model, then From this phone: Import a GGUF file. On first launch the same button sits under the recommended model.", "Pick the file.", "Wait for the copy. The screen shows how much of the file is copied."] },
            { t: "p", x: "tensai copies the file into its own storage: the original stays where it was, and you need room for a second copy. It then reads the details of the model (architecture, parameters, quantization, context length) and adds it to Models, On device, with its fit verdict." },
          ],
        },
        {
          id: "errors",
          h: "When it does not work",
          blocks: [
            { t: "p", x: "A failed import keeps nothing. The card says Import didn't finish, with one of these reasons:" },
            { t: "ul", items: ["The file is already in your models.", "The file needs more space than is free: the card gives both sizes, and you can remove a model and try again.", "The file is not a GGUF model file, or the copy came out damaged.", "The copy stopped before it finished, and nothing was kept."] },
            { t: "p", x: "A model can also fail later, at load: Not supported means this build of the engine does not know the architecture yet. See [the fit check](/docs/first-model/#fit-check)." },
          ],
        },
        {
          id: "template",
          h: "Chat template",
          blocks: [
            { t: "p", x: "A model needs its chat template to know where a message starts and ends. By default tensai uses the template stored in the file, or guesses one from the model's name when the file has none." },
            { t: "p", x: "If the guess is wrong, set it by hand in the model's details: ChatML, Mistral, Llama 3, Gemma or Phi-3. Changing the template clears the saved sessions of that model and applies at the next load." },
            { t: "p", x: "Tools are only offered to models whose template supports them. See [Tools and permissions](/docs/tools/)." },
          ],
        },
        {
          id: "manage",
          h: "Re-import and delete",
          blocks: [
            { t: "p", x: "If the file goes missing, the model's page says so and offers Re-import. Delete model removes the file from your phone, and it cannot be undone. A loaded model cannot be deleted: unload it first." },
            { t: "p", x: "No file yet? [Download one from Hugging Face](/docs/huggingface/)." },
          ],
        },
      ],
    },
    huggingface: {
      title: "Download from Hugging Face",
      description: "Search Hugging Face from tensai, pick a GGUF file that fits your phone, download it, and add a token for gated models. What is sent and to whom.",
      lead: "tensai searches Hugging Face and downloads models itself. No account on tensai's side, an optional token on yours.",
      sections: [
        {
          id: "discover",
          h: "Search and discover",
          blocks: [
            { t: "p", x: "Models, then the Discover tab. It opens on Recommended for your device, then Popular on Hugging Face. Search by name, or paste the link of a repo or of a file: only Hugging Face links are accepted." },
            { t: "p", x: "Filter with Fits my phone, and sort by downloads, likes, recent or size. The badges tell what a model offers: Tools, Thinking, Vision, and Gated when it needs a licence." },
            { t: "shot", name: "firstmodel", alt: "The first-run model screen: a recommended model with its Download button and the Import a GGUF file link", caption: "The first-run model screen: a recommended model, its Download button, and Import a GGUF file under it." },
          ],
        },
        {
          id: "file",
          h: "Choose a file",
          blocks: [
            { t: "p", x: "A repo page lists the GGUF files a phone can load, each with its fit, and marks the Recommended one. The readme is there too. Download shows the size before you tap." },
          ],
        },
        {
          id: "downloads",
          h: "Downloads",
          blocks: [
            { t: "ul", items: ["Downloads run in the background and show their progress in a notification, with Pause and Cancel.", "Several downloads queue up. A paused or interrupted one resumes where it stopped.", "On mobile data tensai asks first. Settings, Downloads, Download on mobile data lets you allow it for good.", "A file that does not match the expected size or checksum fails instead of being added.", "When it is done, the model is in Models, On device, ready to load."] },
          ],
        },
        {
          id: "token",
          h: "Gated models and the token",
          blocks: [
            { t: "p", x: "Some models are gated: you accept their licence on the Hugging Face site, with your account. tensai cannot do that for you." },
            { t: "ol", items: ["Accept the licence on the model's Hugging Face page.", "Create a read token in your Hugging Face account settings.", "In tensai: Settings, Downloads, Hugging Face token. Paste it and save."] },
            { t: "p", x: "The token stays on the phone. tensai checks it when you save it; with no connection it says Token saved, but it could not be checked. If Hugging Face refuses it, replace it, or remove it to keep downloading public models." },
          ],
        },
        {
          id: "leaves",
          h: "What leaves the phone",
          blocks: [
            { t: "p", x: "Searching and downloading send requests to Hugging Face, which sees your IP address and, if you added one, your token. Nothing else goes out. See [Privacy](/privacy/)." },
          ],
        },
      ],
    },
    tools: {
      title: "Tools and permissions",
      description: "The three tiers of tensai's tools: on the phone, phone actions, Internet. What asks before it acts, what leaves the phone, and the Android permissions.",
      lead: "The model can call tools. You decide which tiers it may use, and what leaves the phone is limited to the Internet one.",
      sections: [
        {
          id: "tiers",
          h: "The three tiers",
          blocks: [
            { t: "p", x: "Settings, Tools has one switch per tier. Tools are only offered to models whose chat template supports them, and each call shows as a card in the chat: tap it to see its inputs and its output." },
            {
              t: "dl",
              items: [
                ["On this phone (on by default)", "Date and time, calculator, unit converter, time zones, device info, search in your chats, memory, ask you a question, clipboard, torch. No network, no permission."],
                ["Phone actions (on by default)", "Opens the right app with the result ready: a timer or an alarm in Clock, an event in Calendar, a draft in Messages or in your mail app, another app, a link, the media player. Also reads your contacts, your calendar and your approximate location when you ask, which needs Android permissions."],
                ["Internet (off by default)", "Web search, reading one web page, weather, Wikipedia."],
              ],
            },
            { t: "shot", name: "tool", alt: "A confirmation card in the chat: tensai wants to delete three facts from memory, with Deny and Allow", caption: "tensai asks before it deletes. Deny, or Allow." },
          ],
        },
        {
          id: "asks",
          h: "What asks first",
          blocks: [
            { t: "ul", items: ["Deleting a fact from memory and opening a link ask for your answer in the chat, with Deny and Allow. Stop cancels the whole turn.", "A phone action opens the other app with a draft, and you validate there. tensai never sends a message itself.", "Remembering a fact or listing the memory does not ask, but every call is shown. You can forget everything in Settings, Memory.", "A tool you turned off is not offered to the model at all."] },
          ],
        },
        {
          id: "permissions",
          h: "Android permissions",
          blocks: [
            { t: "p", x: "Internet and alarms are granted by Android at install, without a prompt. The others are asked the first time a feature needs them, and you can refuse or revoke them in Android settings: the tool that needs it then stops working." },
            {
              t: "dl",
              items: [
                ["Notifications", "Model load progress, and the notification shown while tensai keeps the model loaded in the background."],
                ["Contacts (read)", "To pick the right person for a message draft."],
                ["Calendar (read)", "When you ask about your schedule. Adding an event goes through your calendar app."],
                ["Location (approximate)", "Weather and questions about \"here\", to about 1 km."],
              ],
            },
          ],
        },
        {
          id: "leaves",
          h: "What leaves the phone",
          blocks: [
            { t: "p", x: "Only the Internet tier, and only once you turn it on. Each call shows where it went. The model writes the query from the whole conversation, so a search can contain anything that is in the chat, including the result of another tool." },
            {
              t: "dl",
              items: [
                ["Web search", "Your search provider: DuckDuckGo by default and without a key, with Wikipedia and Marginalia as fallbacks, or Brave or Tavily with your own API key, stored on the phone."],
                ["Reading a page", "The site of the page, over HTTPS, as a normal request."],
                ["Weather", "Open-Meteo, with the place you asked about or your approximate location."],
                ["Wikipedia", "The title or the term looked up."],
              ],
            },
            { t: "p", x: "No account, no telemetry. The full list, with the permissions, is on the [privacy page](/privacy/)." },
          ],
        },
      ],
    },
    performance: {
      title: "Performance",
      description: "CPU or Vulkan, how the context and the memory shape speed, and the speeds measured on a Dimensity 900 phone. What to try when tensai is slow.",
      lead: "A phone is not a server. Speed comes down to the model size, the backend and how much memory is left for the conversation.",
      sections: [
        {
          id: "backend",
          h: "CPU or Vulkan",
          blocks: [
            { t: "p", x: "Settings, Inference, Default backend: Auto picks CPU or Vulkan per model, CPU forces the processor, Vulkan runs the model on the GPU when the phone supports it. Auto is the recommended one." },
            { t: "p", x: "On the class of phone we measured, dense models (Llama, Qwen, Gemma) run fastest on the big CPU cores: this GPU has no cooperative-matrix path, so Vulkan loses on prompt processing and on generation. A few architectures are the other way round: for Phi and Gemma 3n the CPU path is slow, and Vulkan is faster at generating, though the CPU still wins on prompt processing." },
          ],
        },
        {
          id: "measured",
          h: "Measured on a phone",
          blocks: [
            { t: "p", x: "Your phone will differ. These are numbers, not promises." },
            { t: "numbers" },
            { t: "p", x: "The ~5.5 tok/s above is measured end to end in the app. This table is the engine's own benchmark, the one on the [llama.kt page](/llama-kt/): Qwen3-1.7B reads 5.9 tok/s on CPU there, so the two differ." },
            { t: "measured" },
          ],
        },
        {
          id: "context",
          h: "Context and memory",
          blocks: [
            { t: "p", x: "The context is what the model keeps in mind in a conversation. It takes memory, in a KV cache that grows with its length, so a longer context leaves less room for everything else." },
            {
              t: "dl",
              items: [
                ["Context length", "Settings, Inference. Auto is the most your phone's memory can hold, up to the length the model was trained on. 4K, 8K, 16K, 32K and Max are fixed sizes. A model can have its own setting."],
                ["Memory for Auto context", "How much of the memory Auto may use: more context, or more room left for Android and your other apps."],
                ["Too big", "If a size is too much for the phone, tensai says it starts at a smaller one. It first tries a more compact cache, then smaller contexts."],
              ],
            },
            { t: "p", x: "Changing the context clears the saved sessions of the models it applies to. The conversations stay." },
            { t: "shot", name: "context", alt: "The context sheet: how much of the window is used, the loaded model, the backend and the KV cache", caption: "The context sheet, from the ring in the chat header: what fills the window, the runtime, and the agent's activity." },
          ],
        },
        {
          id: "slow",
          h: "When it is slow",
          blocks: [
            { t: "ul", items: ["Pick a smaller model. A Tight fit model is slower by nature, see [the fit check](/docs/first-model/#fit-check).", "Look at the backend of the model in the picker, and try CPU or Vulkan by hand.", "Lower the context length, or the memory share of Auto.", "Close what you do not need: the verdict also softens to Tight fit when the phone is short of free memory.", "After a model loads, tensai prepares its tool list in the background: the first message of a new chat can wait for it."] },
          ],
        },
      ],
    },
    faq: {
      title: "FAQ",
      description: "Short answers: does tensai work offline, where your data goes, why it is slow on some phones, whether there is an iPhone version, and why not the Play Store.",
      lead: "Short answers to common questions.",
      sections: [
        {
          id: "questions",
          h: "Questions",
          blocks: [
            {
              t: "faq",
              items: [
                {
                  q: "Does it work offline?",
                  a: "Yes, once a model is on the phone. Chat, reasoning and the tools of the phone need no connection: what you type is processed on the device and is not sent anywhere to generate a reply. Only downloading a model and the Internet tools need the network.",
                },
                {
                  q: "Where does my data go?",
                  a: "Nowhere by default. Models, chats, memory and settings stay on the phone, and there is no account and no telemetry. A request leaves only to download a model (Hugging Face) or, if you turned them on, for the Internet tools. The details are on the [privacy page](/privacy/).",
                },
                {
                  q: "Why is it slow on my phone?",
                  a: "The model runs on your phone's own processor, and a phone is far from a server. On the phone we measured, Qwen3 1.7B replies at about 5.5 tokens/s, and the engine benchmark goes from 3.9 tokens/s for a 3B model to 0.2 for a 7B one on CPU. tensai marks models of 3.5 billion parameters or more as Tight fit, a rule of thumb. Try a smaller model, check the backend, lower the context. See [Performance](/docs/performance/).",
                },
                {
                  q: "Is there an iPhone version?",
                  a: "Not yet. tensai is an Android app today. An iOS version may come one day, but there is no plan or date for it.",
                },
                {
                  q: "Why not the Play Store?",
                  a: "Not for now. At 1.0, tensai comes as a signed APK from [this site](/download/) and GitHub releases, with F-Droid later. The official stores may follow one day, with no date.",
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

const fr: DocsLocale = {
  chrome: {
    docs: "Docs",
    sectionsLabel: "Docs",
    menu: "Sections de la doc",
    groups: { start: "Démarrer", models: "Modèles" },
    onThisPage: "Sur cette page",
    previous: "Précédent",
    next: "Suivant",
    edit: "Modifier sur GitHub",
    copy: "Copier",
    copied: "Copié",
    fit: { classModel: "Modèle de classe {n}, Q4", classNote: "La ligne {n} est un fichier typique de cette classe, pas un modèle de la liste de tensai.", model: "Modèle", file: "Taille du fichier", fileShort: "Taille", ram: "RAM du téléphone", unit: "Go", labels: ["Fonctionne bien", "Juste", "Ne tiendra pas"], region: "Adéquation de chaque modèle selon la mémoire du téléphone, défile sur le côté" },
    measured: { model: "Modèle", quant: "Quant", backend: "Backend", pp: "pp", tg: "tg", faster: "backend le plus rapide", caption: "Vitesse mesurée en tok/s, CPU et Vulkan" },
  },
  articles: {
    install: {
      title: "Installer",
      description: "Installer tensai sur Android 10 ou plus depuis l'APK signé, et ce que fait le premier lancement. Pas encore public : première version publique prévue en 1.0.",
      lead: "tensai n'est pas encore public. Voici comment l'installation se passera à la 1.0, et ce que fait le premier lancement.",
      sections: [
        {
          id: "before",
          h: "Avant de commencer",
          blocks: [
            { t: "note", title: "Pas encore public", x: "La première version publique sera la 1.0. Suis le [changelog](/changelog/) pour savoir quand elle sort. Le moteur, llama.kt, est déjà sur GitHub." },
            { t: "ul", items: ["Android 10 ou plus.", "Un téléphone ARM 64 bits (`arm64-v8a`).", "De la place pour les modèles que tu choisis. Ceux que tensai recommande sont des fichiers d'environ 0,5 Go à 2,5 Go chacun."] },
          ],
        },
        {
          id: "install",
          h: "Installer l'APK",
          blocks: [
            { t: "ol", items: ["Récupère l'APK sur la [page de téléchargement](/download/) ou sur les releases GitHub. À la 1.0 il sera aux deux endroits.", "Android demande une fois d'autoriser les installations depuis ton navigateur ou ton gestionnaire de fichiers. Autorise.", "Ouvre tensai."] },
            { t: "p", x: "L'APK est signé. La page de téléchargement donne son SHA-256 et l'empreinte du certificat de signature, avec les commandes pour les vérifier." },
          ],
        },
        {
          id: "first-launch",
          h: "Premier lancement",
          blocks: [
            { t: "p", x: "tensai démarre par un court réglage : thème et langue. Puis il propose un premier modèle qui tient sur ton téléphone, ou te laisse importer un fichier GGUF que tu as déjà." },
            { t: "shot", name: "welcome", alt: "L'écran d'accueil de tensai", caption: "L'écran d'accueil. Tout tourne sur le téléphone." },
            { t: "p", x: "Ensuite : [choisir son premier modèle](/docs/first-model/)." },
          ],
        },
        {
          id: "updates",
          h: "Mises à jour",
          blocks: [
            { t: "p", x: "Les mises à jour sont de nouveaux APK sur les releases GitHub, avec leurs sommes de contrôle et leurs notes de version. [Obtainium](/download/#update-h) peut les surveiller et mettre tensai à jour pour toi. F-Droid n'est pas encore disponible." },
            { t: "p", x: "Ce qui change à chaque version est dans le [changelog](/changelog/), et dans l'app sous Paramètres, À propos, Version." },
          ],
        },
      ],
    },
    "first-model": {
      title: "Choisir son premier modèle",
      description: "Choisir un premier modèle pour tensai : ce que dit le nom du fichier, la mémoire qu'il faut selon la taille, et le sens des voyants du test d'adéquation.",
      lead: "Commence petit. Un modèle qui tient large est plus rapide et plus utile qu'un gros qui charge à peine.",
      sections: [
        {
          id: "start",
          h: "Commencer petit",
          blocks: [
            { t: "p", x: "Au premier lancement, tensai propose le plus gros modèle de sa liste intégrée qui fonctionne bien sur ton téléphone, jugé sur ta RAM, ou le plus petit si aucun ne convient. Les autres modèles de la liste sont dessous, chacun avec son verdict." },
            { t: "p", x: "Les modèles de 1 à 2 milliards de paramètres sont les plus à l'aise. Monte quand tu sais comment ton téléphone les encaisse." },
            { t: "note", title: "Le test d'adéquation fait le calcul", x: "tensai compare chaque modèle à la mémoire de ton téléphone et affiche Fonctionne bien, Juste ou Ne tiendra pas avant tout téléchargement." },
          ],
        },
        {
          id: "file",
          h: "Le fichier à chercher",
          blocks: [
            { t: "p", x: "Les modèles sont des fichiers `GGUF`. Le nom du fichier dit le modèle, sa taille et sa compression." },
            { t: "code", label: "nom de fichier", text: "Qwen_Qwen3-1.7B-Q4_K_M.gguf", accent: "Q4_K_M" },
            { t: "h3", id: "name", x: "Lire le nom" },
            {
              t: "dl",
              mono: true,
              items: [
                ["Qwen3", "La famille du modèle."],
                ["1.7B", "Les paramètres, en milliards. Plus il y en a, plus le modèle est malin, et lent."],
                ["Q4_K_M", "La quantification : à quel point les poids sont compressés. C'est celle de tous les modèles de la liste intégrée de tensai."],
              ],
            },
          ],
        },
        {
          id: "size",
          h: "Taille et mémoire",
          blocks: [
            { t: "p", x: "Le verdict de l'app pour quelques modèles, selon la RAM du téléphone. Ton téléphone a aussi besoin de place pour la conversation elle-même : un modèle juste ralentit quand les chats s'allongent." },
            { t: "fit" },
            { t: "p", x: "Les téléphones de 4 Go sont à la limite. Le tableau décrit une classe de téléphone : l'app vérifie ton vrai téléphone et le vrai fichier." },
          ],
        },
        {
          id: "fit-check",
          h: "Le test d'adéquation",
          blocks: [
            { t: "p", x: "Chaque modèle reçoit un voyant, calculé sur ton téléphone avec des chiffres que l'app peut lire : ta RAM totale, et le fichier et la forme du modèle." },
            {
              t: "dl",
              items: [
                ["Mémoire utilisable", "Ta RAM totale moins 1,5 Gio, gardés pour Android et tes autres applis."],
                ["Ce dont un modèle a besoin", "Son fichier, plus environ 300 Mio de tampons de travail, plus un tampon et un cache KV qui grandissent avec le contexte. Avec le contexte Auto, le verdict le chiffre à 4096 tokens, ou à la longueur d'entraînement du modèle si elle est plus courte, avec un cache en F16. Avec une taille fixe ou Max, il prend le plan que le chargement suivrait vraiment."],
                ["Fonctionne bien", "Il tient dans la mémoire utilisable et ne devrait pas être lent."],
                ["Juste", "Il charge, mais il demande plus que la mémoire libre à cet instant, ou il devrait être lent : les modèles de 3,5 milliards de paramètres ou plus, et les familles Gemma 3n et Gemma 4, sont marqués juste même quand ils tiennent."],
                ["Ne tiendra pas", "Il demande plus que la mémoire utilisable. Pour un fichier importé, même le plus petit contexte auquel le chargement peut descendre (1024 tokens) ne tient pas."],
              ],
            },
            { t: "p", x: "Deux autres étiquettes existent : Non pris en charge, quand le moteur ne connaît pas encore l'architecture du modèle, et Modèle brouillon, pour les têtes de décodage spéculatif qui ne tournent pas seules. Aucune des deux ne peut se charger." },
            { t: "p", x: "Un voyant rouge n'interdit rien : Charger quand même est là, discret exprès. Dans la fiche du modèle, Mémoire estimée montre le chiffre derrière le voyant." },
          ],
        },
        {
          id: "app",
          h: "Dans l'app",
          blocks: [
            { t: "p", x: "Ouvre le sélecteur de modèle depuis la puce de la barre de saisie. Chaque modèle montre sa quantification, la taille du fichier, le backend et l'adéquation pour ce téléphone. Gérer les modèles et Découvrir des modèles sont sous la liste." },
            { t: "shot", name: "picker", alt: "Le sélecteur de modèle de tensai, avec l'étiquette d'adéquation à côté de chaque modèle", caption: "Le sélecteur de modèle. Chaque modèle montre sa quantification, sa taille, son backend et son adéquation pour ce téléphone." },
            { t: "p", x: "Dans Découvrir, Recommandés pour cet appareil vient en premier, et le filtre Tient sur mon téléphone cache ce qui ne chargerait pas. Voir [Télécharger depuis Hugging Face](/docs/huggingface/)." },
          ],
        },
      ],
    },
    "import-gguf": {
      title: "Importer un fichier GGUF",
      description: "Importer dans tensai un modèle GGUF déjà présent sur ton téléphone : ce que l'app fait du fichier, le modèle de chat, et le sens des erreurs.",
      lead: "Tu as déjà un fichier GGUF sur le téléphone. tensai peut l'utiliser tel quel.",
      sections: [
        {
          id: "import",
          h: "Importer un fichier",
          blocks: [
            { t: "ol", items: ["Ouvre Modèles, puis Ajouter un modèle, puis Depuis ce téléphone : Importer un fichier GGUF. Au premier lancement, le même bouton est sous le modèle recommandé.", "Choisis le fichier.", "Attends la copie. L'écran indique la part du fichier déjà copiée."] },
            { t: "p", x: "tensai copie le fichier dans son propre stockage : l'original reste où il était, et il faut de la place pour une seconde copie. Il lit ensuite les détails du modèle (architecture, paramètres, quantification, longueur de contexte) et l'ajoute à Modèles, Sur l'appareil, avec son verdict." },
          ],
        },
        {
          id: "errors",
          h: "Quand ça ne marche pas",
          blocks: [
            { t: "p", x: "Un import raté ne garde rien. La carte dit L'import n'a pas abouti, avec l'une de ces raisons :" },
            { t: "ul", items: ["Le fichier est déjà dans tes modèles.", "Le fichier demande plus de place que ce qui est libre : la carte donne les deux tailles, et tu peux retirer un modèle puis réessayer.", "Le fichier n'est pas un fichier de modèle GGUF, ou la copie est abîmée.", "La copie s'est arrêtée avant la fin, et rien n'a été gardé."] },
            { t: "p", x: "Un modèle peut aussi échouer plus tard, au chargement : Non pris en charge veut dire que cette version du moteur ne connaît pas encore l'architecture. Voir [le test d'adéquation](/docs/first-model/#fit-check)." },
          ],
        },
        {
          id: "template",
          h: "Modèle de chat",
          blocks: [
            { t: "p", x: "Un modèle a besoin de son modèle de chat pour savoir où un message commence et finit. Par défaut tensai utilise celui stocké dans le fichier, ou en devine un d'après le nom du modèle quand le fichier n'en a pas." },
            { t: "p", x: "Si la devinette est fausse, règle-le à la main dans les détails du modèle : ChatML, Mistral, Llama 3, Gemma ou Phi-3. Changer le modèle de chat efface les sessions sauvegardées de ce modèle et s'applique au prochain chargement." },
            { t: "p", x: "Les outils ne sont proposés qu'aux modèles dont le modèle de chat les gère. Voir [Outils et permissions](/docs/tools/)." },
          ],
        },
        {
          id: "manage",
          h: "Réimporter et supprimer",
          blocks: [
            { t: "p", x: "Si le fichier disparaît, la page du modèle le dit et propose Réimporter. Supprimer le modèle retire le fichier de ton téléphone, et c'est définitif. Un modèle chargé ne peut pas être supprimé : décharge-le d'abord." },
            { t: "p", x: "Pas encore de fichier ? [Télécharges-en un depuis Hugging Face](/docs/huggingface/)." },
          ],
        },
      ],
    },
    huggingface: {
      title: "Télécharger depuis Hugging Face",
      description: "Chercher sur Hugging Face depuis tensai, choisir un fichier GGUF qui tient sur ton téléphone, le télécharger, et ajouter un jeton pour les modèles restreints.",
      lead: "tensai cherche sur Hugging Face et télécharge les modèles lui-même. Pas de compte côté tensai, un jeton facultatif côté Hugging Face.",
      sections: [
        {
          id: "discover",
          h: "Chercher et découvrir",
          blocks: [
            { t: "p", x: "Modèles, puis l'onglet Découvrir. Il s'ouvre sur Recommandés pour cet appareil, puis Populaires sur Hugging Face. Cherche par nom, ou colle le lien d'un dépôt ou d'un fichier : seuls les liens Hugging Face sont acceptés." },
            { t: "p", x: "Filtre avec Tient sur mon téléphone, et trie par téléchargements, Likes, récence ou taille. Les badges disent ce qu'offre un modèle : Outils, Réflexion, Vision, et Restreint quand il demande une licence." },
            { t: "shot", name: "firstmodel", alt: "L'écran de modèle du premier lancement : un modèle recommandé avec son bouton Télécharger et le lien Importer un fichier GGUF", caption: "L'écran de modèle du premier lancement : un modèle recommandé, son bouton Télécharger, et Importer un fichier GGUF dessous." },
          ],
        },
        {
          id: "file",
          h: "Choisir un fichier",
          blocks: [
            { t: "p", x: "La page d'un dépôt liste les fichiers GGUF qu'un téléphone peut charger, chacun avec son adéquation, et marque le Recommandé. Le readme y est aussi. Télécharger affiche la taille avant que tu touches." },
          ],
        },
        {
          id: "downloads",
          h: "Téléchargements",
          blocks: [
            { t: "ul", items: ["Les téléchargements tournent en arrière-plan et montrent leur progression dans une notification, avec Pause et Annuler.", "Plusieurs téléchargements se mettent en file. Un téléchargement en pause ou interrompu reprend là où il s'était arrêté.", "En données mobiles, tensai demande d'abord. Paramètres, Téléchargements, Télécharger en données mobiles permet de l'autoriser définitivement.", "Un fichier dont la taille ou la somme de contrôle ne correspond pas échoue au lieu d'être ajouté.", "Une fois fini, le modèle est dans Modèles, Sur l'appareil, prêt à charger."] },
          ],
        },
        {
          id: "token",
          h: "Modèles restreints et jeton",
          blocks: [
            { t: "p", x: "Certains modèles sont restreints : tu acceptes leur licence sur le site de Hugging Face, avec ton compte. tensai ne peut pas le faire à ta place." },
            { t: "ol", items: ["Accepte la licence sur la page Hugging Face du modèle.", "Crée un jeton en lecture dans les paramètres de ton compte Hugging Face.", "Dans tensai : Paramètres, Téléchargements, Jeton Hugging Face. Colle-le et enregistre."] },
            { t: "p", x: "Le jeton reste sur le téléphone. tensai le vérifie à l'enregistrement ; sans connexion, il indique Jeton enregistré, mais il n'a pas pu être vérifié. Si Hugging Face le refuse, remplace-le, ou retire-le pour continuer à télécharger les modèles publics." },
          ],
        },
        {
          id: "leaves",
          h: "Ce qui sort du téléphone",
          blocks: [
            { t: "p", x: "Chercher et télécharger envoient des requêtes à Hugging Face, qui voit ton adresse IP et, si tu en as ajouté un, ton jeton. Rien d'autre ne sort. Voir [Confidentialité](/privacy/)." },
          ],
        },
      ],
    },
    tools: {
      title: "Outils et permissions",
      description: "Les trois niveaux d'outils de tensai : sur le téléphone, actions du téléphone, Internet. Ce qui demande avant d'agir, ce qui sort, et les permissions Android.",
      lead: "Le modèle peut appeler des outils. Tu décides des niveaux qu'il peut utiliser, et ce qui sort du téléphone se limite à celui d'Internet.",
      sections: [
        {
          id: "tiers",
          h: "Les trois niveaux",
          blocks: [
            { t: "p", x: "Paramètres, Outils a un interrupteur par niveau. Les outils ne sont proposés qu'aux modèles dont le modèle de chat les gère, et chaque appel apparaît comme une carte dans le chat : touche-la pour voir ses entrées et sa sortie." },
            {
              t: "dl",
              items: [
                ["Sur ce téléphone (activé par défaut)", "Date et heure, calculatrice, convertisseur d'unités, fuseaux horaires, infos de l'appareil, recherche dans tes chats, mémoire, te poser une question, presse-papiers, lampe torche. Pas de réseau, pas de permission."],
                ["Actions du téléphone (activé par défaut)", "Ouvre la bonne appli avec le résultat prêt : un minuteur ou une alarme dans Horloge, un évènement dans Agenda, un brouillon dans Messages ou dans ton appli de mail, une autre appli, un lien, le lecteur multimédia. Lit aussi tes contacts, ton agenda et ta position approximative quand tu le demandes, ce qui passe par des permissions Android."],
                ["Internet (désactivé par défaut)", "Recherche web, lecture d'une page web, météo, Wikipédia."],
              ],
            },
            { t: "shot", name: "tool", alt: "Une carte de confirmation dans le chat : tensai veut supprimer trois faits de la mémoire, avec Refuser et Autoriser", caption: "tensai demande avant de supprimer. Refuser, ou Autoriser." },
          ],
        },
        {
          id: "asks",
          h: "Ce qui demande d'abord",
          blocks: [
            { t: "ul", items: ["Supprimer un fait de la mémoire et ouvrir un lien demandent ta réponse dans le chat, avec Refuser et Autoriser. Stop annule tout le tour.", "Une action du téléphone ouvre l'autre appli avec un brouillon, et tu valides là-bas. tensai n'envoie jamais un message lui-même.", "Retenir un fait ou lister la mémoire ne demande rien, mais chaque appel est affiché. Tu peux tout oublier dans Paramètres, Mémoire.", "Un outil que tu as désactivé n'est pas du tout proposé au modèle."] },
          ],
        },
        {
          id: "permissions",
          h: "Permissions Android",
          blocks: [
            { t: "p", x: "Internet et alarmes sont accordés par Android à l'installation, sans demande. Les autres sont demandées la première fois qu'une fonction en a besoin, et tu peux les refuser ou les retirer dans les réglages Android : l'outil concerné cesse alors de marcher." },
            {
              t: "dl",
              items: [
                ["Notifications", "La progression du chargement d'un modèle, et la notification affichée pendant que tensai garde le modèle chargé en arrière-plan."],
                ["Contacts (lecture)", "Pour choisir la bonne personne pour un brouillon de message."],
                ["Agenda (lecture)", "Quand tu poses une question sur ton planning. Ajouter un évènement passe par ton appli d'agenda."],
                ["Position (approximative)", "La météo et les questions sur « ici », à environ 1 km."],
              ],
            },
          ],
        },
        {
          id: "leaves",
          h: "Ce qui sort du téléphone",
          blocks: [
            { t: "p", x: "Seulement le niveau Internet, et seulement une fois que tu l'actives. Chaque appel montre où il est parti. Le modèle écrit la requête à partir de toute la conversation : une recherche peut donc contenir tout ce qui est dans le chat, y compris le résultat d'un autre outil." },
            {
              t: "dl",
              items: [
                ["Recherche web", "Ton fournisseur de recherche : DuckDuckGo par défaut et sans clé, avec Wikipédia et Marginalia en secours, ou Brave ou Tavily avec ta propre clé d'API, stockée sur le téléphone."],
                ["Lecture d'une page", "Le site de la page, en HTTPS, comme une requête normale."],
                ["Météo", "Open-Meteo, avec le lieu demandé ou ta position approximative."],
                ["Wikipédia", "Le titre ou le terme cherché."],
              ],
            },
            { t: "p", x: "Pas de compte, pas de télémétrie. La liste complète, avec les permissions, est sur la [page de confidentialité](/privacy/)." },
          ],
        },
      ],
    },
    performance: {
      title: "Performances",
      description: "CPU ou Vulkan, comment le contexte et la mémoire jouent sur la vitesse, et les vitesses mesurées sur un Dimensity 900. Que faire quand tensai est lent.",
      lead: "Un téléphone n'est pas un serveur. La vitesse dépend de la taille du modèle, du backend et de la mémoire qui reste pour la conversation.",
      sections: [
        {
          id: "backend",
          h: "CPU ou Vulkan",
          blocks: [
            { t: "p", x: "Paramètres, Inférence, Backend par défaut : Auto choisit CPU ou Vulkan par modèle, CPU force le processeur, Vulkan fait tourner le modèle sur le GPU quand le téléphone le gère. Auto est le choix recommandé." },
            { t: "p", x: "Sur la classe de téléphone mesurée, les modèles denses (Llama, Qwen, Gemma) vont le plus vite sur les gros cœurs du CPU : ce GPU n'a pas de chemin cooperative-matrix, donc Vulkan perd en traitement du prompt comme en génération. Quelques architectures sont à l'inverse : pour Phi et Gemma 3n, le chemin CPU est lent et Vulkan génère plus vite, même si le CPU reste devant pour le traitement du prompt." },
          ],
        },
        {
          id: "measured",
          h: "Mesuré sur un téléphone",
          blocks: [
            { t: "p", x: "Ton téléphone sera différent. Ce sont des chiffres, pas des promesses." },
            { t: "numbers" },
            { t: "p", x: "Les ~5,5 tok/s ci-dessus sont mesurés de bout en bout dans l'app. Ce tableau est le benchmark du moteur seul, celui de la [page llama.kt](/llama-kt/) : Qwen3-1.7B y fait 5,9 tok/s sur CPU, les deux diffèrent donc." },
            { t: "measured" },
          ],
        },
        {
          id: "context",
          h: "Contexte et mémoire",
          blocks: [
            { t: "p", x: "Le contexte, c'est ce que le modèle garde en tête dans une conversation. Il prend de la mémoire, dans un cache KV qui grandit avec sa longueur : un contexte plus long laisse moins de place au reste." },
            {
              t: "dl",
              items: [
                ["Longueur de contexte", "Paramètres, Inférence. Auto, c'est le maximum que la mémoire de ton téléphone peut tenir, jusqu'à la longueur d'entraînement du modèle. 4K, 8K, 16K, 32K et Max sont des tailles fixes. Un modèle peut avoir son propre réglage."],
                ["Mémoire pour le contexte Auto", "La part de la mémoire qu'Auto peut utiliser : plus de contexte, ou plus de place laissée à Android et à tes autres applis."],
                ["Trop grand", "Si une taille est trop lourde pour le téléphone, tensai dit qu'il démarre plus bas. Il essaie d'abord un cache plus compact, puis des contextes plus petits."],
              ],
            },
            { t: "p", x: "Changer le contexte efface les sessions sauvegardées des modèles concernés. Les conversations restent." },
            { t: "shot", name: "context", alt: "La feuille Contexte : la part de fenêtre utilisée, le modèle chargé, le backend et le cache KV", caption: "La feuille Contexte, depuis l'anneau de l'en-tête du chat : ce qui remplit la fenêtre, l'exécution, et l'activité de l'agent." },
          ],
        },
        {
          id: "slow",
          h: "Quand c'est lent",
          blocks: [
            { t: "ul", items: ["Prends un modèle plus petit. Un modèle Juste est plus lent par nature, voir [le test d'adéquation](/docs/first-model/#fit-check).", "Regarde le backend du modèle dans le sélecteur, et essaie CPU ou Vulkan à la main.", "Baisse la longueur de contexte, ou la part de mémoire d'Auto.", "Ferme ce dont tu n'as pas besoin : le verdict passe aussi à Juste quand le téléphone manque de mémoire libre.", "Après le chargement d'un modèle, tensai prépare sa liste d'outils en arrière-plan : le premier message d'un nouveau chat peut l'attendre."] },
          ],
        },
      ],
    },
    faq: {
      title: "Questions fréquentes",
      description: "Réponses courtes : hors ligne, où vont tes données, pourquoi c'est lent sur certains téléphones, version iPhone, et pourquoi pas le Play Store.",
      lead: "Des réponses courtes aux questions qu'on pose souvent.",
      sections: [
        {
          id: "questions",
          h: "Questions",
          blocks: [
            {
              t: "faq",
              items: [
                {
                  q: "Ça marche hors ligne ?",
                  a: "Oui, dès qu'un modèle est sur le téléphone. Le chat, le raisonnement et les outils du téléphone n'ont pas besoin de connexion : ce que tu écris est traité sur l'appareil et n'est envoyé nulle part pour générer une réponse. Seuls le téléchargement d'un modèle et les outils Internet ont besoin du réseau.",
                },
                {
                  q: "Où vont mes données ?",
                  a: "Nulle part par défaut. Modèles, chats, mémoire et réglages restent sur le téléphone, sans compte et sans télémétrie. Une requête ne sort que pour télécharger un modèle (Hugging Face) ou, si tu les as activés, pour les outils Internet. Le détail est sur la [page de confidentialité](/privacy/).",
                },
                {
                  q: "Pourquoi c'est lent sur mon téléphone ?",
                  a: "Le modèle tourne sur le processeur de ton téléphone, qui est loin d'un serveur. Sur le téléphone mesuré, Qwen3 1.7B répond à environ 5,5 tokens/s, et le benchmark du moteur va de 3,9 tokens/s pour un modèle de 3B à 0,2 pour un 7B sur CPU. tensai marque Juste les modèles de 3,5 milliards de paramètres ou plus, une règle empirique. Essaie un modèle plus petit, vérifie le backend, baisse le contexte. Voir [Performances](/docs/performance/).",
                },
                {
                  q: "Y a-t-il une version iPhone ?",
                  a: "Pas encore. tensai est une app Android pour l'instant. Une version iOS viendra peut-être un jour, mais rien n'est prévu ni daté.",
                },
                {
                  q: "Pourquoi pas le Play Store ?",
                  a: "Pas pour l'instant. À la 1.0, tensai arrive en APK signé depuis [ce site](/download/) et les releases GitHub, avec F-Droid plus tard. Les stores officiels pourront suivre un jour, sans date.",
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

export const docs = { en, fr };
