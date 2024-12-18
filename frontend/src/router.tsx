import { createBrowserRouter } from 'react-router-dom'
import { Root } from './components/root'
import App from './App'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: (
            <Root>
                404
            </Root>
        ),
        children: [
            {index: true, element: <App/>}
        ]
    }
])