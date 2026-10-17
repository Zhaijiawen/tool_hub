# PNG Optimizer — Usage Tutorial

1. Upload a PNG image (drag or click). The tool shows a preview and the original size.
2. Adjust parameters:
   - **Level**: right = smaller but slower, default 3.
   - **Interlace**: usually off.
   - **Optimise Alpha**: usually on (more useful with transparency).
3. Click **Optimize**. First time it downloads Oxipng's WASM (with progress, cancellable, then cached).
4. When done it shows original size, optimized size, and saved percentage; click download to save.

> When savings <= 0% it says "no gain" — meaning the image was already well compressed.

## Tips

- Run website PNGs (icons, screenshots, logos) through optimization first to save bandwidth.
- Level 6 compresses hardest but is slow on big images; 3-4 is enough daily.
- For transparent PNGs, keep **Optimise Alpha** on.
