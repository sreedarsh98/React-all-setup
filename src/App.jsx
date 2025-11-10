import React from "react";
import Login from "./Components/Login";
import { Authprovider } from "./context/Authcontext";
import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Home from "./pages/dashboard/Home";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import Products from "./pages/dashboard/Products";
import AddProducts from "./Components/AddProduct/AddProducts";
import { Provider } from "react-redux";
import store from "./redux/store";
import ReduxtAction from "./pages/dashboard/ReduxtAction";
import StudentRegistration from "./pages/StudentRegistration";
import CustomerRegistration from "./pages/CustomerRegistration";
import TodoApp from "./pages/Todo";
import KanbanBoard from "./pages/KanbanBoard";
import ProductDetails from "./pages/dashboard/ProductDetails";
import Scrollpagination from "./pages/dashboard/Scrollpagination";
import SortProduct from "./pages/dashboard/Sort";
import PaginationProduct from "./pages/dashboard/PagintionProduct";
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Authprovider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Home />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:id" element={<ProductDetails />} />
                  <Route path="addproduct" element={<AddProducts />} />
                  <Route path="actions" element={<ReduxtAction />} />
                  <Route path="addstudent" element={<StudentRegistration />} />
                  <Route
                    path="addcustomer"
                    element={<CustomerRegistration />}
                  />
                  <Route path="todo" element={<TodoApp />} />
                  <Route path="kanban" element={<KanbanBoard />} />
                  <Route path="scroll" element={<Scrollpagination/>}/>
                  <Route path="sort" element={<SortProduct/>}/>
                  <Route path="pagination" element={<PaginationProduct/>}/>
                </Route>
              </Route>
            </Routes>
          </Authprovider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
