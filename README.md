# Treasure Hunt Designer

An interactive web app for creating personalized treasure hunts. Design riddles, define locations, assign unique circuits to each participant, and generate all the printable materials you need.

## Features

- **Multi-participant hunts** — each participant follows a unique randomized circuit through the same set of locations
- **Secret codes** — each riddle yields a digit; the full circuit produces a personal secret code that unlocks a final message
- **PDF generation** — produces 3 ready-to-print PDFs (see below)
- **Virtual test mode** — play through the hunt in-browser to verify everything works
- **Import/export** — save and reload hunts as JSON files
- **3 languages** — French (default), English, Spanish

## How It Works

The app guides you through 5 steps:

1. **General info** — hunt title, number of participants, number of riddles
2. **Participants** — name and secret final message for each
3. **Locations** — name and clue for each location
4. **Riddles** — riddle text, expected answer, instruction to extract a digit, and the expected digit
5. **Finalization** — preview, test, and download PDFs

At step 5, the app randomly assigns each participant a unique circuit (order of locations) and computes their secret code from the riddle digits.

## Generated PDFs

Clicking "Generate All PDFs" produces 3 files:

| PDF | Content | Pages |
|-----|---------|-------|
| **Riddle posters** | One poster per location with the riddle text. Display openly at each station. | L pages (one per location) |
| **Navigation sheets** | One sheet per participant with their starting clue and full circuit instructions (which riddle answer to use, next location clue, and final code assembly). | P pages (one per participant) |
| **Summary** | Organizer reference with all participants, codes, locations, circuits, and riddle answers. | ~4 pages |

For a typical hunt with 8 participants and 6 locations, this produces ~18 pages total.

## Running Locally

```bash
git clone https://github.com/pmarmaroli/treasure-hunt-designer.git
cd treasure-hunt-designer
npm install
npm run dev
```

Opens at `http://localhost:5173`. A "Load demo data" button on the home screen lets you quickly test with sample data.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- jsPDF (PDF generation)
- Lucide React (icons)

## Project Structure

```
src/
  App.tsx                      Main app with 5-step creation wizard
  pdfGenerator.ts              PDF generation (posters, navigation sheets, summary)
  TreasureHuntGame.tsx         "The Chest" test mode (enter code to reveal secret)
  TreasureHuntVirtualGame.tsx  Virtual test mode (play through the full hunt)
  TreasureHuntPreview.tsx      Preview component for step 5
  TreasureHuntImporter.tsx     JSON import with drag-and-drop
  components/
    FormattedText.tsx          i18n text with interpolation
    LanguageSelector.tsx       FR/EN/ES language switcher
  contexts/
    LanguageContext.tsx         Language state provider
  i18n/
    translations.ts            All UI translation strings (3 languages)
```

## i18n

The app uses two translation systems:

- **`translations.ts`** — UI strings (buttons, labels, form text) via a React context
- **`pdfTranslations` in `pdfGenerator.ts`** — PDF-specific strings (headers, instructions, filenames)

To add a language: add a new key to both translation objects and update the `Language` type.
