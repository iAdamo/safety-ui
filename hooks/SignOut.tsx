import { logoutUser } from "@/api/authHelper";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";

export const useSignOut = () => {
  const dispatch = useDispatch();
  const signOut = async () => {
    try {
      const response = await logoutUser();
      if (response) {
        dispatch(logout());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return signOut;
};
