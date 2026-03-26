"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { createListing } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, X, AlertCircle } from "lucide-react";

const VEHICLE_TYPES = ["car", "suv", "truck", "motorcycle", "van", "rv", "boat", "other"] as const;
const CONDITIONS    = ["excellent", "good", "fair", "poor"] as const;

const schema = z.object({
  make:         z.string().min(1, "Make is required."),
  model:        z.string().min(1, "Model is required."),
  year:         z.coerce.number().min(1900, "Min year 1900.").max(2027, "Max year 2027."),
  price:        z.coerce.number().min(1, "Price must be at least $1."),
  mileage:      z.coerce.number().min(0, "Mileage cannot be negative."),
  location:     z.string().min(1, "Location is required."),
  vehicleType:  z.enum(VEHICLE_TYPES),
  condition:    z.enum(CONDITIONS),
  transmission: z.string().optional(),
  fuelType:     z.string().optional(),
  color:        z.string().optional(),
  description:  z.string().min(1, "Description is required."),
  images:       z.array(z.object({ url: z.string() })).min(1),
});

type FormValues = z.infer<typeof schema>;

const selectClass = "w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none";

export default function PostListingPage() {
  const { isAuthenticated, login } = useMockAuth();
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      condition:   "good",
      vehicleType: "car",
      images:      [{ url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "images" });

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

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await createListing({
        ...data,
        images: data.images.map((img) => img.url).filter((u) => u.trim() !== ""),
      } as any);
      toast({ title: "Listing Created!", description: "Your car is now live on the marketplace." });
      router.push(`/listings/${result.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Error creating listing", description: message, variant: "destructive" });
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Details */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Make *</label>
                <Input placeholder="e.g. Toyota" {...register("make")} />
                {errors.make && <p className="text-xs text-destructive">{errors.make.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Model *</label>
                <Input placeholder="e.g. Camry" {...register("model")} />
                {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year *</label>
                <Input type="number" min="1900" max="2027" placeholder="2020" {...register("year")} />
                {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price ($) *</label>
                <Input type="number" min="1" placeholder="15000" {...register("price")} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mileage (mi) *</label>
                <Input type="number" min="0" placeholder="45000" {...register("mileage")} />
                {errors.mileage && <p className="text-xs text-destructive">{errors.mileage.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location (City, State) *</label>
                <Input placeholder="San Francisco, CA" {...register("location")} />
                {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Type *</label>
                <select className={selectClass} {...register("vehicleType")}>
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
                <select className={selectClass} {...register("condition")}>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Transmission</label>
                <select className={selectClass} {...register("transmission")}>
                  <option value="">Select...</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fuel Type</label>
                <select className={selectClass} {...register("fuelType")}>
                  <option value="">Select...</option>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Input placeholder="e.g. Silver" {...register("color")} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Description *</h2>
            <textarea
              placeholder="Tell buyers about your car. Highlight features, history, and reasons for selling..."
              className={`w-full min-h-[200px] rounded-xl border-2 bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-y ${errors.description ? "border-destructive" : "border-border"}`}
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
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
                onClick={() => fields.length < 10 && append({ url: "" })}
                disabled={fields.length >= 10}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Image
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <Input
                    placeholder="https://..."
                    icon={<Upload className="w-4 h-4" />}
                    {...register(`images.${index}.url`)}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="shrink-0"
                      onClick={() => remove(index)}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Post Listing"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
