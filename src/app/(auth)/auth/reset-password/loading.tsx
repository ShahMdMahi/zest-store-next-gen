import { Skeleton } from "@/components/ui/skeleton";
import { LockKeyhole } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ResetPasswordLoading() {
  return (
    <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 ring-primary/20 flex h-12 w-12 items-center justify-center rounded-full ring-1">
            <LockKeyhole className="text-primary h-6 w-6 animate-pulse" />
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
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="mt-2 h-10 w-full" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
          <div className="pt-2 text-center">
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
