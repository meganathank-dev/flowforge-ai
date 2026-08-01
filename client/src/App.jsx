import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import FoundationPage from './pages/FoundationPage.jsx';

/**
 * Root application component.
 * Sets up routing with React Router.
 */
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<FoundationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
