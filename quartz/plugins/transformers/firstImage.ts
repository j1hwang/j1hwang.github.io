import { QuartzTransformerPlugin } from "../types"
import { visit, EXIT } from "unist-util-visit"
import { Element } from "hast"

declare module "vfile" {
  interface DataMap {
    firstContentImage?: string
  }
}

/**
 * Extracts the first image src from the HTML AST and stores it in vfile.data.firstContentImage.
 * Used by the OG image emitter to use the first content image as the social preview image.
 */
export const FirstContentImage: QuartzTransformerPlugin = () => {
  return {
    name: "FirstContentImage",
    htmlPlugins() {
      return [
        () => (tree, file) => {
          let firstImageSrc: string | undefined = undefined
          visit(tree, "element", (node: Element) => {
            if (node.tagName === "img" && node.properties?.src) {
              firstImageSrc = node.properties.src as string
              return EXIT
            }
          })
          if (firstImageSrc) {
            file.data.firstContentImage = firstImageSrc
          }
        },
      ]
    },
  }
}
