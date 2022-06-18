import PreviewInsideManga from "../components/Preview/Manga/PreviewInsideManga"
import PreviewManga from '../components/Preview/Manga/PreviewManga'
import PreviewInsideRomanStandard from "../components/Preview/Roman/PreviewInsideRomanStandard"
import previewRomanStandard from "../components/Preview/Roman/PreviewRomanStandard"


export const bookPreviews = {
  manga: {
    "standard": PreviewManga
  },
  roman: {
    "standard": previewRomanStandard
  }
}


export const insideBookPreviews = {
  manga: {
    "standard": PreviewInsideManga
  },
  roman: {
    "standard": PreviewInsideRomanStandard
  }
}