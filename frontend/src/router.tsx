import { createBrowserRouter } from 'react-router-dom'
import { Root } from './components/global/Root'
import App from './routes/App'
import { Login } from './routes/Login'
import Profile from './routes/Profile'

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
            {index: true, element: <App/>},
            {path: '/profile', element: <Profile/>},
            {path: '/login', element: <Login/>}
        ]
    }
])