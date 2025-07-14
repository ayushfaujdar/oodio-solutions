import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Trash2, Upload, Image, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PortfolioItem, Category } from "@shared/schema";

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
  category: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image is required")
});

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  displayName: z.string().min(1, "Display name is required"),
  color: z.string().min(1, "Color is required")
});

type LoginFormData = z.infer<typeof loginSchema>;
type PortfolioFormData = z.infer<typeof portfolioSchema>;
type CategoryFormData = z.infer<typeof categorySchema>;

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      category: "",
      image: ""
    }
  });

  const categoryForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      displayName: "",
      color: "blue"
    }
  });

  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ["/api/portfolio"],
    enabled: isAuthenticated
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
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
          description: "You can now manage portfolio items and categories.",
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
      setUploadedImageUrl("");
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
    mutationFn: async (id: string | number) => {
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

  const addCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      await apiRequest("POST", "/api/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      categoryForm.reset();
      toast({
        title: "Category added",
        description: "New category has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Category deleted",
        description: "The category has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setUploadedImageUrl(data.url);
      portfolioForm.setValue('image', data.url);
      toast({
        title: "File uploaded successfully",
        description: "You can now use this file in your portfolio item.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
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

  const handleAddCategory = (data: CategoryFormData) => {
    addCategoryMutation.mutate(data);
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      uploadMutation.mutate(file);
    }
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setUploadedImageUrl("");
    loginForm.reset();
    portfolioForm.reset();
    categoryForm.reset();
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
              <Tabs defaultValue="portfolio" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/10">
                  <TabsTrigger value="portfolio" className="data-[state=active]:bg-cyan-500/20">
                    <Image size={16} className="mr-2" />
                    Portfolio
                  </TabsTrigger>
                  <TabsTrigger value="categories" className="data-[state=active]:bg-purple-500/20">
                    <Tags size={16} className="mr-2" />
                    Categories
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="data-[state=active]:bg-blue-500/20">
                    <Upload size={16} className="mr-2" />
                    Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="portfolio" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Add New Portfolio Item */}
                    <div className="glass-effect rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
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
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white/10 border-white/20 focus:border-cyan-400">
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {(Array.isArray(categories) ? categories : []).map((category: Category) => (
                                      <SelectItem key={category.id} value={category.name}>
                                        {category.displayName}
                                      </SelectItem>
                                    ))}
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
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                  <div className="space-y-2">
                                    {uploadedImageUrl ? (
                                      <div className="relative">
                                        {uploadedImageUrl.match(/\.(mp4|mov|avi)$/i) ? (
                                          <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">
                                            <video
                                              src={uploadedImageUrl}
                                              className="w-full h-32 object-cover rounded-lg border border-white/20 cursor-pointer"
                                              controls
                                            />
                                          </a>
                                        ) : (
                                          <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">
                                            <img
                                              src={uploadedImageUrl}
                                              alt="Uploaded"
                                              className="w-full h-32 object-cover rounded-lg border border-white/20 cursor-pointer"
                                            />
                                          </a>
                                        )}
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          className="absolute top-2 right-2"
                                          onClick={() => {
                                            setUploadedImageUrl("");
                                            portfolioForm.setValue('image', "");
                                          }}
                                        >
                                          <X size={16} />
                                        </Button>
                                      </div>
                                    ) : (
                                      <Input
                                        {...field}
                                        className="bg-white/10 border-white/20 focus:border-cyan-400"
                                        placeholder="Image URL or upload below"
                                      />
                                    )}
                                  </div>
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
                      <h3 className="text-xl font-bold mb-4 text-cyan-400">Manage Portfolio Items</h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {isLoading ? (
                          <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                            <p className="mt-2 text-gray-400">Loading portfolio items...</p>
                          </div>
                        ) : (Array.isArray(portfolioItems) ? portfolioItems.length === 0 : true) ? (
                          <p className="text-gray-400 text-center py-8">No portfolio items found.</p>
                        ) : (
                          (Array.isArray(portfolioItems) ? portfolioItems : []).map((item: PortfolioItem) => (
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
                </TabsContent>

                <TabsContent value="categories" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Add New Category */}
                    <div className="glass-effect rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                        <Plus size={20} />
                        Add New Category
                      </h3>
                      <Form {...categoryForm}>
                        <form onSubmit={categoryForm.handleSubmit(handleAddCategory)} className="space-y-4">
                          <FormField
                            control={categoryForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category Name (URL-friendly)</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="bg-white/10 border-white/20 focus:border-purple-400"
                                    placeholder="e.g., video, content, design"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={categoryForm.control}
                            name="displayName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="bg-white/10 border-white/20 focus:border-purple-400"
                                    placeholder="e.g., Video Editing, Content Writing"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={categoryForm.control}
                            name="color"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Color Theme</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white/10 border-white/20 focus:border-purple-400">
                                      <SelectValue placeholder="Select color" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="cyan">Cyan</SelectItem>
                                    <SelectItem value="purple">Purple</SelectItem>
                                    <SelectItem value="blue">Blue</SelectItem>
                                    <SelectItem value="emerald">Emerald</SelectItem>
                                    <SelectItem value="orange">Orange</SelectItem>
                                    <SelectItem value="pink">Pink</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            disabled={addCategoryMutation.isPending}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                          >
                            {addCategoryMutation.isPending ? "Adding..." : "Add Category"}
                          </Button>
                        </form>
                      </Form>
                    </div>

                    {/* Existing Categories */}
                    <div className="glass-effect rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-purple-400">Manage Categories</h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {categoriesLoading ? (
                          <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                            <p className="mt-2 text-gray-400">Loading categories...</p>
                          </div>
                        ) : (Array.isArray(categories) ? categories.length === 0 : true) ? (
                          <p className="text-gray-400 text-center py-8">No categories found.</p>
                        ) : (
                          (Array.isArray(categories) ? categories : []).map((category: Category) => (
                            <div key={category.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                              <div className="flex-1">
                                <h4 className="font-semibold text-purple-400">{category.displayName}</h4>
                                <p className="text-sm text-gray-400">{category.name} • {category.color}</p>
                              </div>
                              <Button
                                onClick={() => handleDeleteCategory(category.id)}
                                disabled={deleteCategoryMutation.isPending}
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
                </TabsContent>

                <TabsContent value="upload" className="space-y-6">
                  <div className="glass-effect rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center justify-center gap-2">
                      <Upload size={20} />
                      Upload Media Files
                    </h3>
                    
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 mb-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*,video/*"
                        className="hidden"
                      />
                      
                      {uploadedImageUrl && (
                        <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">
                          {uploadedImageUrl.match(/\.(mp4|mov|avi)$/i) ? (
                            <video
                              src={uploadedImageUrl}
                              className="max-w-full h-48 object-cover rounded-lg mx-auto border border-white/20 cursor-pointer"
                              controls
                            />
                          ) : (
                            <img
                              src={uploadedImageUrl}
                              alt="Uploaded"
                              className="max-w-full h-48 object-cover rounded-lg mx-auto border border-white/20 cursor-pointer"
                            />
                          )}
                        </a>
                      )}
                      
                      <div>
                        <h4 className="text-lg font-medium mb-2">Drop files here or click to upload</h4>
                        <p className="text-gray-400 mb-4">Supports images and videos (no enforced size limit)</p>
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                        >
                          {isUploading ? "Uploading..." : "Choose Files"}
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      Once uploaded, the file URL will be automatically filled in the portfolio form.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}