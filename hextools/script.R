library(hexSticker)
library(magick)
library(showtext)

google_font_name <- "Rubik"
font_add_google(google_font_name)

showtext_auto()

img <- image_read("hextools/data.png")

sticker(
    img,
    package = "save-indy",
    p_color = "#2B1D14",
    p_family = google_font_name,
    p_size = 40,
    p_x = 1,
    p_y = 1.5,
    s_x = 1,
    s_y = 0.88,
    s_width = 0.98,
    s_height = 0.74,
    h_color = "#6B5039",
    filename = "docs/images/logo.png",
    h_fill = "white",
    url = "https://www.indrapatil.com/save-indy/",
    u_x = 0.95,
    u_size = 8,
    u_color = "grey",
    dpi = 600
)
