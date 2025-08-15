import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Calendar, DollarSign, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { Order, OrderItem, Product } from "@shared/schema";

export default function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Mock user ID for demo
  const userId = "demo-user";

  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/users", userId, "orders"],
  });

  const { data: orderDetails } = useQuery({
    queryKey: ["/api/orders", selectedOrder],
    enabled: !!selectedOrder,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredOrders = orders?.filter((order: Order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" data-testid="order-history-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="page-title">
          Order History
        </h1>
        <p className="text-gray-600 dark:text-gray-300" data-testid="page-description">
          Track your purchases and manage your orders
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-orders"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="filter-status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders?.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center" data-testid="no-orders">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria" 
                  : "You haven't placed any orders yet"}
              </p>
              <Button data-testid="button-shop-now">
                Start Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders List */}
          <div className="space-y-4" data-testid="orders-list">
            {filteredOrders?.map((order: Order) => (
              <Card 
                key={order.id} 
                className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedOrder === order.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedOrder(order.id)}
                data-testid={`order-card-${order.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Order #{order.id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)} data-testid={`status-${order.id}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-medium">${parseFloat(order.total).toFixed(2)}</span>
                    </div>
                    
                    {order.trackingNumber && (
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        <Truck className="h-4 w-4 inline mr-1" />
                        {order.trackingNumber}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500">
                      Click to view details
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Details */}
          <div className="lg:sticky lg:top-4">
            {selectedOrder && orderDetails ? (
              <Card data-testid="order-details">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2" />
                    Order Details
                  </CardTitle>
                  <CardDescription>
                    Order #{selectedOrder.slice(-8)} • {new Date(orderDetails.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Status */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status</span>
                    <Badge className={getStatusColor(orderDetails.status)}>
                      {getStatusIcon(orderDetails.status)}
                      <span className="ml-1">{orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}</span>
                    </Badge>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">Items</h4>
                    <div className="space-y-2" data-testid="order-items">
                      {orderDetails.items?.map((item: OrderItem & { product: Product }) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${parseFloat(item.totalPrice).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${parseFloat(orderDetails.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>${parseFloat(orderDetails.shipping).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${parseFloat(orderDetails.tax).toFixed(2)}</span>
                    </div>
                    {parseFloat(orderDetails.discount) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-${parseFloat(orderDetails.discount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium text-lg border-t pt-2">
                      <span>Total</span>
                      <span>${parseFloat(orderDetails.total).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Tracking Information */}
                  {orderDetails.trackingNumber && (
                    <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded">
                      <p className="font-medium text-sm text-blue-900 dark:text-blue-100">Tracking Information</p>
                      <p className="text-sm text-blue-700 dark:text-blue-200">{orderDetails.trackingNumber}</p>
                      {orderDetails.shippedAt && (
                        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                          Shipped on {new Date(orderDetails.shippedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" data-testid="button-reorder">
                      Reorder Items
                    </Button>
                    {orderDetails.status === "delivered" && (
                      <Button variant="outline" className="flex-1" data-testid="button-review">
                        Leave Review
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">
                      Select an order to view details
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}