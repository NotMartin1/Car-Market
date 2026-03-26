"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { createListing } from "@/lib/mock-api";
import type { CreateListingInput } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, X, AlertCircle } from "lucide-react";

export default function PostListingPage() {
  const { isAuthenticated, login } = useMockAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const [formData, setFormData] = useState<Partial<CreateListingInput>>({
    condition: "good",
    images: [""],
    vehicleType: "car",
  });

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto mt-20 p-8 bg-card rounded-3xl border border-border text-center shadow-xl">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Authentication Required</h2>
          <p className="text-muted-foreground mb-8">You must be logged in to post a vehicle for sale on AutoMarket.</p>
          <Button size="lg" className="w-full" onClick={login}>
            Log In to Post Ad
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    if ((formData.images?.length || 0) < 10) {
      setFormData({ ...formData, images: [...(formData.images || []), ""] });
    }
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages?.length ? newImages : [""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const cleanedData = {
        ...formData,
        images: formData.images?.filter((img) => img.trim() !== "") || [],
      } as CreateListingInput;

      const result = await createListing(cleanedData);
      toast({ title: "Listing Created!", description: "Your car is now live on the marketplace." });
      router.push(`/listings/${result.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Error creating listing", description: message, variant: "destructive" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-foreground">Sell Your Vehicle</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Fill out the details below to list your vehicle on the marketplace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Details */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Make *</label>
                <Input required name="make" placeholder="e.g. Toyota" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Model *</label>
                <Input required name="model" placeholder="e.g. Camry" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year *</label>
                <Input required type="number" min="1900" max="2026" name="year" placeholder="2020" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price ($) *</label>
                <Input required type="number" min="1" name="price" placeholder="15000" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mileage (mi) *</label>
                <Input required type="number" min="0" name="mileage" placeholder="45000" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location (City, State) *</label>
                <Input required name="location" placeholder="San Francisco, CA" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Type *</label>
                <select
                  required
                  name="vehicleType"
                  onChange={handleChange}
                  value={formData.vehicleType || ""}
                  className="w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Select type...</option>
                  <option value="car">Car</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="van">Van</option>
                  <option value="rv">RV</option>
                  <option value="boat">Boat</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Condition *</label>
                <select
                  required
                  name="condition"
                  onChange={handleChange}
                  value={formData.condition}
                  className="w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Transmission</label>
                <select
                  name="transmission"
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Select...</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fuel Type</label>
                <select
                  name="fuelType"
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Select...</option>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Input name="color" placeholder="e.g. Silver" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Description *</h2>
            <textarea
              required
              name="description"
              onChange={handleChange}
              placeholder="Tell buyers about your car. Highlight features, history, and reasons for selling..."
              className="w-full min-h-[200px] rounded-xl border-2 border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-y"
            />
          </div>

          {/* Images */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
              <div>
                <h2 className="text-xl font-bold">Photos</h2>
                <p className="text-sm text-muted-foreground">Add URLs to high-quality images of your vehicle.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageField}
                disabled={(formData.images?.length || 0) >= 10}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Image
              </Button>
            </div>

            <div className="space-y-3">
              {formData.images?.map((url, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    required={index === 0}
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    icon={<Upload className="w-4 h-4" />}
                  />
                  {formData.images!.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="shrink-0"
                      onClick={() => removeImageField(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="px-10 text-lg shadow-xl shadow-primary/20"
              disabled={isPending}
            >
              {isPending ? "Publishing..." : "Post Listing"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
