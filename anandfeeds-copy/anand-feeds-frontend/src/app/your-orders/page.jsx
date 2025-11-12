"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import Navbar from "@/components/Navbar";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [email, setEmail] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.email) {
      setEmail(session.user.email);
    } else if (session?.user?.phone) {
      setEmail(session.user.phone + "@gmail.com");
    } else {
      toast({
        title: "Please login",
        variant: "error",
        className: "bg-red-500 text-white",
      });
      router.push("/");
    }
  }, [session, status]);

  useEffect(() => {
    if (status === "loading" || !email) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/orders/${email}`
        );
        const data = response.data;
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Failed to load orders",
          variant: "error",
          className: "bg-red-500 text-white",
        });
      }
    };

    fetchOrders();
  }, [email]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-60">
        <ClipLoader />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Your Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <React.Fragment key={order.id}>
                      <TableRow>
                        <TableCell>{order.documentId}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>₹{order.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.responseCode === "SUCCESS"
                                ? "success"
                                : "destructive"
                            }
                          >
                            {order.responseCode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => toggleOrderExpansion(order.id)}
                          >
                            {expandedOrder === order.id ? (
                              <ChevronUp />
                            ) : (
                              <ChevronDown />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedOrder === order.id && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="bg-muted p-4 rounded-md">
                              <h4 className="font-semibold mb-2">
                                Order Details
                              </h4>
                              <p>Name: {order.name}</p>
                              <p>Email: {order.email}</p>
                              <p>Phone: {order.phoneNumber}</p>
                              <p>Transaction ID: {order.transactionId}</p>
                              <h4 className="font-semibold mt-4 mb-2">
                                Products
                              </h4>
                              {order.products.map((product) => (
                                <div
                                  key={product.id}
                                  className="mb-4 bg-background p-4 rounded-md"
                                >
                                  <h5 className="font-semibold">
                                    {product.name}
                                  </h5>
                                  <p className="text-sm text-muted-foreground">
                                    {
                                      product.description?.description ||
                                      "No description"
                                    }
                                  </p>
                                  {product.usage && (
                                    <p className="text-sm mt-2">
                                      <strong>Usage:</strong> {product.usage}
                                    </p>
                                  )}
                                  {Array.isArray(product.description?.features) &&
                                    product.description.features.length > 0 && (
                                      <details className="mt-2">
                                        <summary className="cursor-pointer text-sm font-medium">
                                          Features
                                        </summary>
                                        <ul className="list-disc list-inside text-sm mt-2">
                                          {product.description.features.map(
                                            (feature, index) => (
                                              <li key={index}>{feature}</li>
                                            )
                                          )}
                                        </ul>
                                      </details>
                                    )}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderPage;
