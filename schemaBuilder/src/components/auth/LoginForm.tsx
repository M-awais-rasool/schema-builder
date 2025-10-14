import { Database, ArrowRight, Github, Mail } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <motion.div
            className="relative"
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: "spring",
              stiffness: 200
            }}
          >
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl" />
            <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-xl p-3 shadow-lg">
              <Database className="h-9 w-9 text-primary-foreground" />
            </div>
          </motion.div>
        </div>
        <motion.h1
          className="mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Welcome Back
        </motion.h1>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Design your database schemas with ease
        </motion.p>
      </motion.div>

      <motion.div
        className="relative bg-card border border-border rounded-2xl p-8 shadow-xl backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent rounded-2xl pointer-events-none" />

        <motion.div
          className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-2xl -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background transition-all duration-200 focus:scale-[1.01] h-11"
              />
              {email && (
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </div>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-primary hover:underline transition-all duration-200 hover:translate-x-0.5"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input-background transition-all duration-200 focus:scale-[1.01] h-11"
              />
              {password && (
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              className="w-full h-11 group relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Sign in
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 100%",
                }}
              />
            </Button>
          </motion.div>
        </form>

        <motion.div
          className="mt-6 text-center relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-4 text-muted-foreground">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.85 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="w-full h-11 group relative overflow-hidden bg-background/50 hover:bg-background hover:border-primary/30"
                type="button"
              >
                <Github className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                GitHub
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="w-full h-11 group relative overflow-hidden bg-background/50 hover:bg-background hover:border-primary/30"
                type="button"
              >
                <Mail className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                Google
              </Button>
            </motion.div>
          </div>

          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <a href="#" className="text-primary hover:underline transition-all duration-200 hover:translate-x-0.5 inline-block">
              Sign up for free
            </a>
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="mt-8 text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <p className="text-muted-foreground">
          By signing in, you agree to our{" "}
          <a href="#" className="text-primary hover:underline transition-all duration-200">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline transition-all duration-200">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
