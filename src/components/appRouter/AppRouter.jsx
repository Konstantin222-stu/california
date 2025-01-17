import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { routers } from "../../router/routers";

const AppRouter = () => {
  return (
    <Routes>
      {routers.map((route) => (
        <Route
          element={<route.component />}
          path={route.path}
          key={route.path}
        />
      ))}
      <Route path="*" element={<Navigate to="/main" replace />} />
    </Routes>
  );
};

export default AppRouter;