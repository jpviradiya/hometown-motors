import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Car, Sparkles, Award } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { getVehicles } from "@/api/vehicle.api";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export const HomePage: React.FC = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await getVehicles({ limit: 4 });
        setFeaturedVehicles(response.vehicles || []);
      } catch (error) {
        console.error("Failed to fetch featured vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero / Welcome Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Welcome to Hometown Motors</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Find & Purchase Your <span className="text-primary">Dream Vehicle</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Explore our curated collection of premium sedans, SUVs, trucks, and electric vehicles. Guaranteed quality, competitive pricing, and seamless online purchasing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/vehicles">
              <Button size="lg" className="h-12 px-8 cursor-pointer font-bold">
                Browse Inventory
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-xs">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-base">Extensive Catalog</h4>
                <p className="text-xs text-muted-foreground">Wide variety of makes, models, and specs</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-xs">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-base">Verified Quality</h4>
                <p className="text-xs text-muted-foreground">Inspected and certified for safety</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-xs">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-base">Instant Online Order</h4>
                <p className="text-xs text-muted-foreground">Reserve and purchase directly online</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Featured Vehicles</h2>
              <p className="text-sm text-muted-foreground">Check out our latest arriving models</p>
            </div>

            <Link to="/vehicles">
              <Button variant="outline" className="cursor-pointer">
                View All Vehicles ({featuredVehicles.length}+)
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading featured vehicles..." />
          ) : featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No featured vehicles available at the moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
