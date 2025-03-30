import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const FlowGuard = ({
  children,
  expectedFlow,
}: {
  children: ReactNode;
  expectedFlow: string;
}) => {
  const location = useLocation();

  const navigate = useNavigate();

  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const isValid = location.state?.flow === expectedFlow;

    if (isValid) {
      setIsAllowed(true);
    } else {
      navigate("/404_NOT_FOUND", { replace: true });
    }
  }, [location.state, expectedFlow, navigate]);

  return isAllowed ? children : null;
};
