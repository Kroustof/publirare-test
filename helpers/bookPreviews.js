import PreviewManga from '../components/Preview/Manga/PreviewManga'
import previewRomanSmall from "../components/Preview/Roman/PreviewRomanSmall"
import previewRomanLarge from "../components/Preview/Roman/PreviewRomanLarge"
import previewRomanStandard from "../components/Preview/Roman/PreviewRomanStandard"
import PreviewInsideManga from "../components/Preview/Manga/PreviewInsideManga"
import PreviewInsideRomanSmall from "../components/Preview/Roman/PreviewInsideRomanSmall"
import PreviewInsideRomanStandard from "../components/Preview/Roman/PreviewInsideRomanStandard"
import PreviewInsideRomanLarge from "../components/Preview/Roman/PreviewInsideRomanLarge"
import PreviewInsideComicSmall from "../components/Preview/Comic/PreviewInsideComicSmall"
import previewComicSmall from "../components/Preview/Comic/PreviewComicSmall"
import previewComicLarge from "../components/Preview/Comic/PreviewComicLarge"
import PreviewInsideComicLarge from "../components/Preview/Comic/PreviewInsideComicLarge"


export const bookPreviews = {
  manga: {
    "standard": PreviewManga
  },
  roman: {
    "small": previewRomanSmall,
    "standard": previewRomanStandard,
    "large": previewRomanLarge
  },
  comic: {
    "small": previewComicSmall,
    "large": previewComicLarge
  },
}


export const insideBookPreviews = {
  manga: {
    "standard": PreviewInsideManga
  },
  roman: {
    "small": PreviewInsideRomanSmall,
    "standard": PreviewInsideRomanStandard,
    "large": PreviewInsideRomanLarge,
  },
  comic: {
    "small": PreviewInsideComicSmall,
    "large": PreviewInsideComicLarge
  },
}