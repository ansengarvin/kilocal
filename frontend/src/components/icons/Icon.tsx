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
        default: {
            return (
                <div>Icon not found</div>
            )
        }
    }

}