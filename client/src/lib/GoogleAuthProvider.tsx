import { GoogleOAuthProvider } from "@react-oauth/google";

function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId="717187870283-j85s0teq0h834t34ha7h5p22sm3o1qu8.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}

export default GoogleAuthProvider;
