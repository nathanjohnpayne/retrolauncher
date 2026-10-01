# Launcher feasibility — 2026-09-30

Target: the ModRetro programmable cartridge supplied with the DevDay Chromatic.
Status: investigation; no working multi-game launcher or flashable compilation yet.
The user has confirmed that using this existing cartridge is a requirement.

## Physical cartridge detection

The plugin successfully detected the connected Player 01 cartridge at
2026-09-30 23:21:29 UTC (16:21:29 America/Los_Angeles).
Operation ID: `42715b2c39e0f2aedc5d66124b72066673919a9d3f6385e2597bb79cc550f1e8`.

- Flash: ISSI IS29GL032-70TLET-TR.
- Detected flash capacity: 4,194,304 bytes (4 MiB).
- Flash sector size: 65,536 bytes.
- Installed ROM header: OPENAI; MBC5+RUMBLE+RAM+BATTERY (0x1e),
  declaring 128 KiB ROM and 32 KiB RAM.
- Cartridge detection completed successfully. No cartridge ROM write was dispatched.

The installed ROM header describes that ROM's requirements; it does not prove
the physical mapper has no additional registers. Detection establishes flash
capacity, but does not establish a whole-game switching interface. The complete
unmodified set exceeds capacity by 65,536 bytes before menu assets. Rebuilding,
deduplication, or compression might reduce storage, but does not itself solve
execution mapping.

## Verified inputs

The 13 supplied ROMs total 4,259,840 bytes (4.0625 MiB), before a menu,
graphics, audio, alignment, or separate save storage. All declare MBC5 variants.
Run `python3 scripts/audit_roms.py` from any directory to inspect sizes, headers,
checksums, and SHA-256 hashes without modifying the cartridges.

The featured collection is at https://developers.openai.com/modretro.
Its HTML references the background track at
https://developers.openai.com/modretro/audio/ambient-chiptune-loop.mp3.
That identifies the requested recording; it is not a native Game Boy music file.
A native implementation needs an audio conversion or arrangement and an explicit
quality/CPU/storage budget. No music has been substituted or converted yet.

## Execution constraint

[MBC5 documentation](https://gbdev.io/pandocs/MBC5.html) specifies a fixed
16 KiB ROM region at addresses 0000–3FFF and a switchable region at 4000–7FFF.
Each standalone game expects its own startup code, interrupt vectors, and other
code/data in the fixed region. Concatenating these independent binaries and
jumping to address 0100 cannot provide that mapping. MBC5's nominal 8 MiB
address space alone does not make it a multi-game cartridge.

A menu-driven compilation needs a documented cartridge mechanism that remaps
the complete game, suitable ROM capacity, save isolation, and a defined way to
return to the menu. Alternatively, the games need substantial source-level
integration or binary adaptation; the supplied ROMs alone are not an established
implementation of that approach.

ModRetro's [DevDay quickstart](https://support.modretro.com/en_us/chromatic-devday-edition-quickstart-guid-By1iOlcMg)
documents flashing a ROM and streaming emulator gameplay from a computer. It
does not document a cartridge game-selection register or multi-ROM boot API.
Any proprietary switching extensions remain **unverified**. Absence from this
guide is not proof that no extension exists.

## Remaining work on the existing cartridge

Resolve the cartridge switching interface or rebuild the games into a shared
program before promising standalone operation. The 13 individual official game
pages were checked for download/source links: each exposes its corresponding ROM;
no source-project, GitHub, or ZIP download links were found in those pages' href/src
attributes. This does not establish that the authors have no available source.

### Public source search, September 30, 2026

An expanded internet and authenticated GitHub search did not locate source for
any of the 13 featured games. Checks included:

- Web searches covering all 13 game titles, source-code terms, and GitHub.
- Enumeration of OpenAI's public repositories and ModRetro's public repositories.
- GitHub repository searches for `org:openai modretro in:name,description,readme`
  and `org:openai chromatic in:name,description,readme`: both returned zero results,
  with `incomplete_results: false`.
- GitHub code searches for `flapgpt` and `whoadexware`: no matching game source.
- The full public `openai/plugins` main-branch tree: no paths matching ModRetro,
  Chromatic, FlapGPT, WhoadexWare, or Swarmfall.
- Repository/README inspection of the closest public matches:
  [pubmix/openai-flash-cart](https://github.com/pubmix/openai-flash-cart) is a
  logo/splash ROM; [bradflaugher/infinite-best](https://github.com/bradflaugher/infinite-best)
  is a different Game Boy puzzle game; [lfwgoes/flapGPT](https://github.com/lfwgoes/flapGPT)
  is an unrelated HTML/JavaScript game made with GPT-4.

The official [collection](https://developers.openai.com/modretro) advertises
browser play and ROM downloads. No statement promising a source release was
found in the checked material. The community showcase URL in ModRetro's guide
could not be opened by the web tool and is not included as verified evidence.

Conclusion: **public source not located**, not proof that source is unpublished.
Search indexing may lag a recent release. The next direct route is to request
the original projects/build instructions and reuse terms from the collection's
maintainers.

On September 30, 2026, a request was sent to the OpenAI DevDay team using its
verified event reply address, asking to route it to the collection maintainers.
It requests the 13 source projects, build instructions/toolchain versions, reuse
terms for the games/artwork/music, and any cartridge game-switching documentation.
Sending was confirmed; a response and maintainer routing remain unverified.

Source projects would allow investigation of a shared build, including fixed-bank
code, bank allocation, game initialization, save layout, and a return-to-menu
contract. Fitting that build into 4 MiB and validating all games remain separate
requirements, not guaranteed outcomes. A visual menu prototype alone would not
satisfy the requested ability to play every game.

The intended UI remains one cartridge at a time at 160×144, visible previous/next
hints, A to select, a cartridge insertion animation, and a synchronized click.
No cartridge ROM has been flashed. The approved cartridge detection may temporarily
reconfigure the console FPGA; it is not a permanent firmware installation.
