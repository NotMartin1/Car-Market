import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@workspace/replit-auth-web";
import { useGetMyInquiries, getGetMyInquiriesQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function MyInquiriesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const { data, isLoading } = useGetMyInquiries({
    query: { queryKey: getGetMyInquiriesQueryKey(), enabled: isAuthenticated }
  });

  if (authLoading) return <AppLayout><div className="p-20 text-center">Loading...</div></AppLayout>;
  
  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto mt-20 p-8 bg-card rounded-3xl border text-center">
          <p>Please log in to view your inquiries.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-foreground">My Inquiries</h1>
          <p className="text-muted-foreground mt-2">Messages you've sent to sellers.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />)}
          </div>
        ) : data?.inquiries && data.inquiries.length > 0 ? (
          <div className="space-y-6">
            {data.inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col md:flex-row gap-6 hover:border-border transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    <h3 className="font-bold text-lg">
                      Regarding: {inquiry.listingYear} {inquiry.listingMake} {inquiry.listingModel}
                    </h3>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-xl text-foreground text-sm italic border-l-4 border-accent/40">
                    "{inquiry.message}"
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Sent {formatDistanceToNow(new Date(inquiry.createdAt))} ago</span>
                  </div>
                </div>
                <div className="md:w-48 flex md:flex-col justify-end items-end gap-3 shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                   <Link href={`/listings/${inquiry.listingId}`}>
                     <Button variant="outline" className="w-full gap-2">View Listing <ExternalLink className="w-4 h-4" /></Button>
                   </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No inquiries sent</h3>
            <p className="text-muted-foreground">When you contact a seller, your messages will appear here.</p>
            <Link href="/listings"><Button className="mt-6">Browse Cars</Button></Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
