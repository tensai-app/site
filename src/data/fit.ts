import grid from "./fit-grid.json";

/** Verdict order: index 0 is Runs well, 1 Tight fit, 2 Won't fit. The labels come from the page dictionary. */
const verdicts = ["Runs well", "Tight fit", "Won't fit"];

/** The app's own verdicts (fit-grid.json) for the models and phone sizes the docs show, smallest model first. */
const RAMS = [4, 6, 8];
const MODELS = ["Qwen3 1.7B Q4_K_M", "Llama 3.2 3B Q4_K_M", "Qwen3 4B Q4_K_M", "8B Q4 (Qwen3-8B shape)"];

export const docsFit = {
  rams: RAMS,
  models: MODELS.map((label) => {
    const file = grid.find((r) => r.model_label === label)?.file_gb;
    if (file === undefined) throw new Error(`fit-grid.json: no model ${label}`);
    // A synthetic row ("8B Q4 (Qwen3-8B shape)") stands for a size class, not for a model of tensai's list.
    const cls = label.match(/^(\d+B) Q4 \(/)?.[1];
    return {
      label,
      cls,
      file,
      verdicts: RAMS.map((ram) => {
        const row = grid.find((r) => r.model_label === label && r.ram_gb === ram);
        const i = row ? verdicts.indexOf(row.verdict) : -1;
        if (i < 0) throw new Error(`fit-grid.json: no verdict for ${label} at ${ram} GB`);
        return i;
      }),
    };
  }),
};
