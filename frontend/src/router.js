import { createBrowserRouter } from 'react-router-dom';
import App from './App.js';
import Dashboard from './pages/Dashboard.jsx';
import ParcelsList from './pages/ParcelsList.jsx';
import ParcelDetail from './pages/ParcelDetail.jsx';
import SearchFilter from './pages/SearchFilter.jsx';
import CreateParcel from './pages/CreateParcel.jsx';
import TrackingList from './pages/TrackingList.jsx';
import TrackingDetail from './pages/TrackingDetail.jsx';
import ManageParcel from './pages/ManageParcel.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'parcels', element: <ParcelsList /> },
      { path: 'parcels/:id', element: <ParcelDetail /> },
      { path: 'search', element: <SearchFilter /> },
      { path: 'create', element: <CreateParcel /> },
      { path: 'tracking', element: <TrackingList /> },
      { path: 'tracking/:id', element: <TrackingDetail /> },
      { path: 'manage', element: <ManageParcel /> }
    ]
  }
]);

export default router;

