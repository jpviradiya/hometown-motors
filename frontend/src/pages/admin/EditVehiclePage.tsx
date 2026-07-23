import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle, CreateVehicleInput } from "@/types/vehicle";
import { getVehicleById, updateVehicle } from "@/api/vehicle.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";

export const EditVehiclePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchVehicle = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setFetchError(false);

    try {
      const data = await getVehicleById(id);
      setVehicle(data);
    } catch (err) {
      console.error("Failed to load vehicle for editing:", err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  const handleSubmit = async (data: CreateVehicleInput) => {
    if (!id) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await updateVehicle(id, data);
      toast.success(response.message || `Successfully updated ${data.make} ${data.model}!`);
      navigate("/admin/vehicles");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update vehicle record.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <LoadingSpinner label="Loading vehicle details for editing..." />
      </div>
    );
  }

  if (fetchError || !vehicle) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-4">
        <Link to="/admin/vehicles" className="inline-block">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Button>
        </Link>
        <ErrorState
          title="Vehicle Not Found"
          message="Could not retrieve vehicle records for editing."
          onRetry={fetchVehicle}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/admin/vehicles" className="inline-block">
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inventory
        </Button>
      </Link>

      <PageHeader
        title={`Edit ${vehicle.make} ${vehicle.model}`}
        description="Update specifications, price, or stock levels for this vehicle."
      />

      {submitError && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-4 text-sm text-destructive border border-destructive/20">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <VehicleForm
        initialData={vehicle}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate("/admin/vehicles")}
      />
    </div>
  );
};

export default EditVehiclePage;
