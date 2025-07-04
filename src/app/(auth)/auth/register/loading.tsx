import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function RegisterLoading() {
  return (
    <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 ring-primary/20 flex h-12 w-12 items-center justify-center rounded-full ring-1">
            <UserPlus className="text-primary h-6 w-6 animate-pulse" />
          </div>
        </div>
        <Skeleton className="mx-auto mb-2 h-8 w-52" />
        <Skeleton className="mx-auto h-4 w-64" />
      </div>

      <Card className="border-border border shadow-sm">
        <CardHeader className="space-y-2 pb-6">
          <Skeleton className="mx-auto h-6 w-36" />
          <Skeleton className="mx-auto h-4 w-52" />
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
          <Skeleton className="mt-2 h-10 w-full" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
          <div className="relative my-2 w-full">
            <Skeleton className="my-3 h-px w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="pt-2 text-center">
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
