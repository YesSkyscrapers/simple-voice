import { createBrowserRouter, createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import Main from './routes/rework/main/Main'
import Auth from './routes/rework/auth/Auth'
import Rooms from './routes/rework/rooms/Rooms'
import Room from './routes/rework/room/Room'
import TestSound from './routes/rework/testsound/TestSound'
import Permission from './routes/rework/permission/Permission'
import Info from './routes/rework/info/Info'

const ROUTES = {
    MAIN: '/',
    AUTH: '/auth',
    ROOMS: '/rooms',
    ROOM: '/room',
    TEST_SOUND: '/testsound',
    PERMISSION: '/permission'
}

const router = createBrowserRouter(
    [
        {
            path: ROUTES.MAIN,
            element: <Info />
        },
        {
            path: ROUTES.AUTH,
            element: <Info />
        },
        {
            path: ROUTES.ROOMS,
            element: <Info />
        },
        {
            path: ROUTES.ROOM,
            element: <Info />
        },
        {
            path: ROUTES.TEST_SOUND,
            element: <Info />
        },
        {
            path: ROUTES.PERMISSION,
            element: <Info />
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
