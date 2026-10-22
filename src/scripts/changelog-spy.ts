// Scroll-spy for the changelog timeline: the release being read gets aria-current="location" on its link.
// Without JS the SSR marks the latest release, even when the URL hash targets another one: accepted.
const links = [...document.querySelectorAll<HTMLAnchorElement>(".versions a")];
const sections = links.map((a) => document.getElementById(a.hash.slice(1))!);
let pinned = -1;
let queued = false;

function mark(i: number) {
  if (links[i]!.getAttribute("aria-current") === "location") return;
  links.forEach((a, j) => (j === i ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current")));
  links[i]!.scrollIntoView({ block: "nearest" });
}

// A release counts as read once its top crosses the top third of the viewport. At the bottom of the page the last
// ones can never get there: take the last section whose top is on screen.
function compute() {
  const line = scrollY > 0 && innerHeight + scrollY >= document.documentElement.scrollHeight - 2 ? innerHeight : innerHeight / 3;
  let i = 0;
  sections.forEach((s, j) => s.getBoundingClientRect().top < line && (i = j));
  return i;
}

function update() {
  queued = false;
  mark(pinned >= 0 ? pinned : compute());
}

function schedule() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(update);
  }
}

// A click pins its release until the user scrolls by hand (the jump itself fires scroll events).
const unpin = () => {
  pinned = -1;
  schedule();
};
links.forEach((a, i) =>
  a.addEventListener("click", () => {
    pinned = i;
    mark(i);
  }),
);
for (const e of ["wheel", "touchmove", "keydown"]) addEventListener(e, unpin, { passive: true });
addEventListener("scroll", () => pinned < 0 && schedule(), { passive: true });
addEventListener("resize", schedule, { passive: true });
