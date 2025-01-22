import { IconProps } from "./common/IconProps";
import { GoogleSVG } from "./common/GoogleSVG";

// Plain closed book
export function ArrowForwardiOSIcon(props: IconProps) {
    const {color, dim} = props

    return (
        <GoogleSVG
            color={color}
            dim={dim}
        >
            <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/> 
        </GoogleSVG>
    )
}