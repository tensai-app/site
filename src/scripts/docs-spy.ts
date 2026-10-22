// "On this page": the heading being read gets aria-current="location" on its link. Without JS the first one stays marked.
export {};
const links = [...document.querySelectorAll<HTMLAnchorElement>(".rail a")];
const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
const wide = matchMedia("(min-width: 80rem)");
let pinned = -1;
let queued = false;

function mark(i: number) {
  links.forEach((a, j) => (j === i ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current")));
}

// A heading counts as read once it crosses the top third of the viewport; at the very bottom, the last one on screen.
function compute() {
  const bottom = scrollY > 0 && innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
  const line = bottom ? innerHeight : innerHeight / 3;
  let i = 0;
  heads.forEach((h, j) => h && h.getBoundingClientRect().top < line && (i = j));
  return i;
}

function update() {
  queued = false;
  if (wide.matches) mark(pinned >= 0 ? pinned : compute());
}

function schedule() {
  if (!queued && wide.matches) {
    queued = true;
    requestAnimationFrame(update);
  }
}

// A click or a hash change pins its heading until the user scrolls by hand: the jump fires scroll events, and a late
// heading can never reach the top third.
function pinHash() {
  const i = links.findIndex((a) => a.hash === location.hash);
  if (i >= 0) {
    pinned = i;
    schedule();
  }
}
const unpin = () => {
  pinned = -1;
  schedule();
};
for (const e of ["wheel", "touchmove", "keydown"]) addEventListener(e, unpin, { passive: true });
addEventListener("hashchange", pinHash);
addEventListener("scroll", () => pinned < 0 && schedule(), { passive: true });
addEventListener("resize", schedule, { passive: true });
addEventListener("pageshow", schedule);
wide.addEventListener("change", schedule);
links.forEach((a, i) =>
  a.addEventListener("click", () => {
    pinned = i;
    schedule();
  }),
);
pinHash();
schedule();
