import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { ArrowRight, Star, Truck, Shield, Headphones, Sparkles, Zap, ShoppingBag, TrendingUp, Award } from "lucide-react"
import Button from "../components/Button"
import { Card, CardContent } from "../components/Card"
import { useIntersectionObserver } from "../hooks/useIntersectionObserver"

const Landing = () => {
  const [heroRef, heroVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [featuresRef, featuresVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [productsRef, productsVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [statsRef, statsVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [testimonialsRef, testimonialsVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [ctaRef, ctaVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-gradient-x">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24 relative" ref={heroRef}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-4 md:mb-6 animate-fade-in animate-bounce-slow">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
              New Collection Available
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 lg:mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-slide-up animate-gradient-x">
              Discover Your Style
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-4 md:mb-6 lg:mb-8 max-w-2xl mx-auto animate-slide-up px-4" style={{ animationDelay: "0.1s" }}>
              Shop the latest trends in electronics, fashion, and home essentials. Quality products, unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-slide-up px-4" style={{ animationDelay: "0.2s" }}>
              <Link to="/products" className="w-full sm:w-auto">
                <Button size="lg" className="text-base md:text-lg px-6 md:px-8 w-full sm:w-auto group relative overflow-hidden">
                  <span className="relative z-10">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 inline group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Link>
              <Link to="/products" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 w-full sm:w-auto hover:scale-105 transition-transform">
                  View Catalog
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative Elements - Hidden on mobile for performance */}
        <div className="hidden md:block absolute top-20 left-10 w-48 h-48 lg:w-72 lg:h-72 bg-primary/20 rounded-full blur-3xl animate-float will-change-transform" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
        <div className="hidden md:block absolute bottom-20 right-10 w-64 h-64 lg:w-96 lg:h-96 bg-secondary/20 rounded-full blur-3xl animate-float will-change-transform" style={{ animationDelay: "1.5s", transform: `translateY(${scrollY * 0.2}px)` }} />
        <div className="hidden lg:block absolute top-1/2 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-bounce-slow will-change-transform" style={{ animationDelay: "0.5s", transform: `translateY(${scrollY * 0.4}px)` }} />
        <div className="hidden lg:block absolute top-1/3 right-1/4 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-rotate-slow will-change-transform" style={{ transform: `translateY(${scrollY * 0.25}px)` }} />
        {/* Floating Icons - Hidden on mobile */}
        <div className="hidden lg:block">
          <ShoppingBag className="absolute top-32 right-20 h-8 w-8 text-primary/30 animate-float will-change-transform" style={{ animationDelay: "0.3s", transform: `translateY(${scrollY * 0.15}px)` }} />
          <TrendingUp className="absolute bottom-32 left-20 h-8 w-8 text-primary/30 animate-float will-change-transform" style={{ animationDelay: "0.8s", transform: `translateY(${scrollY * 0.2}px)` }} />
          <Award className="absolute top-1/2 right-32 h-6 w-6 text-primary/20 animate-float will-change-transform" style={{ animationDelay: "1.2s", transform: `translateY(${scrollY * 0.1}px)` }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-12 lg:py-16 bg-background" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-6 md:mb-8 lg:mb-12 transition-all duration-700 ${featuresVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
              We're committed to providing you with the best shopping experience
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            <Card className={`group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${featuresVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'}`} style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-3 md:p-4 lg:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto mb-2 md:mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Truck className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-primary group-hover:animate-bounce-slow" />
                </div>
                <h3 className="text-sm md:text-base lg:text-lg font-semibold mb-1 md:mb-2">Free Shipping</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Free shipping on all orders over $50. Fast and reliable delivery worldwide.
                </p>
              </CardContent>
            </Card>
            <Card className={`group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${featuresVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'}`} style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-3 md:p-4 lg:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto mb-2 md:mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-primary group-hover:animate-bounce-slow" />
                </div>
                <h3 className="text-sm md:text-base lg:text-lg font-semibold mb-1 md:mb-2">Secure Payment</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Your payment information is safe with our encrypted checkout system.
                </p>
              </CardContent>
            </Card>
            <Card className={`group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${featuresVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'}`} style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-3 md:p-4 lg:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto mb-2 md:mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Headphones className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-primary group-hover:animate-bounce-slow" />
                </div>
                <h3 className="text-sm md:text-base lg:text-lg font-semibold mb-1 md:mb-2">24/7 Support</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Our customer support team is available around the clock to help you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-10 md:py-12 lg:py-16 bg-secondary/5" ref={productsRef}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-6 md:mb-8 lg:mb-12 transition-all duration-700 ${productsVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              Check out our most popular items
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
            <Card className={`overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${productsVisible ? 'animate-slide-in-left opacity-100' : 'opacity-0 -translate-x-8'}`} style={{ animationDelay: '0.1s' }}>
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
                  alt="Wireless Headphones"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-3 md:p-4 lg:p-6">
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-1">Wireless Headphones</h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">Premium sound quality</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg md:text-xl lg:text-2xl font-bold">$99.99</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs md:text-sm font-medium">4.5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${productsVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'}`} style={{ animationDelay: '0.2s' }}>
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
                  alt="Smart Watch"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-3 md:p-4 lg:p-6">
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-1">Smart Watch</h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">Track your fitness</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg md:text-xl lg:text-2xl font-bold">$199.99</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs md:text-sm font-medium">4.7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${productsVisible ? 'animate-slide-in-right opacity-100' : 'opacity-0 translate-x-8'}`} style={{ animationDelay: '0.3s' }}>
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
                  alt="Running Shoes"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-3 md:p-4 lg:p-6">
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-1">Running Shoes</h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">Comfort & performance</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg md:text-xl lg:text-2xl font-bold">$79.99</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs md:text-sm font-medium">4.3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className={`text-center transition-all duration-700 ${productsVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '0.4s' }}>
            <Link to="/products">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 md:py-12 lg:py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground animate-gradient-x" ref={statsRef}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 text-center">
            <div className={`transition-all duration-700 ${statsVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'}`} style={{ animationDelay: '0.1s' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">50K+</div>
              <div className="text-xs sm:text-sm md:text-base text-primary-foreground/80">Happy Customers</div>
            </div>
            <div className={`transition-all duration-700 ${statsVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'}`} style={{ animationDelay: '0.2s' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">10K+</div>
              <div className="text-xs sm:text-sm md:text-base text-primary-foreground/80">Products Available</div>
            </div>
            <div className={`transition-all duration-700 ${statsVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'}`} style={{ animationDelay: '0.3s' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">99%</div>
              <div className="text-xs sm:text-sm md:text-base text-primary-foreground/80">Satisfaction Rate</div>
            </div>
            <div className={`transition-all duration-700 ${statsVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'}`} style={{ animationDelay: '0.4s' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">24/7</div>
              <div className="text-xs sm:text-sm md:text-base text-primary-foreground/80">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 md:py-12 lg:py-16 bg-background" ref={testimonialsRef}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-6 md:mb-8 lg:mb-12 transition-all duration-700 ${testimonialsVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              Don't just take our word for it
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            <Card className={`hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${testimonialsVisible ? 'animate-slide-in-left opacity-100' : 'opacity-0 -translate-x-8'}`} style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-3 md:p-4 lg:p-6">
                <div className="flex items-center gap-1 mb-2 md:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base mb-2 md:mb-3 line-clamp-3">
                  "Amazing quality products and super fast shipping! I've been a customer for over a year and never been disappointed."
                </p>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="font-semibold text-primary text-xs md:text-sm">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base">John Doe</div>
                    <div className="text-xs md:text-sm text-muted-foreground">Verified Buyer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${testimonialsVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'}`} style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-3 md:p-4 lg:p-6">
                <div className="flex items-center gap-1 mb-2 md:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base mb-2 md:mb-3 line-clamp-3">
                  "The customer service is exceptional. They helped me find the perfect gift and even offered free gift wrapping!"
                </p>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="font-semibold text-primary text-xs md:text-sm">SM</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base">Sarah Miller</div>
                    <div className="text-xs md:text-sm text-muted-foreground">Verified Buyer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${testimonialsVisible ? 'animate-slide-in-right opacity-100' : 'opacity-0 translate-x-8'}`} style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-3 md:p-4 lg:p-6">
                <div className="flex items-center gap-1 mb-2 md:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base mb-2 md:mb-3 line-clamp-3">
                  "Best prices I've found anywhere. The quality exceeded my expectations. Will definitely be ordering again!"
                </p>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="font-semibold text-primary text-xs md:text-sm">MJ</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base">Mike Johnson</div>
                    <div className="text-xs md:text-sm text-muted-foreground">Verified Buyer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-12 lg:py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground relative overflow-hidden animate-gradient-x" ref={ctaRef}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${ctaVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'}`}>
            <Zap className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 mx-auto mb-3 md:mb-4 lg:mb-6 animate-bounce-slow" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 lg:mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-6 lg:mb-8 text-primary-foreground/90 px-4">
              Join thousands of satisfied customers and discover amazing deals today.
            </p>
            <Link to="/products" className="inline-block">
              <Button size="lg" variant="secondary" className="text-sm md:text-base lg:text-lg px-5 md:px-6 lg:px-8 hover:scale-105 transition-transform group relative overflow-hidden">
                <span className="relative z-10">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 inline group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Floating decorative elements - hidden on mobile */}
        <div className="hidden md:block absolute top-10 left-10 w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="hidden md:block absolute bottom-10 right-10 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      </section>
    </div>
  )
}

export default Landing
