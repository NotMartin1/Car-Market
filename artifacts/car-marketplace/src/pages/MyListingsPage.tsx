import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@workspace/replit-auth-web";
import { useListListings, useUpdateListing, useDeleteListing } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { MoreVertical, Edit, Trash2, CheckCircle, ExternalLink, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function MyListingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading: listingsLoading } = useListListings(
    { sellerId: user?.id },
    { query: { enabled: !!user?.id } }
  );

  const { mutate: updateListing } = useUpdateListing({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/listings"] })
    }
  });

  const { mutate: deleteListing } = useDeleteListing({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
        toast({ title: "Listing deleted" });
      }
    }
  });

  if (authLoading) return <AppLayout><div className="p-20 text-center">Loading...</div></AppLayout>;
  
  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto mt-20 p-8 bg-card rounded-3xl border text-center">
          <p>Please log in to view your listings.</p>
        </div>
      </AppLayout>
    );
  }

  const handleMarkSold = (id: string) => {
    updateListing({ id, data: { status: "sold" } }, {
      onSuccess: () => toast({ title: "Marked as sold!" })
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this listing? This cannot be undone.")) {
      deleteListing({ id });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">My Listings</h1>
            <p className="text-muted-foreground mt-2">Manage the vehicles you are selling.</p>
          </div>
          <Link href="/post">
            <Button className="gap-2"><Plus className="w-4 h-4"/> New Listing</Button>
          </Link>
        </div>

        {listingsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />)}
          </div>
        ) : data?.listings && data.listings.length > 0 ? (
          <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Listed On</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={listing.images[0]} alt="car" className="w-16 h-12 rounded-lg object-cover bg-muted" />
                          <span className="font-semibold text-foreground text-base">
                            {listing.year} {listing.make} {listing.model}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{formatPrice(listing.price)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={listing.status === 'active' ? 'success' : 'secondary'} className="capitalize">
                          {listing.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link href={`/listings/${listing.id}`}>
                          <Button variant="ghost" size="icon" title="View"><ExternalLink className="w-4 h-4 text-muted-foreground" /></Button>
                        </Link>
                        {listing.status === 'active' && (
                          <Button variant="ghost" size="icon" title="Mark Sold" onClick={() => handleMarkSold(listing.id)}>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(listing.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <h3 className="text-xl font-bold mb-2">You haven't posted any cars yet.</h3>
            <Link href="/post"><Button className="mt-4">Post Your First Listing</Button></Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
