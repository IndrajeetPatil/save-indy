# hextools

This folder contains the R script used to generate the `save-indy` hex
sticker logo.

## Generating the logo

The sticker artwork is `data.png`, the game's own pixel-art temple scene,
cropped from `public/og-image.png`. To regenerate the logo:

1. **Install R dependencies**:

   ```r
   install.packages(c("hexSticker", "magick", "showtext"))
   ```

2. **Run the script** from the repository root:

   ```bash
   Rscript hextools/script.R
   ```

   The generated logo is written to `docs/images/logo.png`.
