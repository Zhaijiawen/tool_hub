# IP Query Tool - Tutorial

## Getting Started

The IP query tool requires no registration — open and use immediately. The tool automatically detects and displays your current public IP information.

## Basic Usage

### Auto-Query Your Current IP

When you open the tool, it automatically calls the API to retrieve your current public IP and its geolocation information — no action needed.

Displayed information includes:
- 📍 **IP Address**: Your public IP
- 🌍 **Country/Region**: The registered country and region of the IP
- 🏙️ **City**: Approximate city location
- 🏢 **ISP/Carrier**: Internet Service Provider (e.g., Comcast, AT&T)
- 📡 **ASN**: Autonomous System Number
- 🕐 **Timezone**: Current timezone
- 📍 **Latitude/Longitude**: Click the link to view on a map

### Query a Specific IP

1. Enter the IP address to query in the input box (supports IPv4 and IPv6)
2. Click the **Query** button
3. Wait for the results to display

**IPv4 example:** `8.8.8.8` (Google DNS)

**IPv6 example:** `2001:4860:4860::8888`

## Understanding the Results

### Geographic Information

| Field | Description |
|-------|-------------|
| Country | Registered country of the IP (with flag icon) |
| Region/Province | State or province |
| City | City location (may have significant margin of error) |
| Postal Code | Area postal code |
| Lat/Long | Geographic coordinates — click to open map |

### Network Information

| Field | Description |
|-------|-------------|
| ISP | Internet Service Provider name |
| Organization | Organization the IP actually belongs to |
| AS Number | Autonomous System Number, e.g., AS13335 |
| Connection Type | e.g., broadband, corporate, mobile |

## Common Use Cases

### Verify VPN is Working

Open the tool and check the displayed country and city. If they differ from your actual location, your VPN is active and routing your traffic through its exit node.

### Query Server IP Location

Enter your server's public IP to confirm the city and ISP of the datacenter where your server is hosted.

### Network Troubleshooting

When you can't access certain websites or services, query your IP's registered location to check if your region is geo-blocked by the target service.

### Get Public IP in Scripts

```javascript
// Fetch current public IP from ipapi.co
const response = await fetch('https://ipapi.co/json/')
const data = await response.json()
console.log(data.ip)      // Current IP
console.log(data.country) // Country code
console.log(data.city)    // City
```

## Important Notes

1. **Private IPs cannot be queried**: LAN addresses like `192.168.x.x` and `10.x.x.x` have no geolocation data
2. **Free APIs have rate limits**: ipapi.co allows 1,000 free requests per day — avoid excessive calls
3. **Results are approximate**: Geolocation accuracy is limited; city-level results may be incorrect
4. **Corporate VPN impact**: When using a corporate VPN, the displayed IP is your company's exit IP, not your personal location

