import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { CreateVehicleInput } from "@/types/vehicle";
import { createVehicle } from "@/api/vehicle.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { Button } from "@/components/ui/button";

export const AddVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (data: CreateVehicleInput) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await createVehicle(data);
      toast.success(response.message || `Successfully created ${data.make} ${data.model}!`);
      navigate("/admin/vehicles");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create vehicle record.";
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/admin/vehicles" className="inline-block">
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inventory
        </Button>
      </Link>

      <PageHeader
        title="Add New Vehicle"
        description="Enter the specifications and initial stock count for the new vehicle."
      />

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-4 text-sm text-destructive border border-destructive/20">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <VehicleForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate("/admin/vehicles")}
      />
    </div>
  );
};

export default AddVehiclePage;
