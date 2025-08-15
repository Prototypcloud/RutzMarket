import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/hooks/use-toast";

export default function CartSidebar() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCartStore();
  const { toast } = useToast();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleQuantityUpdate = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    const item = items.find(item => item.product.id === productId);
    removeItem(productId);
    if (item) {
      toast({
        title: "Item removed",
        description: `${item.product.name} has been removed from your cart.`,
      });
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Checkout initiated",
      description: "Redirecting to secure checkout...",
    });
    
    // In a real implementation, this would redirect to checkout
    console.log("Checkout with items:", items);
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            data-testid="cart-overlay"
          />
          
          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            data-testid="cart-sidebar"
          >
            {/* Header */}
            <div className="p-6 border-b border-cream">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-forest flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Shopping Cart ({totalItems})
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeCart}
                  className="text-gray-400 hover:text-forest"
                  data-testid="close-cart-button"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h4>
                  <p className="text-gray-500 text-sm mb-6">Add some premium botanical extracts to get started</p>
                  <Button
                    onClick={closeCart}
                    className="bg-forest text-white hover:bg-sage"
                    data-testid="continue-shopping-button"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-forest text-sm mb-1 truncate">
                                {item.product.name}
                              </h4>
                              <p className="text-xs text-gray-500 mb-2">{item.product.origin}</p>
                              <div className="text-lg font-bold text-forest">
                                €{item.product.price}
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="text-gray-400 hover:text-red-500 flex-shrink-0"
                              data-testid={`remove-item-${item.product.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityUpdate(item.product.id, item.quantity - 1)}
                                className="h-8 w-8 border-sage text-sage hover:bg-sage hover:text-white"
                                disabled={item.quantity <= 1}
                                data-testid={`decrease-quantity-${item.product.id}`}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              
                              <span 
                                className="w-8 text-center font-semibold text-forest"
                                data-testid={`quantity-${item.product.id}`}
                              >
                                {item.quantity}
                              </span>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityUpdate(item.product.id, item.quantity + 1)}
                                className="h-8 w-8 border-sage text-sage hover:bg-sage hover:text-white"
                                data-testid={`increase-quantity-${item.product.id}`}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm font-semibold text-forest">
                                €{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {items.length > 1 && (
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearCart}
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        data-testid="clear-cart-button"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Cart
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Footer with Total and Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-cream bg-cream">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-forest">€{totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-sage font-medium">Free</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-forest">Total</span>
                    <span 
                      className="text-2xl font-bold text-forest"
                      data-testid="cart-total"
                    >
                      €{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-forest text-white py-3 rounded-lg font-semibold hover:bg-sage transition-colors"
                    size="lg"
                    data-testid="checkout-button"
                  >
                    Secure Checkout
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    🔒 Secure SSL encryption • Free shipping on all orders
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
