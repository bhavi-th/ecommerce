import ProductCard from "../components/ProductCard"

const Home = ({ filteredProducts, selectedCategory, searchQuery }) => {
  const getTitle = () => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`
    }
    return selectedCategory === "all" ? "All Products" : selectedCategory
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">{getTitle()}</h2>
        <p className="text-muted-foreground">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
        </p>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No products found</p>
          <p className="text-sm">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}

export default Home
