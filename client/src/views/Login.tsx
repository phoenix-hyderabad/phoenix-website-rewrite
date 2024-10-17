import { toast } from "sonner";
import axios from "axios";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/Auth";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { authState, setAuthState } = useAuth();

  const onSuccess = async (credentialResponse: CredentialResponse) => {
    axios
      .post("http://localhost:9000/api/login", {
        token: credentialResponse.credential,
      })
      .then((response) => {
        setAuthState(response.data.token);
        toast.success("Logged in successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Login failed");
      });
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col justify-center gap-8 p-8 text-center">
      {!authState ? (
        <GoogleLogin onSuccess={onSuccess} />
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </div>
  );
};

export default Login;
