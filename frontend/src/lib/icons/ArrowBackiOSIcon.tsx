import { IconProps } from "./common/IconProps";
import { GoogleSVG } from "./common/GoogleSVG";

// Plain closed book
export function ArrowBackiOSIcon(props: IconProps) {
    const {color, dim} = props

    return (
        <GoogleSVG
            color={color}
            dim={dim}
        >
            <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/>
        </GoogleSVG>
    )
}