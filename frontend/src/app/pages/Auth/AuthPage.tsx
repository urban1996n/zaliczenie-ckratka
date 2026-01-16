import { useState } from "react";
import { AuthForm } from "./AuthForm";

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <AuthForm isLogin={isLogin} />
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-500 hover:underline"
          >
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};
