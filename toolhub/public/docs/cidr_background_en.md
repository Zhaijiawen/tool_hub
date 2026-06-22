# CIDR and Subnets: What's Actually Going On

If you've ever configured a VPC, set up a router, or stared at an AWS security group, you've dealt with CIDR notation. Let's unpack what those numbers actually mean.

## An IP Address Is Just a 32-bit Number

That `192.168.1.0` you keep typing? It's really just a 32-bit integer written in a human-friendly way. Each of the four octets is 8 bits:

```
192      .168      .1        .0
11000000 .10101000 .00000001 .00000000
```

So `192.168.1.0` = `3232235776` in decimal, if you're counting. Nobody counts that way, but it helps to remember that underneath, it's all bits.

## The Subnet Mask Splits Network from Host

A subnet mask is another 32-bit number with a run of `1`s followed by a run of `0`s:

```
255.255.255.0
11111111 . 11111111 . 11111111 . 00000000
```

- Bits where the mask is `1` identify the network
- Bits where the mask is `0` identify the host within that network

A `255.255.255.0` mask means the first 24 bits are network, last 8 bits are host. That's why you can have 254 usable addresses (256 minus the network address and broadcast address).

## CIDR: The Slash Notation

CIDR (Classless Inter-Domain Routing) ditched the old class system and just uses a prefix length:

```
192.168.1.0/24
```

`/24` means "first 24 bits are network." Same thing as `255.255.255.0`, just more compact.

## Common Prefixes at a Glance

| Prefix | Subnet Mask | Usable Hosts | Typical Use |
|---|---|---|---|
| /8 | 255.0.0.0 | 16,777,214 | Huge private networks |
| /16 | 255.255.0.0 | 65,534 | Medium networks |
| /24 | 255.255.255.0 | 254 | Home/office LAN |
| /25 | 255.255.255.128 | 126 | Splitting a /24 in half |
| /28 | 255.255.255.240 | 14 | Small subnet for a few hosts |
| /30 | 255.255.255.252 | 2 | Point-to-point link between routers |
| /32 | 255.255.255.255 | 1 | Single host route |

## Network Address vs Broadcast Address

The network address is the first address in the range (host bits all zero). You can't assign it to a device -- it names the network itself.

The broadcast address is the last address in the range (host bits all one). Packets sent here go to every host on the subnet.

Between them are the usable host addresses: `2^(32 - prefix) - 2` of them.

## Private Ranges (RFC 1918)

These won't route on the public internet:

| Block | CIDR | Address Count |
|---|---|---|
| Class A | 10.0.0.0/8 | 16,777,216 |
| Class B | 172.16.0.0/12 | 1,048,576 |
| Class C | 192.168.0.0/16 | 65,536 |

If you see one of these as a source address in a public context, something's being NAT'd.
