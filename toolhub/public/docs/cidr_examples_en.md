# CIDR Calculator - Examples

## Example 1: Home / Office Network (/24)

**Input:** `192.168.1.0/24`

| Field | Value |
|-------|-------|
| Network address | 192.168.1.0 |
| Broadcast address | 192.168.1.255 |
| Subnet mask | 255.255.255.0 |
| Usable hosts | 254 |
| IP range | 192.168.1.1 – 192.168.1.254 |
| Type | Private (Class C) |

---

## Example 2: Enterprise Internal Network (/16)

**Input:** `10.0.0.0/16`

| Field | Value |
|-------|-------|
| Network address | 10.0.0.0 |
| Broadcast address | 10.0.255.255 |
| Subnet mask | 255.255.0.0 |
| Usable hosts | 65,534 |
| IP range | 10.0.0.1 – 10.0.255.254 |
| Type | Private (Class A) |

---

## Example 3: Subnet Division (/24 → /25)

Split `192.168.100.0/24` (254 hosts) into two `/25` subnets:

| Subnet | Network address | Broadcast | Usable hosts |
|--------|----------------|-----------|-------------|
| First half | 192.168.100.0/25 | 192.168.100.127 | 126 |
| Second half | 192.168.100.128/25 | 192.168.100.255 | 126 |

---

## Example 4: Cloud VPC Planning

**Scenario:** Creating a VPC on AWS / Alibaba Cloud, assigning subnets for different tiers

```
VPC range:          10.0.0.0/16    (65,534 usable IPs)

├── Public subnet A:  10.0.0.0/20   (4,094 IPs)  ← Internet-facing
├── Public subnet B:  10.0.16.0/20  (4,094 IPs)  ← Internet-facing
├── Private subnet A: 10.0.32.0/20  (4,094 IPs)  ← Application tier
├── Private subnet B: 10.0.48.0/20  (4,094 IPs)  ← Application tier
└── Database subnet:  10.0.64.0/24  (254 IPs)    ← Data tier
```

---

## Example 5: Point-to-Point Link (/30)

Point-to-point links between routers commonly use /30, providing exactly 2 usable addresses:

**Input:** `10.1.1.0/30`

| Field | Value |
|-------|-------|
| Network address | 10.1.1.0 |
| Broadcast address | 10.1.1.3 |
| Usable hosts | 10.1.1.1 and 10.1.1.2 |
| Count | 2 |

---

## Example 6: IP Membership Check

**Does `10.50.20.100` belong to `10.50.0.0/16`?**

- Range: `10.50.0.1` – `10.50.255.254`
- `10.50.20.100` ✅ Within range

**Does `172.31.255.250` belong to `172.16.0.0/12`?**

- Range: `172.16.0.1` – `172.31.255.254`
- `172.31.255.250` ✅ Within range (172.16.0.0/12 covers 172.16–31.x.x)

