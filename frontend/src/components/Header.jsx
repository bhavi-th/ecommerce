import { ShoppingCart, Search, User, X, ShoppingBag, Heart, Package, Menu, LogOut } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Button from "./Button"
import { useState } from "react"

const Header = ({ onMenuClick, searchQuery, onSearchChange }) => {
  const { cartCount } = useCart()
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const isLandingPage = location.pathname === "/"
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ease-out ${isLandingPage ? "bg-background/80 backdrop-blur-md" : "border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-md"} bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 will-change-transform`}>
      <div className="flex h-16 md:h-16 items-center justify-between px-4 md:px-8 w-full">
        {/* Left Section - Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          {!isLandingPage && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10 transition-all duration-200 rounded-xl"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300">
              <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight">
              Shop<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>

        {/* Center Section - Search Bar */}
        {!isLandingPage && (
          <>
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="search"
                  placeholder="Search for products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 rounded-2xl border-2 border-border bg-muted/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-foreground text-muted-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10 transition-all duration-200 rounded-xl"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {!isLandingPage && (
            <>
              {user ? (
                <>
                  {user.isSeller && (
                    <Link to="/seller-dashboard">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="hidden sm:flex items-center gap-2 hover:bg-primary/10 transition-all duration-200 rounded-xl"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        <span className="hidden md:inline">Seller Dashboard</span>
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="hidden sm:flex items-center gap-2 hover:bg-primary/10 transition-all duration-200 rounded-xl"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden md:inline">{user.name}</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="hidden sm:flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 rounded-xl"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="hidden md:inline">Sign Out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="hidden sm:flex items-center gap-2 hover:bg-primary/10 transition-all duration-200 rounded-xl"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden md:inline">Sign In</span>
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="hidden md:flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 rounded-xl"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}

          <Link to={isLandingPage ? "/products" : "/cart"}>
            <Button
              variant="ghost"
              size="lg"
              className="inline-flex items-center gap-2 hover:bg-primary/10 transition-all duration-200 rounded-xl relative whitespace-nowrap"
            >
              <ShoppingCart className="h-5 w-5 flex-shrink-0" />
              {!isLandingPage && <span className="hidden sm:inline">Cart</span>}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-[10px] md:text-[11px] font-bold text-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {isLandingPage && (
            <>
              <Link to="/products">
                <Button
                  size="lg"
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 rounded-xl"
                >
                  <Package className="h-5 w-5" />
                  Browse Products
                </Button>
              </Link>
              <Link to="/products" className="md:hidden">
                <Button
                  size="icon"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl shadow-primary/30 transition-all duration-300 rounded-xl"
                >
                  <Package className="h-5 w-5" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && !isLandingPage && (
        <div className="lg:hidden px-4 pb-4 animate-slide-down">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="search"
              placeholder="Search for products, brands, and more..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-12 pl-12 pr-12 rounded-2xl border-2 border-border bg-muted/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-foreground text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
