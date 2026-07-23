-- DropForeignKey
ALTER TABLE "VehicleImage" DROP CONSTRAINT "VehicleImage_vehicleId_fkey";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "VehicleImage";
