// @ts-ignore
import sunlitScript from "./scripts/sunlit.inline"
import sunlitStyle from "./styles/sunlit.scss"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const Sunlit: QuartzComponent = () => {
  return (
    <div id="dappled-light">
      <div id="sl-glow"></div>
      <div id="sl-glow-bounce"></div>
      <div class="sl-perspective">
        <div id="sl-leaves">
          <svg style="width: 0; height: 0; position: absolute;">
            <defs>
              <filter id="sl-wind" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" numOctaves="2" seed="1">
                  <animate
                    attributeName="baseFrequency"
                    dur="16s"
                    keyTimes="0;0.33;0.66;1"
                    values="0.005 0.003;0.01 0.009;0.008 0.004;0.005 0.003"
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic">
                  <animate
                    attributeName="scale"
                    dur="20s"
                    keyTimes="0;0.25;0.5;0.75;1"
                    values="45;55;75;55;45"
                    repeatCount="indefinite"
                  />
                </feDisplacementMap>
              </filter>
            </defs>
          </svg>
        </div>
        <div id="sl-blinds">
          <div class="sl-shutters">
            {Array.from({ length: 23 }).map((_, i) => (
              <div key={i} class="sl-shutter"></div>
            ))}
          </div>
          <div class="sl-vertical">
            <div class="sl-bar"></div>
            <div class="sl-bar"></div>
          </div>
        </div>
      </div>
      <div id="sl-progressive-blur">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

Sunlit.afterDOMLoaded = sunlitScript
Sunlit.css = sunlitStyle

export default (() => Sunlit) satisfies QuartzComponentConstructor
