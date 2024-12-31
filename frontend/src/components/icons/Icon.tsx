interface iconProps {
    iconName: string
    color: string
    height?: string
    width?: string
}

// All SVG icons are sourced from https://fonts.google.com/icons
export function Icon(props: iconProps) {
    const {iconName, color, height, width} = props
    switch(iconName) {
        case "backArrow": {
            // arrow pointing left
            return (
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height={height}
                    viewBox="0 -960 960 960" 
                    width={height}
                    fill={color}
                >
                    <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/>
                </svg>
            )
        }
        case "forwardArrow": {
            // arrow pointing right
            return (
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height={height}
                    viewBox="0 -960 960 960" 
                    width={width}
                    fill={color}
                >
                    <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
                </svg>
            )
        }
        case "close": {
            // x icon
            return (
                <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    height={height}
                    viewBox="0 -960 960 960"
                    width={width}
                    fill={color}
                >
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
            )
        }
        case "delete": {
            // trash can icon
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={height}
                    viewBox="0 -960 960 960"
                    width={width}
                    fill={color}
                >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
            ) 
        }
        case "more": {
            // horizontal elipses icon
            return (
                <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    height={height}
                    viewBox="0 -960 960 960"
                    width={width}
                    fill={color}
                >
                    <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/>
                </svg>
            )
        }
        case "edit": {
            // pencil icon
            return (
                <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    height={height}
                    viewBox="0 -960 960 960"
                    width={width}
                    fill={color}
                >
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                </svg>
            )
        }
        default: {
            return (
                <div>Icon not found</div>
            )
        }
    }

}