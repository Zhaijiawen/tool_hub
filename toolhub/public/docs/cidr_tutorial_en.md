# CIDR Calculator -- How to Use

Two input modes, same results. Pick whichever matches the information you have.

## CIDR Mode

Enter a CIDR expression like `192.168.1.0/24`. That's it. The calculator derives everything: network address, broadcast address, usable range, host count, and whether it's a private address.

You don't even need the network address -- `192.168.1.100/24` works too. The tool figures out the network automatically.

**Common inputs:**
- `10.0.0.0/8` -- big private network
- `172.16.0.0/12` -- medium private network
- `192.168.0.0/16` -- small private network
- `192.168.1.1/32` -- single host route
- `10.0.0.0/30` -- point-to-point link

## IP + Mask Mode

If you have a subnet mask in dotted-decimal form instead of CIDR notation, use this mode:

1. **IP address**: `192.168.1.0`
2. **Subnet mask**: `255.255.255.0` (or just type `24` -- it accepts both)

Same results as CIDR mode. Just a different input format for when that's what you have.

## What the Results Tell You

| Field | What it means |
|---|---|
| Network address | The base address of the subnet -- identifies the network |
| Broadcast address | Send here to reach all hosts on the subnet |
| Subnet mask | The mask in dotted-decimal form |
| Prefix length | The `/24` part |
| Usable host count | How many devices you can actually assign addresses to |
| IP range | First and last assignable addresses |
| IP type | Private (RFC 1918), loopback, link-local, or public |

## Checking IP Membership

After calculating a subnet, use the IP check section to test whether an address belongs to it:

```
Subnet: 192.168.1.0/24
Input:  192.168.1.150  →  Yes, in this subnet
Input:  192.168.2.1    →  No, not in this subnet
```

Super useful when you're debugging routing issues or verifying firewall rules.

## Quick Reference: Well-Known Ranges

| Subnet | Purpose |
|---|---|
| `127.0.0.0/8` | Loopback (localhost -- packets never leave the machine) |
| `10.0.0.0/8` | Class A private |
| `172.16.0.0/12` | Class B private |
| `192.168.0.0/16` | Class C private |
| `169.254.0.0/16` | Link-local (APIPA -- when DHCP fails) |
| `0.0.0.0/0` | Default route (matches everything) |
| `255.255.255.255/32` | Limited broadcast |
