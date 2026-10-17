# Python Runner — Usage Tutorial

1. On open the editor already has a "stats" example. Or click an example button at the top (stats / JSON / regex / datetime / algorithms) to swap it.
2. Write or edit Python code in the editor. Standard library only.
3. Click **Run**. First run downloads Pyodide (with a progress bar); later runs use cache.
4. The result area shows:
   - **Return value**: the value of the last expression (if any).
   - **stdout**: output of `print()`.
   - **stderr**: errors or warnings.
5. When there is no output it says "no output". Click **Copy** to copy a result.

## Tips

- Want to inspect a variable? Just `print()` it — it shows up in stdout.
- Want the last expression's value? Write the expression directly (no assignment) and it appears as the return value.
- Errors show in stderr, red, with the exception type.

## Not supported

- No `import numpy` / `pandas` etc. (third-party libs).
- No network access (`requests` unavailable).
- No reading/writing files on your machine (use strings/variables only).
