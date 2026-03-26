"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { getListing, updateListing } from "@/lib/mock-api";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { MockListing } from "@/lib/mock-data";

const VEHICLE_TYPES = ["car", "suv", "truck", "motorcycle", "van", "rv", "boat", "other"] as const;
const CONDITIONS    = ["excellent", "good", "fair", "poor"] as const;

const schema = z.object({
  vehicleType:  z.enum(VEHICLE_TYPES),
  make:         z.string().min(1, "Make is required."),
  model:        z.string().min(1, "Model is required."),
  year:         z.coerce.number().min(1900).max(2027),
  price:        z.coerce.number().min(0),
  mileage:      z.coerce.number().min(0),
  condition:    z.enum(CONDITIONS),
  location:     z.string().min(1, "Location is required."),
  fuelType:     z.string().optional(),
  transmission: z.string().optional(),
  bodyType:     z.string().optional(),
  color:        z.string().optional(),
  description:  z.string().min(1, "Description is required."),
  images:       z.array(z.object({ url: z.string() })).min(1),
});

type FormValues = z.infer<typeof schema>;

const inputClass  = "w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all";
const selectClass = inputClass + " appearance-none";

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const id     = params?.id ?? "";
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated } = useMockAuth();

  const [listing,   setListing]   = useState<MockListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleType:  "car",
      condition:    "good",
      year:         new Date().getFullYear(),
      images:       [{ url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "images" });

  useEffect(() => {
    getListing(id)
      .then((data) => {
        const l = data as MockListing;
        setListing(l);
        reset({
          vehicleType:  l.vehicleType,
          make:         l.make,
          model:        l.model,
          year:         l.year,
          price:        Number(l.price),
          mileage:      l.mileage,
          condition:    l.condition,
          location:     l.location ?? "",
          fuelType:     l.fuelType ?? "",
          transmission: l.transmission ?? "",
          bodyType:     l.bodyType ?? "",
          color:        l.color ?? "",
          description:  l.description ?? "",
          images:       l.images?.length ? l.images.map((url) => ({ url })) : [{ url: "" }],
        });
      })
      .finally(() => setIsLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateListing(id, {
        ...data,
        images: data.images.map((img) => img.url).filter((u) => u.trim() !== ""),
      } as any);
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

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-foreground">Edit Listing</h1>
          <p className="text-muted-foreground mt-2 text-lg">Update your vehicle listing details.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Type *</label>
                <select className={selectClass} {...register("vehicleType")}>
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
                <Input className={inputClass} placeholder="e.g. Toyota" {...register("make")} />
                {errors.make && <p className="text-xs text-destructive">{errors.make.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Model *</label>
                <Input className={inputClass} placeholder="e.g. Camry" {...register("model")} />
                {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year *</label>
                <Input className={inputClass} type="number" min={1900} max={new Date().getFullYear() + 1} {...register("year")} />
                {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price ($) *</label>
                <Input className={inputClass} type="number" min={0} {...register("price")} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mileage *</label>
                <Input className={inputClass} type="number" min={0} {...register("mileage")} />
                {errors.mileage && <p className="text-xs text-destructive">{errors.mileage.message}</p>}
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
                <label className="text-sm font-medium">Location *</label>
                <Input className={inputClass} placeholder="e.g. Austin, TX" {...register("location")} />
                {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fuel Type</label>
                <select className={selectClass} {...register("fuelType")}>
                  <option value="">Select fuel type</option>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Transmission</label>
                <select className={selectClass} {...register("transmission")}>
                  <option value="">Select transmission</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Body Type</label>
                <Input className={inputClass} placeholder="e.g. Sedan" {...register("bodyType")} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Input className={inputClass} placeholder="e.g. Silver" {...register("color")} />
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Description *</h2>
            <textarea
              placeholder="Tell buyers about your vehicle..."
              className={`w-full min-h-[160px] rounded-xl border-2 bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-y ${errors.description ? "border-destructive" : "border-border"}`}
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">Photos</h2>
            <div className="space-y-3">
              {fields.map((field, i) => (
                <div key={field.id} className="flex gap-3">
                  <Input
                    className="flex-1 h-12 rounded-xl border-2 border-border bg-background px-4 text-sm focus:outline-none focus:border-primary"
                    placeholder="https://example.com/image.jpg"
                    {...register(`images.${i}.url`)}
                  />
                  {fields.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => remove(i)}>
                      ×
                    </Button>
                  )}
                </div>
              ))}
              {fields.length < 10 && (
                <Button type="button" variant="outline" onClick={() => append({ url: "" })}>
                  + Add another photo
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
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
