import { releases, anchor } from "../data/changelog";
import { absolute } from "../i18n/seo";
import { changelog } from "../i18n/pages/changelog";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const stamp = (iso: string) => `${iso}T00:00:00Z`;

/** Atom feed of the releases, English (the notes are). One entry per release, linked to its anchor, content as HTML. */
export const GET = () => {
  const page = absolute("/changelog/");
  const html = (r: (typeof releases)[number]) =>
    [
      `<p>${esc(r.intro)}</p>`,
      ...r.groups.map((g) => `<h3>${esc(g.label)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`),
    ].join("");
  const entries = releases.map((r) => {
    const url = `${page}#${anchor(r.version)}`;
    return [
      "  <entry>",
      `    <id>${url}</id>`,
      `    <title>${esc(r.title ? `${r.version}: ${r.title}` : r.version)}</title>`,
      `    <link rel="alternate" type="text/html" href="${url}"/>`,
      `    <updated>${stamp(r.date)}</updated>`,
      `    <content type="html">${esc(html(r))}</content>`,
      "  </entry>",
    ].join("\n");
  });
  const xml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">',
    `  <id>${absolute("/changelog.xml")}</id>`,
    `  <title>tensai ${changelog.en.heading}</title>`,
    `  <link rel="self" type="application/atom+xml" href="${absolute("/changelog.xml")}"/>`,
    `  <link rel="alternate" type="text/html" href="${page}"/>`,
    `  <updated>${stamp(releases[0]!.date)}</updated>`,
    "  <author><name>tensai</name></author>",
    ...entries,
    "</feed>",
    "",
  ].join("\n");
  return new Response(xml, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
};
