# AI Background Removal · Tutorial

## Steps
1. Open the **AI Background Removal** tool.
2. **Upload an image**: click the dashed box, or drag an image into it (common image formats supported).
3. **Choose a model**:
   - Light (isnet_quint8): ~40MB, faster;
   - HD (isnet_fp16): ~80MB, higher quality.
4. Click **"Remove background"**. On first use the model weights are downloaded (~40–80MB, with a visible progress bar); afterwards they are cached by the browser.
5. When processing finishes, the page shows an **original / no-background** comparison. The result sits on a checkerboard, which represents transparency.
6. Click **"Download PNG"** to save the transparent image.

## FAQ
- **Processing is slow?** Model inference runs on your local CPU/GPU. Large images or the HD model are slower — switch to the light model or resize the image first.
- **Edges are not clean?** For fine hair, glass, or other translucent objects, export and touch up with an image editor.
- **Model download failed?** Make sure the site's `/imgly-bg/` assets are reachable (self-hosted weights), and reload the page if needed.
