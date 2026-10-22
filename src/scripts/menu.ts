// Mobile menu (a <details>): Escape closes it and gives the focus back to the button, focus leaving the panel closes it.
const menu = document.querySelector<HTMLDetailsElement>("details.menu");

if (menu) {
  menu.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !menu.open) return;
    menu.open = false;
    menu.querySelector<HTMLElement>("summary")?.focus();
  });
  menu.addEventListener("focusout", (e) => {
    if (menu.open && e.relatedTarget instanceof Node && !menu.contains(e.relatedTarget)) menu.open = false;
  });
}
