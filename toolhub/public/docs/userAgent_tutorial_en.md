# User Agent Parser — Usage Tutorial

## How to Use

### Step 1: Get Your User Agent
The tool automatically detects and displays your browser's current User Agent string when the page loads.

### Step 2: Parse Any UA String
You can also manually paste any User Agent string into the input field to analyze it.

### Step 3: View Parsed Information
The tool breaks down the UA string and displays:
- **Browser**: name and version
- **OS**: operating system and version
- **Device Type**: desktop, mobile, or tablet
- **Engine**: rendering engine and version

## Where to Find User Agent Strings

- **Browser DevTools**: Open the Console tab and type `navigator.userAgent`
- **HTTP request headers**: visible in server logs or DevTools Network tab → Request Headers
- **Online tools**: this page auto-detects your own UA

## Common Use Cases

1. **Debug mobile layouts**: Identify if a user is on a specific iOS or Android version
2. **Verify bot traffic**: Check if a crawl request is from Googlebot or a fake UA
3. **Cross-browser testing**: Log the UA in your error tracking system to reproduce issues
4. **API compatibility**: Check if a client SDK version is outdated

## Tips
- Copy your UA string before upgrading your browser for before/after comparison
- Server-side UA detection should use a reliable library (e.g., `ua-parser-js`, `device-detector`)

