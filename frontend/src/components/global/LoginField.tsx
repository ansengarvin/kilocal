import styled from "@emotion/styled/macro";

interface LoginFieldProps {
    fieldName: string
    inputType: string
    onChangeFn: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const LoginFieldStyle = styled.div`
    
`

export function LoginField(props: LoginFieldProps) {
    const {fieldName, onChangeFn} = props
    return (
        <LoginFieldStyle>
            <label htmlFor={fieldName}>
                {fieldName}
            </label>
            <input type="text" id={fieldName} name={fieldName} type={inputType} onChange={onChangeFn}/>
        </LoginFieldStyle>
    )
}