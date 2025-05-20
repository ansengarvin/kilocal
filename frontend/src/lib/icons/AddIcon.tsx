import { IconProps } from "./common/IconProps";
import { GoogleSVG } from "./common/GoogleSVG";

// Plain closed book
export function AddIcon(props: IconProps) {
    const { color, dim } = props;

    return (
        <GoogleSVG color={color} dim={dim}>
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </GoogleSVG>
    );
}
