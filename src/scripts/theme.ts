// Theme switch: radio group System / Dark / Light. System means no [data-theme] on <html>.
// The no-flash part lives in theme-init.js (inline in <head>).

type Mode = "system" | "dark" | "light";
const barColor = { dark: "#0F0E17", light: "#FAF9FE" } as const;

function readMode(): Mode {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // storage blocked: stay on System
  }
  return "system";
}

function apply(mode: Mode): void {
  const root = document.documentElement;
  if (mode === "system") {
    delete root.dataset["theme"];
  } else {
    root.dataset["theme"] = mode;
  }
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const original = (meta.dataset["default"] ??= meta.content);
    meta.content = mode === "system" ? original : barColor[mode];
  });
}

const group = document.querySelector<HTMLElement>("[data-theme-switch]");
if (group) {
  const inputs = group.querySelectorAll<HTMLInputElement>('input[name="theme"]');
  const mode = readMode();
  apply(mode);
  inputs.forEach((input) => {
    input.checked = input.value === mode;
    input.addEventListener("change", () => {
      if (!input.checked) return;
      const next = input.value as Mode;
      try {
        if (next === "system") localStorage.removeItem("theme");
        else localStorage.setItem("theme", next);
      } catch {
        // storage blocked: the choice lasts for this page only
      }
      apply(next);
    });
  });
  group.hidden = false;
}
