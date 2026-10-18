// AI 工具
export default {
  ai: {
    tokenCalc: {
      title: "AI Token Calculator",
      description: "Count tokens for your text in LLMs and estimate API cost",
      inputLabel: "Input text",
      inputPlaceholder: "Paste or type text / JSON / code to count...",
      modelLabel: "Model",
      modelPlaceholder: "Select a model",
      tokenCount: "Token count",
      charCount: "Characters",
      wordCount: "Words",
      estimateCost: "Estimated cost",
      copy: "Copy",
      clear: "Clear",
      pasteSample: "Sample",
      errorEmpty: "Please enter some text",
      encoding: "Tokenizer",
      note: "Computed fully locally — your text never leaves the browser",
      approxNote: "Claude uses its own tokenizer; the token count shown here is an approximation based on cl100k_base, for rough estimation only."
    },
    bgRemoval: {
      title: "AI Background Removal",
      description: "Remove image background locally in the browser, no upload required",
      uploadHint: "Click or drag an image here to upload",
      chooseBtn: "Choose image",
      changeBtn: "Change image",
      modelLabel: "Model",
      modelQuint8: "Light (isnet_quint8, ~40MB, faster)",
      modelFp16: "HD (isnet_fp16, ~80MB, higher quality)",
      removeBtn: "Remove background",
      processing: "Processing…",
      loadingModel: "Loading model…",
      resultTitle: "Result",
      original: "Original",
      noBg: "No background",
      download: "Download PNG",
      notImage: "Please choose an image file",
      done: "Background removed",
      error: "Failed to process, please try another image",
      privacyNote: "Model weights are self-hosted on this site; images are processed entirely in your local browser and never uploaded to any server."
    }
  }
}
