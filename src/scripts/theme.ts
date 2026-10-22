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

// One group per placement (header bar, mobile menu): they share the choice.
const groups = document.querySelectorAll<HTMLElement>("[data-theme-switch]");
if (groups.length) {
  const inputs = document.querySelectorAll<HTMLInputElement>("[data-theme-switch] input[type=radio]");
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
      inputs.forEach((other) => (other.checked = other.value === next));
    });
  });
  groups.forEach((group) => {
    group.hidden = false;
    group.removeAttribute("data-pending");
  });
}
