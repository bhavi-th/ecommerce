import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, User, ShoppingBag, ArrowRight, Chrome, Github } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import Button from "../components/Button"
import { Link, useNavigate } from "react-router-dom"
import { useIntersectionObserver } from "../hooks/useIntersectionObserver"

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [headerRef, headerVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [cardRef, cardVisible] = useIntersectionObserver({ threshold: 0.1 })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    // Handle registration logic here
    console.log("Register:", formData)
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/2 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        {/* Logo */}
        <div className={`text-center mb-6 sm:mb-8 transition-all duration-700 ${headerVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'}`} ref={headerRef}>
          <Link to="/" className="inline-flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Shop<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>

        {/* Register Card */}
        <div className={`relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 ${cardVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'}`} ref={cardRef}>

          <div className="relative">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Create Account</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Join us and start your shopping journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className={`transition-all duration-500 ${cardVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.1s' }}>
                <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">Full Name</label>
                <div className="relative group">
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border-2 border-border bg-muted/50 pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-sm sm:text-base"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-500 ${cardVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.2s' }}>
                <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">Email Address</label>
                <div className="relative group">
                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border-2 border-border bg-muted/50 pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-sm sm:text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-500 ${cardVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.3s' }}>
                <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">Password</label>
                <div className="relative group">
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-xl border-2 border-border bg-muted/50 pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-sm sm:text-base"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-500 ${cardVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.4s' }}>
                <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">Confirm Password</label>
                <div className="relative group">
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full rounded-xl border-2 border-border bg-muted/50 pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-sm sm:text-base"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className={`flex items-start gap-2 transition-all duration-500 ${cardVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.5s' }}>
                <input type="checkbox" required className="rounded border-border bg-muted focus:ring-primary mt-1" />
                <label className="text-xs sm:text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Social Login Divider */}
              <div className={`relative transition-all duration-500 ${cardVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.55s' }}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="bg-card px-2 sm:px-4 text-muted-foreground">Or sign up with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className={`grid grid-cols-2 gap-3 sm:gap-4 transition-all duration-500 ${cardVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.6s' }}>
                <Button
                  type="button"
                  variant="outline"
                  className="inline-flex items-center justify-center gap-2 h-10 sm:h-11"
                >
                  <Chrome className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="inline-flex items-center justify-center gap-2 h-10 sm:h-11"
                >
                  <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">GitHub</span>
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 rounded-xl h-11 sm:h-12"
                size="lg"
              >
                Create Account
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className={`text-center text-xs sm:text-sm text-muted-foreground transition-all duration-500 ${cardVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.7s' }}>
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
