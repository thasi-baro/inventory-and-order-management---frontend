import React from "react";
import { SignupForm } from "@/auth/signup-form";

const SignUpPage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 md:p-10 overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignUpPage;
