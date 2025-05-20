import { IconProps } from "./common/IconProps";
import { GoogleSVG } from "./common/GoogleSVG";

// Plain closed book
export function RemoveIcon(props: IconProps) {
    const { color, dim } = props;

    return (
        <GoogleSVG color={color} dim={dim}>
            <path d="M200-440v-80h560v80H200Z" />
        </GoogleSVG>
    );
}
