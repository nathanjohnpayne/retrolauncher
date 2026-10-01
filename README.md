# RetroLauncher

A proposed cartridge launcher for the 13 games in the [ModRetro + Codex collection](https://developers.openai.com/modretro), designed for the Chromatic’s 160 × 144 display and the existing ModRetro programmable cartridge.

**[Try the interactive wireframes](https://nathanjohnpayne.github.io/retrolauncher/)** · **[Read the annotated design](docs/wireframes.md)** · **[View the full storyboard](docs/wireframes/storyboard.svg)**

![Six proposed launcher screens: browse, next cartridge, lift, insert, click, and game handoff](docs/wireframes/storyboard.svg)

## Current status

As of **September 30, 2026**, this is a design prototype and feasibility investigation. **There is no runnable multi-game launcher or flashable compilation yet.**

| Area | Status |
| --- | --- |
| Interface | Interactive browser wireframes and six static screens, with all 13 game titles, wrapping cartridge navigation, insertion animation, and a synthesized click. |
| Music | Browser preview can play the original site track after you enable it. Native Game Boy audio conversion is not implemented. |
| Supplied ROMs | 13 independent ROMs audited; total 4,259,840 bytes (4.0625 MiB). |
| Existing cartridge | Detected 4,194,304 bytes (4 MiB) of flash. The unmodified games exceed it by 64 KiB before adding the menu. No cartridge ROM was flashed. |
| Game switching | Unresolved. Standard MBC5 banking does not remap each game’s fixed bank; any cartridge-specific switching interface remains unverified. |
| Source access | Public game source was not located. A request for projects, build instructions, reuse terms, and switching documentation was sent to the OpenAI DevDay team. A response and maintainer routing remain unverified. |
| Saves and return to menu | Not implemented; require a defined native integration. |

See [hardware feasibility and research notes](docs/hardware-feasibility.md) for evidence and remaining work. Source access may make a shared build possible; fitting all games and running them correctly on this cartridge still need validation.

## Preview controls

- **← / →**: previous / next cartridge; wraps between 1 and 13.
- **A** or the **Select** button: play the proposed insertion sequence.
- **B / Escape**: return to the shelf in this browser preview.
- **M** or **Original site music**: toggle the requested background track, streamed from the official site.
- **Actual pixel size (1×)**: inspect the native screen dimensions. Reduced-motion preferences are respected; animation and click can also be disabled.

The handoff screen is explicitly a placeholder. The preview does not emulate, combine, or load the ROMs. Label illustrations are schematic, original wireframe artwork, not final game screenshots. Returning from a real game is not promised by the preview’s B control.

## Run locally

No npm dependencies or build step are required for the browser preview:

```sh
python3 -m http.server 8000 --directory docs
```

Open <http://localhost:8000>. To regenerate the checked-in static storyboard with Node.js:

```sh
node scripts/render_wireframes.mjs
```

To inspect the supplied ROM headers, sizes, checksums, and hashes without modifying them:

```sh
python3 scripts/audit_roms.py
```

## Project contents

- `ROMs/`: supplied individual game binaries, unchanged by the launcher work.
- `docs/`: browser wireframes, annotated design, storyboard, and feasibility notes.
- `scripts/`: static wireframe renderer and read-only ROM audit.

This is an unofficial project. The original games, names, artwork, and music remain associated with their respective creators; this repository does not establish new reuse rights for those materials. Reuse terms were included in the source request. The preview references the site music URL rather than bundling a copy.
