import { toast } from "sonner";
import axios from "axios";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/Auth";
import { Button } from "@/components/ui/button";

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
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message || "Login failed");
        } else {
          console.error(error);
          toast.error("Login failed");
        }
      });
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col justify-center gap-8 p-8 text-center">
      {!authState ? (
        <GoogleLogin onSuccess={onSuccess} />
      ) : (
        <div className="flex flex-col gap-4">
          <p className="whitespace-pre text-left">
            {JSON.stringify(authState, null, 4)}
          </p>
          <Button className="self-center" onClick={() => setAuthState(null)}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Login;
