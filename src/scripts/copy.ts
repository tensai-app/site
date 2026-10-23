// Copy button on code blocks. The buttons ship hidden and are revealed here, so there is no dead control without JS.
const live = document.querySelector<HTMLElement>("[data-copy-status]");
let liveTimer: number | undefined;

/** The Clipboard API needs a secure context (HTTPS, localhost): on plain HTTP, fall back to a selected textarea. */
async function write(text: string, btn: HTMLElement): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // permission denied or no focus: try the fallback
    }
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.readOnly = true;
  area.className = "visually-hidden";
  document.body.append(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    // blocked
  }
  area.remove();
  btn.focus();
  return ok;
}

for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
  let timer: number | undefined;
  btn.hidden = false;
  btn.addEventListener("click", async () => {
    // Line numbers are CSS counters: textContent never sees them.
    const text = btn.dataset["copyValue"] ?? [...(btn.parentElement?.querySelectorAll(".line") ?? [])].map((l) => (l.textContent ?? "").trimEnd()).join("\n");
    const ok = await write(text, btn);
    btn.classList.remove("done", "failed");
    btn.classList.add(ok ? "done" : "failed");
    if (live) live.textContent = (ok ? btn.dataset["done"] : btn.dataset["failed"]) ?? "";
    clearTimeout(timer);
    timer = window.setTimeout(() => btn.classList.remove("done", "failed"), 1500);
    clearTimeout(liveTimer);
    liveTimer = window.setTimeout(() => live && (live.textContent = ""), 2000);
  });
}
