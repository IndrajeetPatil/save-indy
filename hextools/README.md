# hextools

This folder contains the R script used to generate the `save-indy` hex
sticker logo.

## Generating the logo

The sticker artwork is `data.svg`, a pixel-for-pixel composition of the
game's own sprites from `src/scene/art.ts`: the snake, the explorer and the
golden idol on its pedestal, standing on a strip of temple floor. To
regenerate the logo:

1. **Install R dependencies**:

   ```r
   install.packages(c("hexSticker", "magick", "showtext"))
   ```

2. **Run the script** from the repository root:

   ```bash
   Rscript hextools/script.R
   ```

   The generated logo is written to `docs/images/logo.png`.
