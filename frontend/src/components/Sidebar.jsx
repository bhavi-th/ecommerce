import { X, Home, Shirt, Zap, Coffee } from "lucide-react"
import Button from "./Button"

const Sidebar = ({ isOpen, onClose, onCategoryChange, selectedCategory }) => {
  const categories = [
    { id: "all", name: "All Products", icon: Home },
    { id: "Electronics", name: "Electronics", icon: Zap },
    { id: "Fashion", name: "Fashion", icon: Shirt },
    { id: "Home", name: "Home & Kitchen", icon: Coffee },
  ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r bg-background transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold">Categories</h2>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.id)
                    if (window.innerWidth < 768) onClose()
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{category.name}</span>
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
