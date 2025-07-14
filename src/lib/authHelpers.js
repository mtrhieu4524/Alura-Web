import { useNavigate } from "react-router-dom";

export const useCheckAuthorization = (token, role, allowedRoles) => {
  const navigate = useNavigate();
  if (!token || !role) {
    navigate("/sign-in");
    return false;
  }

  // Kiểm tra nếu allowedRoles là array
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(role);
  }

  // Kiểm tra nếu allowedRoles là string
  if (typeof allowedRoles === "string") {
    return allowedRoles === role;
  }

  return false;
};
