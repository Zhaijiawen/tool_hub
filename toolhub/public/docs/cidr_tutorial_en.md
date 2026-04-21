# CIDR Calculator - Usage Tutorial

## Quick Start

The CIDR Calculator supports two input modes, switchable via the tabs at the top:

- **CIDR mode**: Enter a CIDR expression (e.g. `192.168.1.0/24`)
- **IP + Mask mode**: Enter the IP address and subnet mask separately (e.g. `192.168.1.0` + `255.255.255.0`)

Both modes produce identical results — choose whichever is more convenient for the information you have on hand.

## CIDR Mode

### Input Format

Enter a complete CIDR expression in the input field:

```
192.168.1.0/24
```

You can also enter a host address instead of the network address — the tool will derive the network automatically:

```
192.168.1.100/24  →  derives network address: 192.168.1.0
```

### Supported Formats

- IPv4 CIDR: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
- Single host route: `192.168.1.1/32`
- Point-to-point link: `10.0.0.0/30`

## IP + Mask Mode

Fill in two separate fields:

1. **IP address**: `192.168.1.0`
2. **Subnet mask**: `255.255.255.0` (also accepts a CIDR prefix length like `24`)

## Reading the Results

After a successful calculation, the tool shows:

| Field | Meaning |
|-------|---------|
| Network address | First address in the subnet; identifies the network |
| Broadcast address | Last address; used for subnet-wide broadcasts |
| Subnet mask | Dotted-decimal mask notation |
| Prefix length | The number after the slash (e.g. /24) |
| Usable host count | Addresses actually assignable to hosts |
| IP range | First and last assignable host addresses |
| IP type | Whether the address is private (RFC 1918), loopback, etc. |

## Checking if an IP Belongs to a Subnet

After computing the network, enter any IP in the "IP check" section to verify membership:

```
Subnet: 192.168.1.0/24
Input:  192.168.1.150  →  ✅ Within this subnet
Input:  192.168.2.1    →  ❌ Not in this subnet
```

## Common Subnets Reference

| Subnet | Purpose |
|--------|---------|
| `127.0.0.0/8` | Loopback (localhost) |
| `10.0.0.0/8` | Class A private network |
| `172.16.0.0/12` | Class B private network |
| `192.168.0.0/16` | Class C private network |
| `0.0.0.0/0` | Default route (all traffic) |
| `255.255.255.255/32` | Limited broadcast address |

