import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function RegisterLoading() {
  return (
    <div className="w-full max-w-md mx-auto py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <UserPlus className="h-6 w-6 text-primary animate-pulse" />
          </div>
        </div>
        <Skeleton className="h-8 w-52 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-6 space-y-2">
          <Skeleton className="h-6 w-36 mx-auto" />
          <Skeleton className="h-4 w-52 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-64" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full mt-2" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-6 px-6">
          <div className="relative w-full my-2">
            <Skeleton className="h-px w-full my-3" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="text-center pt-2">
            <Skeleton className="h-4 w-44 mx-auto" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
