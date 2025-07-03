import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function ErrorLoading() {
  return (
    <div className="w-full max-w-md mx-auto py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/30">
            <AlertCircle className="h-6 w-6 text-destructive animate-pulse" />
          </div>
        </div>
        <Skeleton className="h-8 w-52 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3 space-y-2">
          <Skeleton className="h-6 w-36 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 border rounded-md p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Skeleton className="h-10 w-full sm:w-1/2" />
          <Skeleton className="h-10 w-full sm:w-1/2" />
        </CardFooter>
      </Card>
    </div>
  );
}
