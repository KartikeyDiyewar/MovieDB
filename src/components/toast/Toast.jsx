import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearToast } from "../../features/baseUrl/basicDataSlice";
import "./Toast.css";

const Toast = () => {
  const dispatch = useDispatch();
  const toastMessage = useSelector((state) => state.base.toastMessage);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      dispatch(clearToast());
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage, dispatch]);

  if (!toastMessage) return null;

  return (
    <div className="toast-container" onClick={() => dispatch(clearToast())}>
      <span className="toast-text">{toastMessage}</span>
    </div>
  );
};

export default Toast;
