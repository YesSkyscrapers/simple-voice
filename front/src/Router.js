import { createBrowserRouter, createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import Main from './routes/main/Main'

const ROUTES = {
    MAIN: '/'
}

const router = createBrowserRouter(
    [
        {
            path: ROUTES.MAIN,
            element: <Main />
        }
    ],
    {
        basename: '/simplevoice'
    }
)

const Router = () => {
    return <RouterProvider router={router} />
}

export default Router
export { ROUTES }
