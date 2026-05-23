import ProductCard from "../components/ProductCard"
import { useIntersectionObserver } from "../hooks/useIntersectionObserver"

const Home = ({ filteredProducts, selectedCategory, searchQuery }) => {
  const [headerRef, headerVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [gridRef, gridVisible] = useIntersectionObserver({ threshold: 0.1 })

  const getTitle = () => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`
    }
    return selectedCategory === "all" ? "All Products" : selectedCategory
  }

  return (
    <>
      <div className={`mb-4 md:mb-6 lg:mb-8 transition-all duration-700 ${headerVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'}`} ref={headerRef}>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">{getTitle()}</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
        </p>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 md:py-12 text-muted-foreground animate-fade-in px-4">
          <p className="text-sm md:text-base lg:text-lg">No products found</p>
          <p className="text-xs md:text-sm lg:text-base">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 animate-fade-in" ref={gridRef}>
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-scale-in opacity-100"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Home
