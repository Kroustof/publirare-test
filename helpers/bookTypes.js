export const bookTypes = {
  manga: {
    format: "manga",
    extensions: {
      "full-png": { name: "full-png", background: "png", cover:"png", book: "png" },
      "full-jpg": { name: "full-jpg", background: "jpg", cover:"jpg", book: "jpg" },
    },
    sizes: ["standard"],
    width: 209,
    height: 315
  },
  roman: {
    format: "roman",
    extensions: {
      "full-png": { name: "full-png", background: "png", cover:"png", book: "png" },
      "full-jpg": { name: "full-jpg", background: "jpg", cover:"jpg", book: "jpg" },
    },
    sizes: ["small", "standard", "large"],
    width: 270,
    height: 378
  },
  comic: {
    format: "comic",
    extensions: {
      "full-png": { name: "full-png", background: "png", cover:"png", book: "png" },
      "full-jpg": { name: "full-jpg", background: "jpg", cover:"jpg", book: "jpg" },
    },
    sizes: ["small", "large"],
    width: 281,
    height: 430
  },
}

