import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Username from './components/Username';
import Password from './components/Password';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import Register from './components/Register';
import PageNotFound from './components/PageNotFound';
import Profile from './components/Profile';

import { AuthorizedUser, ProtectRoute } from './middleware/Auth';

/**Root routes */
const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Root Route</div>,
  },
  {
    path: '/login',
    element: <Username></Username>,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/password',
    element: (
      <ProtectRoute>
        <Password />
      </ProtectRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <AuthorizedUser>
        <Profile />
      </AuthorizedUser>
    ),
  },
  {
    path: '/recovery',
    element: <Recovery />,
  },
  {
    path: '/reset',
    element: <Reset />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
