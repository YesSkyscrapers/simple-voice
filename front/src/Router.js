import { createBrowserRouter, createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import Main from './routes/rework/main/Main'
import Auth from './routes/rework/auth/Auth'
import Rooms from './routes/rework/rooms/Rooms'
import Room from './routes/rework/room/Room'
import TestSound from './routes/rework/testsound/TestSound'
import Permission from './routes/rework/permission/Permission'

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
            element: <Main />
        },
        {
            path: ROUTES.AUTH,
            element: <Auth />
        },
        {
            path: ROUTES.ROOMS,
            element: <Rooms />
        },
        {
            path: ROUTES.ROOM,
            element: <Room />
        },
        {
            path: ROUTES.TEST_SOUND,
            element: <TestSound />
        },
        {
            path: ROUTES.PERMISSION,
            element: <Permission />
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
