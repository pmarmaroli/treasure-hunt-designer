# Reduce PDF Printing: Shared Riddle Posters + Navigation Slips

## Problem

The app generates one full A4 page per participant per location for riddle sheets. For a typical hunt (8 participants, 6 locations), this produces 48 riddle pages plus start instructions and summary — ~55 pages total. This is excessive for printing.

## Key Insight

The riddle text is identical for all participants at a given location. Only the navigation info (next location clue or final code instructions) differs per participant. Currently, both are combined on one full page per participant per location.

## Design

### New PDF structure: Riddle Posters + Navigation Slips

Replace `generateRiddleSheetsPDF` with two new generators:

#### 1. Riddle Posters (`generateRiddlePostersPDF`)

One full A4 page per location (L pages total). Saved as `{title}_{postersFile}.pdf`.

Each poster contains:

- Hunt title
- Location name (so the organizer knows where to place it)
- Riddle text (large, readable font — 16pt body)
- Location label (e.g., "Location: Kitchen") — NOT a riddle number, since numbering is per-participant-circuit and meaningless on a shared poster
- A note: "Write your answer down, then open your envelope for instructions"

These are displayed openly at each station. All participants read the same poster.

#### 2. Navigation Slips (`generateNavigationSlipsPDF`)

Small personalized cards, printed **4 per A4 page** (2 columns x 2 rows), grouped by location. Saved as `{title}_{navigationSlipsFile}.pdf`.

Each slip contains:
- Participant name (bold, prominent — for envelope labeling)
- The instruction tied to this riddle's answer (e.g., "With your answer 3: take the first letter...")
- Either:
  - **Next location clue** (if not the last stop): "To find your next location: [clue]"
  - **Final code assembly instructions** (if last stop): all instructions listed to decode the secret code
- A dotted border/cut line around each slip (using `doc.setLineDash([3, 3])` for dotted lines)
- Footer: location name where this slip should be placed

**Grouping order**: All slips for Location 1 appear first, then Location 2, etc. Within each location group, normal slips come first (4-up), then last-stop slips (2-up). Within each sub-group, slips are in participant order. This lets the organizer cut slips for one location and immediately place them in envelopes there.

**Last-stop slips are larger**: Since the final slip includes all code instructions (one per riddle), these need a half-page (2 per page) instead of quarter-page. The generator detects `circuitIndex === participant.circuit.length - 1` per participant to determine this.

#### 3. Start Instructions PDF — unchanged

Stays as-is. Already compact (all participants on ~1-2 pages).

#### 4. Summary PDF — unchanged

Stays as-is. Organizer reference only.

### Page count example (8 participants, 6 locations)

| Component | Before | After |
|-----------|--------|-------|
| Riddle sheets | 48 pages | 0 (replaced) |
| Riddle posters | — | 6 pages |
| Navigation slips (normal, 4-up) | — | ~10 pages* |
| Navigation slips (last-stop, 2-up) | — | ~4 pages* |
| Start instructions | ~2 | ~2 |
| Summary | ~4 | ~4 |
| **Total** | **~54** | **~26** |

*Worked example: 8 participants x 6 locations = 48 slips. Each participant has 5 normal slips + 1 last-stop slip = 40 normal + 8 last-stop. Normal: 40 / 4 per page = 10 pages. Last-stop: 8 / 2 per page = 4 pages. Total slips: 14 pages.*

**Reduction: ~52%**

### Changes to `pdfGenerator.ts`

1. **Remove** `generateRiddleSheetsPDF`
2. **Add** `generateRiddlePostersPDF`:
   - Iterates over `treasureHunt.locations` (not participants)
   - One page per location with riddle text and location name
3. **Add** `generateNavigationSlipsPDF`:
   - Iterates locations (outer loop), then participants whose circuit includes that location (inner loop)
   - Renders 4 slips per page (or 2 per page for last-stop slips)
   - Draws dotted cut lines between slips using `doc.setLineDash([3, 3])`
   - Each slip has: participant name, instruction for this riddle, next clue or final code instructions
4. **Update** `generateTreasureHuntPDFs` to call the two new functions instead of `generateRiddleSheetsPDF`
5. **Remove** orphaned translation keys from `pdfTranslations`: `riddlesFile`, `printAndPlace`, `printAndPlaceCont`, `riddleFor`, `riddleNumber`, `dear`, `writeAnswer`, `followInstructions`, `goToNextLocation` (all were only used in the removed `generateRiddleSheetsPDF`)
6. **Add** new translation keys (see Translation Keys section below)

### Changes to `App.tsx`

The UI currently has two separate download mechanisms for riddle content:

1. **"Riddle Sheets" button** (line 810) — calls `generateRiddleSheets()` (lines 327-361), which generates a **text file** (.txt) with hardcoded French text. This is a legacy plain-text export.
2. **"Generate All PDFs" button** (line 820) — calls `handleGeneratePDFs()`, which calls `generateTreasureHuntPDFs()`.

Changes:
- **Remove** the `generateRiddleSheets` function (lines 327-361) and its button (line 810) entirely. The PDF pipeline fully replaces this text-file export, which was French-only and not using the translation system.
- **Remove** the `generateStartInstructions` function (lines 304-325) and its button (line 802) for the same reason — it is a French-only hardcoded text export that duplicates the start instructions PDF.
- **Remove** the `riddleSheets` and `startInstructions` translation keys from `translations.ts` (button labels for the removed text exports).
- **Update** the button grid from `grid-cols-3` to `grid-cols-2` (or single column), since only 2 buttons remain: "Download JSON" and "Generate All PDFs".
- The "Generate All PDFs" button remains and continues to call `generateTreasureHuntPDFs`, which now produces 4 PDFs instead of 3 (posters + slips instead of riddle sheets).

### Translation Keys

#### New keys in `pdfTranslations` (pdfGenerator.ts) — all 3 languages (fr, en, es):

| Key | FR | EN | ES |
|-----|----|----|-----|
| `postersFile` | `affiches_enigmes` | `riddle_posters` | `carteles_acertijos` |
| `navigationSlipsFile` | `fiches_navigation` | `navigation_slips` | `fichas_navegacion` |
| `writeAnswerThenOpenEnvelope` | `Écris ta réponse puis ouvre ton enveloppe pour les instructions` | `Write your answer down, then open your envelope for instructions` | `Escribe tu respuesta y abre tu sobre para las instrucciones` |
| `cutAlongDottedLine` | `Découpez le long des pointillés` | `Cut along dotted line` | `Corte por la línea de puntos` |
| `placeAtLocation` | `À déposer au lieu :` | `Place at location:` | `Colocar en la ubicación:` |

#### Removed keys from `pdfTranslations`:

- `riddlesFile` (was used for the old riddle sheets PDF filename)
- `printAndPlace` / `printAndPlaceCont` (were used for the old riddle sheet footer)

#### Removed key from `translations.ts`:

- `riddleSheets` (was used for the text-file download button label)

### What does NOT change

- Start instructions PDF
- Summary PDF
- TreasureHuntGame.tsx (virtual game mode)
- TreasureHuntPreview.tsx
- TreasureHuntImporter.tsx
- Data model (Participant, Location, Riddle types)
- Game mechanics (envelopes at locations, code decoding)

## Edge Cases

- **Participant whose last stop varies**: The last-stop detection uses `circuitIndex === participant.circuit.length - 1`, which is per-participant. At a given location, some participants may have a normal slip and others a last-stop slip. Solution: within a location group, render all normal slips first (4-up), then all last-stop slips (2-up), with page breaks as needed between the two sub-groups.
- **Long riddle text on poster**: Use `splitTextToSize` as currently done; allow overflow to keep font readable.
- **Long clue text on slip**: Use smaller font (10pt) and `splitTextToSize` constrained to slip width (~80mm for quarter-page).
- **Location not in any circuit**: Skip it in poster generation. Only generate posters for locations actually used in at least one participant's circuit.
