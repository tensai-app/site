/**
 * The measured selection shown on the llama.kt page and reused by the docs (Performance): one source, so the two
 * pages never disagree. Each row is [model, quant, [backend, pp, tg, faster][]], in tok/s. The setup line
 * (device, backends, nCtx, llama.cpp build) is `llamakt[locale].measured.setup`.
 */
export type MeasuredRow = [string, string, [string, string, string, boolean][]];

export const measuredRows: MeasuredRow[] = [
  ["Qwen2.5-0.5B-Instruct", "Q4_K_M", [["CPU", "29.5", "15.0", true], ["Vulkan", "7.0", "9.0", false]]],
  ["Gemma-3-1B-it", "Q4_K_M", [["CPU", "10.9", "6.0", true], ["Vulkan", "3.7", "5.4", false]]],
  ["Qwen3-1.7B", "Q4_K_M", [["CPU", "8.6", "5.9", true], ["Vulkan", "2.1", "4.2", false]]],
  ["Llama-3.2-3B-Instruct", "Q4_K_M", [["CPU", "6.0", "3.9", true], ["Vulkan", "1.2", "2.9", false]]],
  ["Phi-4-mini (3.8B)", "Q4_K_M", [["CPU", "3.9", "1.7", false], ["Vulkan", "0.8", "2.3", true]]],
  ["Gemma-3n-E2B-it", "Q4_K_M", [["CPU", "1.9", "1.1", false], ["Vulkan", "1.8", "1.9", true]]],
  ["Qwen2.5-7B-Instruct", "Q4_K_M", [["CPU", "1.4", "0.2", false]]],
];
