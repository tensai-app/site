const en = {
  title: "Legal notice",
  description: "Publisher, publication director, host and contact of tensai.page.",
  heading: "Legal notice",
  updated: "Last updated",
  publisher: "Publisher",
  director: "Publication director",
  address: "Address",
  phone: "Phone",
  anonymous:
    "The publisher of this site has chosen to remain anonymous, as article 6-III-2 of the French law of 21 June 2004 (LCEN) allows. Their identity is held by the host named below.",
  host: "Host",
  hostLines: ["Cloudflare, Inc.", "101 Townsend St, San Francisco, CA 94107, United States"],
  contact: "Contact",
  licence: {
    heading: "Licence",
    before:
      "tensai is open-source software under the Apache License 2.0. Its source code is published with version 1.0. The engine,",
    link: "llama.kt",
    after: ", is already public under the same licence. Model files are published by third parties under their own licences.",
  },
};

const fr: typeof en = {
  title: "Mentions légales",
  description: "Éditeur, directeur de la publication, hébergeur et contact de tensai.page.",
  heading: "Mentions légales",
  updated: "Dernière mise à jour",
  publisher: "Éditeur",
  director: "Directeur de la publication",
  address: "Adresse",
  phone: "Téléphone",
  anonymous:
    "L'éditeur de ce site a choisi de rester anonyme, comme l'article 6, III, 2 de la loi du 21 juin 2004 (LCEN) le permet. Son identité est conservée par l'hébergeur indiqué ci-dessous.",
  host: "Hébergeur",
  hostLines: ["Cloudflare, Inc.", "101 Townsend St, San Francisco, CA 94107, États-Unis"],
  contact: "Contact",
  licence: {
    heading: "Licence",
    before:
      "tensai est un logiciel open source sous licence Apache 2.0. Son code source est publié avec la version 1.0. Le moteur,",
    link: "llama.kt",
    after: ", est déjà public sous la même licence. Les fichiers de modèles sont publiés par des tiers sous leurs propres licences.",
  },
};

export const legal = { en, fr };
