import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Reportes from "../pages/Reportes";
import Empleados from "../pages/Empleados";
import Asistencias from "../pages/Asistencias";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import Usuarios from "../pages/Usuarios";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";

const AppRouter = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <BrowserRouter>
      <Routes>
        {/*  RUTA RAÍZ  */}
        <Route
          path="/"
          element={
            usuario ? (
              usuario.rol === "admin" ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/asistencias" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute rolesPermitidos={["admin"]}>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/empleados"
          element={
            <ProtectedRoute rolesPermitidos={["admin"]}>
              <MainLayout>
                <Empleados />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute rolesPermitidos={["admin"]}>
              <MainLayout>
                <Usuarios />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN + EMPLEADO */}
        <Route
          path="/asistencias"
          element={
            <ProtectedRoute rolesPermitidos={["admin", "empleado"]}>
              <MainLayout>
                <Asistencias />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <ProtectedRoute rolesPermitidos={["admin", "empleado"]}>
              <MainLayout>
                <Reportes />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/*  RUTA NO EXISTENTE */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

// import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
// import Reportes from "../pages/Reportes";
// import Empleados from "../pages/Empleados";
// import Asistencias from "../pages/Asistencias";
// import Login from "../pages/Login";
// import ProtectedRoute from "../components/ProtectedRoute";
// import { Link } from "react-router-dom";
// import Usuarios from "../pages/Usuarios";
// import MainLayout from "../layouts/MainLayout";
// import Navbar from "../components/Navbar";
// import Dashboard from "../pages/Dashboard";

// const AppRouter = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />

//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute rolesPermitidos={["admin"]}>
//               <MainLayout>
//                 <Dashboard />
//               </MainLayout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/empleados"
//           element={
//             <ProtectedRoute rolesPermitidos={["admin"]}>
//               <MainLayout>
//                 <Empleados />
//               </MainLayout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/asistencias"
//           element={
//             <ProtectedRoute rolesPermitidos={["admin", "empleado"]}>
//               <MainLayout>
//                 <Asistencias />
//               </MainLayout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/reportes"
//           element={
//             <ProtectedRoute rolesPermitidos={["admin", "empleado"]}>
//               <MainLayout>
//                 <Reportes />
//               </MainLayout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/usuarios"
//           element={
//             <ProtectedRoute rolesPermitidos={["admin"]}>
//               <MainLayout>
//                 <Usuarios />
//               </MainLayout>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppRouter;
