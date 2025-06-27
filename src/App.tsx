import { BrowserRouter, Route, Routes } from "react-router-dom";
import { appRoutes } from "./Routes";
import LoginPage from "./pages/auth/LoginPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import ProtectedRoute from "./pages/global/ProtectedRoute";
import LayoutWrapper from "./pages/global/LayoutWrapper";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        <Route
          element={
            <ProtectedRoute>
              <LayoutWrapper />
            </ProtectedRoute>
          }
        >
          {appRoutes.map(({ path, element, id }) => (
            <Route key={id} path={path} element={element} />
          ))}
        </Route>
      </Routes>
      <ToastContainer position="bottom-left" />
    </BrowserRouter>
  );
}

export default App;
