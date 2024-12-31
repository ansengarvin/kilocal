import styled from "@emotion/styled";

interface iconStyleProps {
    height: string
    width: string
}

const IconStyle = styled.img<iconStyleProps>`
    height: ${props => props.height};
    width: ${props => props.width};
`

interface iconProps {
    iconName: string
    height: string
    width: string
}

export function Icon(props: iconProps) {
    const {iconName, height, width} = props
    switch(iconName) {
        case "backArrow": {
            return (
                <IconStyle 
                    src='/backArrow.svg'
                    alt='/forwardArrow.svg'
                    height={height}
                    width={width}
                />
            )
        }
        case "forwardArrow": {
            return (
                <IconStyle 
                    src='/forwardArrow.svg'
                    alt='Forward Arrow'
                    height={height}
                    width={width}
                />
            )
        }
        default: {
            return (
                <div>Icon not found</div>
            )
        }
    }

}