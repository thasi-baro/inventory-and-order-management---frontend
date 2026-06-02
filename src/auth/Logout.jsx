import { useAuthStore } from "@/stores/useAuthStore";
import React from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
const Logout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
