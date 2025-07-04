import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ErrorLoading() {
  return (
    <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-destructive/10 ring-destructive/30 flex h-12 w-12 items-center justify-center rounded-full ring-1">
            <AlertCircle className="text-destructive h-6 w-6 animate-pulse" />
          </div>
        </div>
        <Skeleton className="mx-auto mb-2 h-8 w-48" />
        <Skeleton className="mx-auto h-4 w-64" />
      </div>

      <Card className="border-border border shadow-sm">
        <CardHeader className="space-y-2 pb-6">
          <Skeleton className="mx-auto h-6 w-36" />
          <Skeleton className="mx-auto h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 rounded-md border p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-6 sm:flex-row">
          <Skeleton className="h-10 w-full sm:w-1/2" />
          <Skeleton className="h-10 w-full sm:w-1/2" />
        </CardFooter>
      </Card>
    </div>
  );
}
