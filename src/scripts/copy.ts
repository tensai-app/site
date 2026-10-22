// Copy button on code blocks. The buttons ship hidden and are revealed here, so there is no dead control without JS.
const live = document.querySelector<HTMLElement>("[data-copy-status]");
let timer: number | undefined;

for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
  btn.hidden = false;
  btn.addEventListener("click", async () => {
    // Line numbers are CSS counters: textContent never sees them.
    const text = btn.dataset["copyValue"] ?? [...(btn.parentElement?.querySelectorAll(".line") ?? [])].map((l) => (l.textContent ?? "").trimEnd()).join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    if (live) live.textContent = btn.dataset["done"] ?? "";
    clearTimeout(timer);
    timer = window.setTimeout(() => live && (live.textContent = ""), 2000);
  });
}
