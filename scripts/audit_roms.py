#!/usr/bin/env python3
"""Inspect the supplied cartridges without modifying them. Python 3, no dependencies."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAPPERS = {0x1B: "MBC5+RAM+BATTERY", 0x1E: "MBC5+RUMBLE+RAM+BATTERY"}
RAM_BYTES = {0: 0, 1: 2048, 2: 8192, 3: 32768, 4: 131072, 5: 65536}


def inspect(path):
    data = path.read_bytes()
    if len(data) < 0x150:
        raise ValueError(f"Truncated cartridge: {path.name}")
    size_code = data[0x148]
    expected = (32768 << size_code) if size_code <= 8 else {
        0x52: 72 * 16384, 0x53: 80 * 16384, 0x54: 96 * 16384
    }.get(size_code)
    checksum = 0
    for byte in data[0x134:0x14D]:
        checksum = (checksum - byte - 1) & 0xFF
    return {
        "file": str(path.relative_to(ROOT)),
        "bytes": len(data),
        "mapper_code": f"0x{data[0x147]:02x}",
        "mapper": MAPPERS.get(data[0x147], "other"),
        "cgb_flag": f"0x{data[0x143]:02x}",
        "ram_bytes": RAM_BYTES.get(data[0x149]),
        "declared_rom_bytes": expected,
        "size_matches_header": expected == len(data),
        "header_checksum_valid": checksum == data[0x14D],
        "global_checksum_valid": (sum(data[:0x14E]) + sum(data[0x150:])) & 0xFFFF
        == int.from_bytes(data[0x14E:0x150], "big"),
        "sha256": hashlib.sha256(data).hexdigest(),
        "bank_zero_sha256": hashlib.sha256(data[:16384]).hexdigest(),
    }


def main():
    paths = sorted(p for p in (ROOT / "ROMs").iterdir() if p.suffix.lower() in {".gb", ".gbc"})
    if not paths:
        raise SystemExit("No ROMs found")
    roms = [inspect(p) for p in paths]
    print(json.dumps({
        "rom_count": len(roms),
        "total_rom_bytes": sum(r["bytes"] for r in roms),
        "distinct_bank_zero_images": len({r["bank_zero_sha256"] for r in roms}),
        "roms": roms,
    }, indent=2))
    if any(not r["size_matches_header"] or not r["header_checksum_valid"] for r in roms):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
