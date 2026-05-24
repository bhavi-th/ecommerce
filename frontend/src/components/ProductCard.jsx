import { Star, ShoppingCart, Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "./Card"
import Button from "./Button"
import Badge from "./Badge"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { user } = useUser()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate("/login")
      return
    }
    try {
      await addToCart(product)
    } catch (error) {
      if (error.message === 'Authentication required') {
        navigate("/login")
      }
    }
  }

  return (
    <Link to={`/products/${product.id}`}>
      <Card
        className="overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 will-change-transform border-border/50 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-square overflow-hidden relative bg-muted/20">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200">
              <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
            </button>
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-sm md:text-base px-4 py-2 bg-black/80 rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs font-medium px-2 py-1">{product.category}</Badge>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{product.rating}</span>
            </div>
          </div>
          <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</span>
            <span className={`text-xs font-medium ${product.stock < 5 ? 'text-orange-500' : 'text-muted-foreground'}`}>
              {product.stock} left
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium h-11"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 flex-shrink-0" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default ProductCard
