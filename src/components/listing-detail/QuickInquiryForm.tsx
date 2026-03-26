"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createInquiry } from "@/lib/mock-api";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email:   z.string().email("Enter a valid email."),
  phone:   z.string().optional(),
  message: z.string().min(1, "Message is required."),
});

type FormValues = z.infer<typeof schema>;

export function QuickInquiryForm({
  listingId,
  defaultEmail,
  isAuthenticated,
  onLogin,
}: {
  listingId: string;
  defaultEmail?: string;
  isAuthenticated: boolean;
  onLogin: () => void;
}) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: defaultEmail ?? "", phone: "", message: "" },
  });

  const onSubmit = async (data: FormValues) => {
    if (!isAuthenticated) { onLogin(); return; }
    try {
      await createInquiry(listingId, {
        message:      data.message,
        contactEmail: data.email,
        contactPhone: data.phone || undefined,
      });
      toast({ title: "Inquiry sent!", description: "The seller will be notified." });
      reset({ email: data.email, phone: "", message: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Failed to send", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
      <h3 className="font-display font-bold text-lg mb-4">Send Quick Inquiry</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Input
            type="email"
            placeholder="Your email"
            className={errors.email ? "border-destructive" : ""}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>

        <Input placeholder="Phone (optional)" {...register("phone")} />

        <div>
          <textarea
            placeholder="Your message to the seller..."
            className={`w-full min-h-[100px] rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-y ${errors.message ? "border-destructive" : "border-border"}`}
            {...register("message")}
          />
          {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
        </div>

        <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send Inquiry"}
        </Button>
      </form>
    </div>
  );
}
