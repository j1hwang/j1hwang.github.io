// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
import clipboardStyle from "./styles/clipboard.scss"
// @ts-ignore
import carouselScript from "./scripts/carousel.inline"
// @ts-ignore
import imageZoomScript from "./scripts/imageZoom.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body">{children}</div>
}

Body.afterDOMLoaded = [clipboardScript, carouselScript, imageZoomScript].join("\n")
Body.css = clipboardStyle

export default (() => Body) satisfies QuartzComponentConstructor
