# CIDR Calculator - Technical Background

## What is an IP Address

An IPv4 address is a 32-bit number, conventionally written in dotted-decimal notation, e.g. `192.168.1.0`.
Each segment (octet) is an integer from 0 to 255, representing 8 binary bits.

```
192      .168      .1        .0
11000000 .10101000 .00000001 .00000000
```

## What is a Subnet Mask

A subnet mask is also a 32-bit number consisting of consecutive `1`s followed by consecutive `0`s. It divides an IP address into a **network part** and a **host part**:

```
255.255.255.0
11111111 . 11111111 . 11111111 . 00000000
```

- Bits where the mask is `1` → network address portion
- Bits where the mask is `0` → host address portion

## What is CIDR Notation

**CIDR (Classless Inter-Domain Routing)** uses a slash followed by the prefix length to compactly express a subnet:

```
192.168.1.0/24
```

`/24` means the first 24 bits are the network part; the remaining 8 bits are the host part.

Equivalent subnet mask: `255.255.255.0`

## Common CIDR Prefix Reference

| Prefix | Subnet mask | Usable hosts | Common use |
|--------|-------------|--------------|------------|
| /8 | 255.0.0.0 | 16,777,214 | Class A private (10.x.x.x) |
| /16 | 255.255.0.0 | 65,534 | Class B private (172.16-31.x.x) |
| /24 | 255.255.255.0 | 254 | Home/office network |
| /25 | 255.255.255.128 | 126 | Split a /24 in half |
| /28 | 255.255.255.240 | 14 | Small subnet |
| /30 | 255.255.255.252 | 2 | Point-to-point link |
| /32 | 255.255.255.255 | 1 (single host) | Host route |

## Key Concepts

### Network Address

The smallest address in a subnet — all host bits set to `0`. Not assignable to a host; used to identify the network itself.

Example: The network address of `192.168.1.0/24` is `192.168.1.0`

### Broadcast Address

The largest address in a subnet — all host bits set to `1`. Packets sent to this address are broadcast to all hosts in the subnet. Not assignable.

Example: The broadcast address of `192.168.1.0/24` is `192.168.1.255`

### Usable Host Range

From network address + 1 to broadcast address − 1: `2^(32 − prefix) − 2` addresses.

Example: `192.168.1.0/24` usable range: `192.168.1.1` – `192.168.1.254` = 254 hosts.

## Private Address Ranges (RFC 1918)

These address blocks are not routable on the public internet and are reserved for internal networks:

| Class | CIDR | Addresses |
|-------|------|-----------|
| A | 10.0.0.0/8 | 16,777,216 |
| B | 172.16.0.0/12 | 1,048,576 |
| C | 192.168.0.0/16 | 65,536 |

