# CIDR Calculator Examples

Real subnetting scenarios you'll hit in practice.

## Home/Office LAN (/24)

The classic home router setup:

**Input:** `192.168.1.0/24`

| Field | Value |
|---|---|
| Network address | 192.168.1.0 |
| Broadcast address | 192.168.1.255 |
| Subnet mask | 255.255.255.0 |
| Usable hosts | 254 |
| IP range | 192.168.1.1 – 192.168.1.254 |
| Type | Private (Class C) |

Your home router is probably handing out addresses in this range via DHCP, with `.1` or `.254` as the gateway.

## Enterprise Network (/16)

A typical corporate office with thousands of devices:

**Input:** `10.0.0.0/16`

| Field | Value |
|---|---|
| Network address | 10.0.0.0 |
| Broadcast address | 10.0.255.255 |
| Subnet mask | 255.255.0.0 |
| Usable hosts | 65,534 |
| IP range | 10.0.0.1 – 10.0.255.254 |
| Type | Private (Class A) |

With 65K addresses, you've got room for every laptop, phone, printer, and IoT device in a large office building.

## Splitting a /24 into Two /25s

Need to separate two departments but only have one /24?

| Subnet | Network | Broadcast | Hosts |
|---|---|---|---|
| First half | 192.168.100.0/25 | 192.168.100.127 | 126 |
| Second half | 192.168.100.128/25 | 192.168.100.255 | 126 |

Each half gives you 126 usable addresses. The subnet mask becomes `255.255.255.128`.

## Cloud VPC Planning

A real-world VPC layout for a multi-tier application:

```
VPC: 10.0.0.0/16 (65,534 IPs total)

├── Public subnet A:  10.0.0.0/20   (4,094 IPs)  Internet-facing
├── Public subnet B:  10.0.16.0/20  (4,094 IPs)  Internet-facing (AZ redundancy)
├── Private subnet A: 10.0.32.0/20  (4,094 IPs)  App tier
├── Private subnet B: 10.0.48.0/20  (4,094 IPs)  App tier (AZ redundancy)
└── Database subnet:  10.0.64.0/24  (254 IPs)    Data tier
```

Using /20 for app subnets gives you room to scale without running out of IPs. The database subnet uses /24 because you typically have fewer database instances.

## Point-to-Point Link (/30)

Router-to-router links need exactly 2 addresses:

**Input:** `10.1.1.0/30`

| Field | Value |
|---|---|
| Network address | 10.1.1.0 |
| Broadcast address | 10.1.1.3 |
| Usable hosts | 10.1.1.1 and 10.1.1.2 |
| Count | 2 |

Any prefix larger than /30 on a P2P link wastes addresses.

## IP Membership Checks

**Is `10.50.20.100` in `10.50.0.0/16`?**
- Range: `10.50.0.1` – `10.50.255.254`
- `10.50.20.100` is within range -- yes.

**Is `172.31.255.250` in `172.16.0.0/12`?**
- Range: `172.16.0.1` – `172.31.255.254`
- `172.31.255.250` is within range -- yes. A /12 covers 172.16.x.x through 172.31.x.x.
