"use client";

import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetListing, useUpdateListing } from "@workspace/api-client-react";
import type { UpdateListingBodyFuelType, UpdateListingBodyTransmission } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@workspace/replit-auth-web";
import { useState, useEffect } from "react";
import React from "react";

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const { data: listing, isLoading } = useGetListing(id);
  const { mutateAsync: updateListing, isPending } = useUpdateListing();

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    description: "",
    location: "",
    condition: "good" as "excellent" | "good" | "fair" | "poor",
    fuelType: "",
    transmission: "",
    bodyType: "",
    color: "",
    vehicleType: "car" as "car" | "motorcycle" | "truck" | "van" | "suv" | "rv" | "boat" | "other",
    images: [""],
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        make: listing.make,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        mileage: listing.mileage,
        description: listing.description ?? "",
        location: listing.location ?? "",
        condition: (listing.condition as "excellent" | "good" | "fair" | "poor") ?? "good",
        fuelType: listing.fuelType ?? "",
        transmission: listing.transmission ?? "",
        bodyType: listing.bodyType ?? "",
        color: listing.color ?? "",
        vehicleType: (listing.vehicleType as "car" | "motorcycle" | "truck" | "van" | "suv" | "rv" | "boat" | "other") ?? "car",
        images: listing.images?.length ? listing.images : [""],
      });
    }
  }, [listing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanedData = {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        price: formData.price,
        mileage: formData.mileage,
        description: formData.description || undefined,
        location: formData.location || undefined,
        condition: formData.condition,
        vehicleType: formData.vehicleType,
        fuelType: (formData.fuelType || undefined) as UpdateListingBodyFuelType | undefined,
        transmission: (formData.transmission || undefined) as UpdateListingBodyTransmission | undefined,
        bodyType: formData.bodyType || undefined,
        color: formData.color || undefined,
        images: formData.images.filter(img => img.trim() !== ""),
      };
      await updateListing({ id, data: cleanedData });
      toast({ title: "Listing updated!", description: "Your listing has been saved." });
      router.push("/my-listings");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Error updating listing", description: message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded-xl w-1/3" />
          <div className="h-48 bg-muted rounded-3xl" />
        </div>
      </AppLayout>
    );
  }

  if (!listing) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto mt-20 p-8 bg-card rounded-3xl border text-center">
          <p className="text-muted-foreground">Listing not found.</p>
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated || user?.id !== listing.sellerId) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto mt-20 p-8 bg-card rounded-3xl border text-center">
          <p className="text-muted-foreground">You don't have permission to edit this listing.</p>
        </div>
      </AppLayout>
    );
  }

  const inputClass = "w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all";
  const selectClass = inputClass + " appearance-none";

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-foreground">Edit Listing</h1>
          <p className="text-muted-foreground mt-2 text-lg">Update your vehicle listing details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Type *</label>
                <select className={selectClass} name="vehicleType" value={formData.vehicleType} onChange={handleChange} required>
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
                <label className="text-sm font-medium">Make *</label>
                <Input className={inputClass} name="make" value={formData.make} onChange={handleChange} required placeholder="e.g. Toyota" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Model *</label>
                <Input className={inputClass} name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. Camry" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year *</label>
                <Input className={inputClass} name="year" type="number" value={formData.year} onChange={handleChange} required min={1900} max={new Date().getFullYear() + 1} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price ($) *</label>
                <Input className={inputClass} name="price" type="number" value={formData.price} onChange={handleChange} required min={0} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mileage *</label>
                <Input className={inputClass} name="mileage" type="number" value={formData.mileage} onChange={handleChange} required min={0} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Condition *</label>
                <select className={selectClass} name="condition" value={formData.condition} onChange={handleChange} required>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
                <Input className={inputClass} name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Austin, TX" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fuel Type</label>
                <select className={selectClass} name="fuelType" value={formData.fuelType} onChange={handleChange}>
                  <option value="">Select fuel type</option>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Transmission</label>
                <select className={selectClass} name="transmission" value={formData.transmission} onChange={handleChange}>
                  <option value="">Select transmission</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Body Type</label>
                <Input className={inputClass} name="bodyType" value={formData.bodyType} onChange={handleChange} placeholder="e.g. Sedan" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Input className={inputClass} name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Silver" />
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Description *</h2>
            <textarea
              required
              name="description"
              onChange={(e) => handleChange(e)}
              value={formData.description}
              placeholder="Tell buyers about your vehicle..."
              className="w-full min-h-[160px] rounded-xl border-2 border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-y"
            />
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Photos</h2>
            <div className="space-y-3">
              {formData.images.map((img, i) => (
                <div key={i} className="flex gap-3">
                  <Input
                    className="flex-1 h-12 rounded-xl border-2 border-border bg-background px-4 text-sm focus:outline-none focus:border-primary"
                    placeholder="https://example.com/image.jpg"
                    value={img}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                  />
                  {formData.images.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => {
                      const newImages = formData.images.filter((_, idx) => idx !== i);
                      setFormData({ ...formData, images: newImages.length ? newImages : [""] });
                    }}>×</Button>
                  )}
                </div>
              ))}
              {formData.images.length < 10 && (
                <Button type="button" variant="outline" onClick={() => setFormData({ ...formData, images: [...formData.images, ""] })}>
                  + Add another photo
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => router.push("/my-listings")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
