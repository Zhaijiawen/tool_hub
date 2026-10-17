# Python Runner — Technical Background

This tool runs Python code directly in the browser using **Pyodide** (CPython compiled to WebAssembly). No Python install, no backend — code and output stay local.

## Standard library only

> Important: this tool includes the **Python standard library only** — third-party packages like numpy, pandas, requests are NOT preinstalled. Pyodide's scientific stack (numpy/scipy, etc.) would have to load from an external CDN, which this project deliberately avoids to stay purely local with zero external dependencies.

That means you can use `statistics`, `re`, `json`, `datetime`, `collections`, `heapq`, and every other stdlib module for data processing, text parsing, date math, algorithm practice — but you cannot `import numpy`.

## What you can do

- Write code, click **Run**, see the result.
- Output is shown in three blocks: **return value** (the last expression's value), **stdout**, and **stderr**.
- Built-in example buttons: stats, JSON, regex, datetime, algorithms — click to load code into the editor.

## How to use it

Great for quickly verifying a snippet of Python logic, small data cleanup, or demonstrating algorithms to students — write and run right in the browser, no terminal, no environment setup.

## Privacy

Code executes entirely on your device; nothing is uploaded.
