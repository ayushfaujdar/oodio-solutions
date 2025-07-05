import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PortfolioItem } from "@shared/schema";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginSchema = z.object({
  password: z.string().min(1, "Password is required")
});

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["video", "content", "design"], {
    required_error: "Category is required"
  }),
  image: z.string().url("Please enter a valid image URL")
});

type LoginFormData = z.infer<typeof loginSchema>;
type PortfolioFormData = z.infer<typeof portfolioSchema>;

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" }
  });

  const portfolioForm = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "video",
      image: ""
    }
  });

  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ["/api/portfolio"],
    enabled: isAuthenticated
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsAuthenticated(true);
        toast({
          title: "Welcome to Admin Dashboard",
          description: "You can now manage portfolio items.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Invalid Password",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  });

  const addPortfolioMutation = useMutation({
    mutationFn: async (data: PortfolioFormData) => {
      await apiRequest("POST", "/api/portfolio", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      portfolioForm.reset();
      toast({
        title: "Portfolio item added",
        description: "Your new portfolio item has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding portfolio item",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/portfolio/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Portfolio item deleted",
        description: "The portfolio item has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting portfolio item",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleAddPortfolio = (data: PortfolioFormData) => {
    addPortfolioMutation.mutate(data);
  };

  const handleDeletePortfolio = (id: number) => {
    if (confirm("Are you sure you want to delete this portfolio item?")) {
      deletePortfolioMutation.mutate(id);
    }
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    loginForm.reset();
    portfolioForm.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-black/90 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400">
            {isAuthenticated ? "Admin Dashboard" : "Admin Access"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="bg-white/10 border-white/20 focus:border-cyan-400"
                            placeholder="Enter admin password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full btn-gradient"
                  >
                    {loginMutation.isPending ? "Authenticating..." : "Access Admin Panel"}
                  </Button>
                </form>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Add New Portfolio Item */}
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                    <Plus size={20} />
                    Add New Portfolio Item
                  </h3>
                  <Form {...portfolioForm}>
                    <form onSubmit={portfolioForm.handleSubmit(handleAddPortfolio)} className="space-y-4">
                      <FormField
                        control={portfolioForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/10 border-white/20 focus:border-cyan-400"
                                placeholder="Portfolio item title"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={portfolioForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={3}
                                className="bg-white/10 border-white/20 focus:border-cyan-400"
                                placeholder="Brief description of the project"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={portfolioForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/10 border-white/20 focus:border-cyan-400">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="video">Video Editing</SelectItem>
                                <SelectItem value="content">Content Writing</SelectItem>
                                <SelectItem value="design">Thumbnail Design</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={portfolioForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/10 border-white/20 focus:border-cyan-400"
                                placeholder="https://example.com/image.jpg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={addPortfolioMutation.isPending}
                        className="w-full btn-gradient"
                      >
                        {addPortfolioMutation.isPending ? "Adding..." : "Add Portfolio Item"}
                      </Button>
                    </form>
                  </Form>
                </div>

                {/* Existing Portfolio Items */}
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-400">Manage Portfolio Items</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                        <p className="mt-2 text-gray-400">Loading portfolio items...</p>
                      </div>
                    ) : portfolioItems?.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No portfolio items found.</p>
                    ) : (
                      portfolioItems?.map((item: PortfolioItem) => (
                        <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className="font-semibold text-cyan-400">{item.title}</h4>
                            <p className="text-sm text-gray-400 capitalize">{item.category}</p>
                          </div>
                          <Button
                            onClick={() => handleDeletePortfolio(item.id)}
                            disabled={deletePortfolioMutation.isPending}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
