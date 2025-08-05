
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to opportunities page
    navigate('/opportunities');
  }, [navigate]);

  return null;
};

export default Index;
