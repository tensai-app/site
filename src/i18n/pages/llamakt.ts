const en = {
  title: "llama.kt, llama.cpp for Android in Kotlin · tensai",
  description:
    "llama.kt is the open-source engine inside tensai: a Kotlin and JNI binding for llama.cpp on Android. CPU and Vulkan validated on device. Apache 2.0.",
  hero: {
    lead: "llama.cpp for Android, as a Kotlin library.",
    rest: "CPU, Vulkan and OpenCL in one native library. CPU and Vulkan are validated on a Mali-G68. OpenCL is compiled in and not yet tested on Adreno hardware. Apache 2.0.",
    github: "GitHub",
    readme: "README",
    meta: "arm64-v8a · minSdk 29 · OpenCL untested on Adreno · the engine inside tensai, usable standalone",
  },
  features: {
    heading: "What it does",
    items: [
      {
        title: "Loads any GGUF",
        text: "Reads the header in milliseconds for quant, size and context before the full load.",
      },
      {
        title: "Streaming",
        text: "Tokens as a Kotlin Flow, UTF-8 safe, stops on EOS or a hard cap.",
      },
      {
        title: "Chat templates from the model",
        text: "The template comes from the GGUF itself, so any instruct model works as is.",
      },
      {
        title: "KV cache sessions",
        text: "Follow-ups reuse the cached history. Sessions save and restore across restarts.",
      },
      {
        title: "Reasoning split",
        text: "Replies come split into answer and reasoning by llama.cpp's own parser for that template. Best effort, keep a fallback.",
      },
    ],
  },
  code: {
    label: "Code example",
    tabs: ["Submodule", "Gradle", "Kotlin"],
    langs: ["Shell commands", "Gradle, Kotlin DSL", "Kotlin"],
    note: "The AAR is not published yet. The git submodule is the supported path for now. Maven Central may come later.",
    copy: "Copy code",
    copied: "Copied",
  },
  measured: {
    heading: "Measured",
    setup:
      "OPPO CPH2251 · Dimensity 900 (2× A78 2.4 GHz + 6× A55 2.0 GHz, Mali-G68 MC4, LPDDR4X) · Android 13 · nCtx 4096 · temp 0 · ~20-token prompt · CPU = 2 big-core threads · llama.cpp b9769 · tok/s",
    columns: { model: "Model", quant: "Quant", backend: "Backend", pp: "pp", tg: "tg" },
    faster: "faster backend",
    selection: "A selection of the models measured, in tok/s.",
    legend: "pp = prompt processing, tg = generation. The dot marks the faster backend for each model.",
    more: "The full table, with more models and backends (Gemma 4 included), is in the README.",
    stats: [
      {
        value: "1.7 to 2.4 s",
        versus: "vs ~48 s",
        text: "Time to first token over 4 dependent turns, history 0 to 529 tokens, with KV prefix reuse vs a full re-prefill.",
      },
      {
        value: "10.7 s to 82 ms",
        versus: "",
        text: "Time to first token after a process kill, 171-token prompt, restoring a saved session.",
      },
    ],
  },
  upstream: {
    heading: "Upstream",
    text: "llama.cpp and llama.rn are pinned. Fixes go upstream where they can; the rest live as patches applied at bootstrap.",
    status: { merged: "merged", local: "local" },
    items: [
      {
        name: "Vulkan UMA fix",
        text: "Overflow-safe CEIL_DIV in ggml_vk_matmul for mobile drivers that report UINT32_MAX work groups. Fixed batched matmuls aborting at load.",
        status: "merged",
        ref: "#25245",
      },
      {
        name: "0002-abort-callback-mid-graph-cancel",
        text: "Abort callback checked per graph node, so cancelling a long prefill does not wait for the whole batch.",
        status: "local",
        ref: "",
      },
      {
        name: "0003-vulkan-device-dispatcher-init",
        text: "Loads device-level Vulkan function pointers after createDevice, and turns off buffer_device_address on Mali when it is not exposed.",
        status: "local",
        ref: "",
      },
      {
        name: "0004-stale-embd-kv-invariant",
        text: "Never trusts KV cells that were not decoded: position check, SWA window guard, trimmed on abort.",
        status: "local",
        ref: "",
      },
      {
        name: "0005-load-stage-callback",
        text: "Load stages (weights, context, warm-up) reported through the progress callback.",
        status: "local",
        ref: "",
      },
      {
        name: "0006-kv-reuse-past-divergence",
        text: "Keeps the KV cache up to the point where a new prompt diverges from the cached one, instead of dropping it.",
        status: "local",
        ref: "",
      },
      {
        name: "0007-vulkan-submit-mflops-env",
        text: "Makes the amount of work per Vulkan submit tunable through an environment variable.",
        status: "local",
        ref: "",
      },
      {
        name: "0008-vulkan-queue-priority",
        text: "Sets an explicit priority on the Vulkan compute queue.",
        status: "local",
        ref: "",
      },
      {
        name: "0009-vulkan-matmul-split",
        text: "Optionally splits large Vulkan matmuls along M into smaller dispatches for mobile drivers.",
        status: "local",
        ref: "",
      },
    ],
  },
};

const fr: typeof en = {
  title: "llama.kt, llama.cpp pour Android en Kotlin · tensai",
  description:
    "llama.kt est le moteur open source de tensai : un binding Kotlin et JNI pour llama.cpp sur Android. CPU et Vulkan validés sur appareil. Apache 2.0.",
  hero: {
    lead: "llama.cpp pour Android, en bibliothèque Kotlin.",
    rest: "CPU, Vulkan et OpenCL dans une seule bibliothèque native. CPU et Vulkan sont validés sur un Mali-G68. OpenCL est intégré mais pas encore testé sur du matériel Adreno. Apache 2.0.",
    github: "GitHub",
    readme: "README",
    meta: "arm64-v8a · minSdk 29 · OpenCL non testé sur Adreno · le moteur de tensai, utilisable seul",
  },
  features: {
    heading: "Ce qu'il fait",
    items: [
      {
        title: "Charge n'importe quel GGUF",
        text: "Lit l'en-tête en quelques millisecondes (quantification, taille, contexte) avant le chargement complet.",
      },
      {
        title: "Streaming",
        text: "Les tokens arrivent en Flow Kotlin, sûrs en UTF-8, arrêt sur EOS ou à une limite fixe.",
      },
      {
        title: "Templates de chat du modèle",
        text: "Le template vient du GGUF lui-même : tout modèle instruct fonctionne tel quel.",
      },
      {
        title: "Sessions de cache KV",
        text: "Les relances réutilisent l'historique en cache. Les sessions se sauvegardent et se restaurent entre deux démarrages.",
      },
      {
        title: "Raisonnement séparé",
        text: "Les réponses arrivent découpées en réponse et raisonnement par le parseur de llama.cpp pour ce template. Au mieux, prévoir un repli.",
      },
    ],
  },
  code: {
    label: "Exemple de code",
    tabs: ["Submodule", "Gradle", "Kotlin"],
    langs: ["Commandes shell", "Gradle, Kotlin DSL", "Kotlin"],
    note: "L'AAR n'est pas encore publié. Le submodule git est la voie supportée pour l'instant. Maven Central pourrait suivre.",
    copy: "Copier le code",
    copied: "Copié",
  },
  measured: {
    heading: "Mesures",
    setup:
      "OPPO CPH2251 · Dimensity 900 (2× A78 à 2,4 GHz + 6× A55 à 2,0 GHz, Mali-G68 MC4, LPDDR4X) · Android 13 · nCtx 4096 · temp 0 · prompt d'environ 20 tokens · CPU = 2 threads sur les gros cœurs · llama.cpp b9769 · tok/s",
    columns: { model: "Modèle", quant: "Quant", backend: "Backend", pp: "pp", tg: "tg" },
    faster: "backend le plus rapide",
    selection: "Une sélection des modèles mesurés, en tok/s.",
    legend: "pp = traitement du prompt, tg = génération. Le point marque le backend le plus rapide pour chaque modèle.",
    more: "Le tableau complet, avec plus de modèles et de backends (Gemma 4 compris), est dans le README.",
    stats: [
      {
        value: "1,7 à 2,4 s",
        versus: "contre ~48 s",
        text: "Délai avant le premier token sur 4 tours dépendants, historique de 0 à 529 tokens, avec réutilisation du préfixe KV contre un re-prefill complet.",
      },
      {
        value: "10,7 s à 82 ms",
        versus: "",
        text: "Délai avant le premier token après un kill du processus, prompt de 171 tokens, avec restauration d'une session sauvegardée.",
      },
    ],
  },
  upstream: {
    heading: "Upstream",
    text: "llama.cpp et llama.rn sont épinglés. Les correctifs remontent en amont quand c'est possible ; les autres vivent en patchs appliqués au bootstrap.",
    status: { merged: "fusionné", local: "local" },
    items: [
      {
        name: "Correctif Vulkan UMA",
        text: "CEIL_DIV sans débordement dans ggml_vk_matmul pour les pilotes mobiles qui annoncent UINT32_MAX groupes de travail. Corrige l'arrêt des matmuls par lots au chargement.",
        status: "merged",
        ref: "#25245",
      },
      {
        name: "0002-abort-callback-mid-graph-cancel",
        text: "Callback d'abandon vérifié à chaque nœud du graphe : annuler un long prefill n'attend plus le lot entier.",
        status: "local",
        ref: "",
      },
      {
        name: "0003-vulkan-device-dispatcher-init",
        text: "Charge les pointeurs de fonctions Vulkan de niveau device après createDevice, et désactive buffer_device_address sur Mali quand il n'est pas exposé.",
        status: "local",
        ref: "",
      },
      {
        name: "0004-stale-embd-kv-invariant",
        text: "Ne fait jamais confiance à des cellules KV non décodées : contrôle de position, garde de fenêtre SWA, troncature à l'abandon.",
        status: "local",
        ref: "",
      },
      {
        name: "0005-load-stage-callback",
        text: "Les étapes de chargement (poids, contexte, warm-up) remontent par le callback de progression.",
        status: "local",
        ref: "",
      },
      {
        name: "0006-kv-reuse-past-divergence",
        text: "Garde le cache KV jusqu'au point où un nouveau prompt diverge de celui en cache, au lieu de le jeter.",
        status: "local",
        ref: "",
      },
      {
        name: "0007-vulkan-submit-mflops-env",
        text: "Rend la quantité de travail par soumission Vulkan réglable par variable d'environnement.",
        status: "local",
        ref: "",
      },
      {
        name: "0008-vulkan-queue-priority",
        text: "Fixe une priorité explicite sur la file de calcul Vulkan.",
        status: "local",
        ref: "",
      },
      {
        name: "0009-vulkan-matmul-split",
        text: "Découpe en option les gros matmuls Vulkan selon M en dispatches plus petits pour les pilotes mobiles.",
        status: "local",
        ref: "",
      },
    ],
  },
};

export const llamakt = { en, fr };
