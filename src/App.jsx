import { useDispatch } from "react-redux";
import MainRoutes from "./routes/MainRoutes";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "./store/authSlice";
import { jwtDecode } from "jwt-decode";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "token" && event.newValue === null) {
        dispatch(logout());
        navigate("/sign-in");
        window.location.reload();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < now) {
            dispatch(logout());
            navigate("/sign-in");
          }
        } catch (err) {
          console.error("Token decoding error:", err);
          dispatch(logout());
          navigate("/sign-in");
        }
      }
    }, 60000); // 60s

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [dispatch, navigate]);
  return (
    <div>
      <MainRoutes />
    </div>
  );
}

export default App;
