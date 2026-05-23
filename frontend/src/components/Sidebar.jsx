import { X, Home, Shirt, Zap, Coffee, Laptop, Watch, Gamepad2, BookOpen, Dumbbell, Baby, Car, Utensils } from "lucide-react"
import Button from "./Button"

const Sidebar = ({ isOpen, onClose, onCategoryChange, selectedCategory }) => {
  const categories = [
    { id: "all", name: "All Products", icon: Home },
    { id: "Electronics", name: "Electronics", icon: Laptop },
    { id: "Fashion", name: "Fashion", icon: Shirt },
    { id: "Home", name: "Home & Kitchen", icon: Coffee },
    { id: "Accessories", name: "Accessories", icon: Watch },
    { id: "Gaming", name: "Gaming", icon: Gamepad2 },
    { id: "Books", name: "Books", icon: BookOpen },
    { id: "Sports", name: "Sports", icon: Dumbbell },
    { id: "Kids", name: "Kids", icon: Baby },
    { id: "Automotive", name: "Automotive", icon: Car },
    { id: "Food", name: "Food & Grocery", icon: Utensils },
  ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-border bg-background transition-transform duration-500 ease-out will-change-transform md:top-16 md:h-[calc(100vh-4rem)] ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-border">
            <h2 className="text-base md:text-lg font-bold">Categories</h2>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10 rounded-xl transition-all duration-200"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.id)
                    if (window.innerWidth < 768) onClose()
                  }}
                  className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-300 hover:scale-105 ${selectedCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "hover:bg-accent hover:text-accent-foreground hover:shadow-md"
                    }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
                  <span className="font-medium text-sm md:text-base">{category.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar
