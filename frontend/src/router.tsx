import { createBrowserRouter } from 'react-router-dom'
import { Root } from './components/root'
import App from './routes/App'
import Profile from './routes/Profile'
import Login from './routes/Login'

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