/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Sparkles, LogIn } from "lucide-react";
import { useNavigate, Link, replace } from "react-router-dom";
import { toast } from "react-toastify";
import { signupApi, signinApi, googleSigninApi } from "../../services/allApis";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const AuthPage = ({ register }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setUser({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(user);
    const { username, email, password } = user;
    if (!username || !email || !password) {
      toast.warning("Enter Valid inputs!!");
    } else {
      const response = await signupApi(user);
      console.log(response);
      if (response.status === 200) {
        toast.success("Signup Successfull");
        setIsLogin(true);
        setUser({
          username: "",
          email: "",
          password: "",
        });
        navigate("/");
      } else {
        toast.error("Already a User!!!");
      }
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();

    const { email, password } = user;

    if (!email || !password) {
      toast.error("Enter Valid Inputs!!");
    } else {
      try {
        const response = await signinApi(user);

        console.log(response);

        if (response?.status === 200) {
          sessionStorage.setItem("token", response?.data?.token);
          sessionStorage.setItem("uname", response?.data?.username);
          sessionStorage.setItem("email", response?.data?.email);
          sessionStorage.setItem("bio", response?.data?.bio);
          sessionStorage.setItem("role", response?.data?.role);

          toast.success("Signin Successful!!");

          if (response?.data?.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        } else if (response?.status === 403) {
          toast.error(response?.data?.message || "Access Denied");
        } else {
          toast.error("Invalid Email/Password");
        }
      } catch (err) {
        console.log(err);
        toast.error("Invalid Email/Password");
      }
    }
  };
  const handleGoogleLogin = async (credential) => {
    try {
      console.log(credential);
      const decode_value = jwtDecode(credential?.credential);
      console.log(decode_value);

      const response = await googleSigninApi({
        username: decode_value?.given_name,
        email: decode_value?.email,
        profile: decode_value?.picture,
      });

      if (response?.status === 200) {
        sessionStorage.setItem("token", response?.data?.token);
        sessionStorage.setItem("uname", response?.data?.username);
        sessionStorage.setItem("email", response?.data?.email);
        sessionStorage.setItem("dp", response?.data?.profile);
        sessionStorage.setItem("bio", response?.data?.bio);
        sessionStorage.setItem("role", response?.data?.role);
        toast.success("Signin Successful!!");
        if (response?.data?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else if (response?.status === 403) {
        toast.error(response?.data?.message || "Access Denied");
      } else {
        toast.error("Signin Failed!!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Signin Failed!!");
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#030712] flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Dynamic Animated Background Elements */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse pointer-events-none"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse pointer-events-none"
        style={{ animationDuration: "10s", animationDelay: "2s" }}
      />
      <div
        className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse pointer-events-none"
        style={{ animationDuration: "7s", animationDelay: "4s" }}
      />

      {/* Left Section - Premium Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-end p-8 xl:p-12 relative border-r border-slate-800/40 bg-slate-950/20 backdrop-blur-sm">
        {/* Abstract grid background for tech feel */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRlcm4gaWQ9InNtYWxsR3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMTAgMEwwIDBMMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI3NtYWxsR3JpZCkiLz48cGF0aCBkPSJNNDAgMEwwIDBMMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

        <div className="w-full max-w-md xl:max-w-lg lg:pr-12 xl:pr-20 relative z-10 flex flex-col justify-center h-[80vh]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="bg-slate-900/50 p-4 rounded-2xl inline-block mb-8 border border-slate-800/60 backdrop-blur-md shadow-2xl">
              <img
                src="/NextHireLogo.png"
                alt="NextHire Logo"
                className="w-48 xl:w-56"
              />
            </div>
            <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Career Potential
              </span>
            </h1>
            <p className="text-base xl:text-lg text-slate-400 max-w-md leading-relaxed font-light">
              Experience the next generation of job hunting. Our AI precisely
              analyzes your resume, scores your skills, and helps you land the
              perfect role.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="mt-10"
          >
            <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/50 w-max shadow-2xl hover:border-slate-600/50 transition-colors cursor-default group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">AI-Driven Insights</p>
                <p className="text-xs text-slate-400">
                  Join thousands getting hired faster
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start p-6 sm:p-12 relative h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="w-full max-w-md xl:max-w-lg lg:pl-12 xl:pl-20 flex flex-col justify-center h-full max-h-[850px]"
        >
          {/* Mobile Logo */}
          <div className="flex justify-center lg:hidden mb-6">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-md shadow-xl">
              <img src="/NextHireLogo.png" alt="Logo" className="w-36" />
            </div>
          </div>

          <div className="text-center lg:text-left mb-6 lg:mb-8">
            <motion.h2
              key={isLogin ? "login-title" : "signup-title"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl xl:text-4xl font-bold text-white mb-2"
            >
              {isLogin ? "Welcome back" : "Create an account"}
            </motion.h2>
            <motion.p
              key={isLogin ? "login-desc" : "signup-desc"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm xl:text-base text-slate-400"
            >
              {isLogin
                ? "Enter your credentials to access your dashboard"
                : "Start your journey to better career opportunities"}
            </motion.p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-2xl p-6 lg:p-8 rounded-[2rem] border border-slate-700/50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group/card hover:border-slate-600/50 transition-colors duration-500">
            {/* Inner subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <form
              onSubmit={isLogin ? handleSignin : handleSignup}
              className="relative z-10 flex flex-col gap-4 xl:gap-5"
            >
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-1.5"
                  >
                    <label className="text-sm font-medium text-slate-300 ml-1">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 xl:py-3.5 text-sm xl:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-inner hover:bg-slate-900/50"
                        onChange={(e) => {
                          setUser({ ...user, username: e.target.value });
                        }}
                        required={!isLogin}
                        value={user.username}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 xl:py-3.5 text-sm xl:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-inner hover:bg-slate-900/50"
                    onChange={(e) => {
                      setUser({ ...user, email: e.target.value });
                    }}
                    required
                    value={user.email}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-slate-300">
                    Password
                  </label>
                  {isLogin && (
                    <a
                      href="#"
                      className="text-[11px] xl:text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 xl:py-3.5 text-sm xl:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-inner hover:bg-slate-900/50"
                    onChange={(e) => {
                      setUser({ ...user, password: e.target.value });
                    }}
                    required
                    value={user.password}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-2 xl:mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 xl:py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group border border-blue-500/30 text-sm xl:text-base"
              >
                <span>
                  {isLogin ? "Sign in to your account" : "Create your account"}
                </span>
                {isLogin ? (
                  <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </motion.button>

              <div className="relative flex items-center py-1 xl:py-2">
                <div className="flex-grow border-t border-slate-700/50"></div>
                <span className="flex-shrink-0 mx-4 text-slate-500 text-xs xl:text-sm font-medium">
                  or continue with
                </span>
                <div className="flex-grow border-t border-slate-700/50"></div>
              </div>

              <div className="w-full flex justify-center hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-white/5 p-1 rounded-full border border-white/10 shadow-lg backdrop-blur-sm">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      handleGoogleLogin(credentialResponse);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                    shape="pill"
                    theme="filled_black"
                  />
                </div>
              </div>
            </form>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-6 xl:mt-8 text-sm xl:text-base text-slate-400"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={handleToggle}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline underline-offset-4"
            >
              {isLogin ? "Sign up here" : "Sign in here"}
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
