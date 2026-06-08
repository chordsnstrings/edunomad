import { PageSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <PageSkeleton />
    </div>
  );
}
