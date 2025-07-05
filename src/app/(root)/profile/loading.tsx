import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="w-full">
        <CardHeader>
          <div className="bg-muted h-6 w-40 animate-pulse rounded-md"></div>
          <div className="bg-muted h-4 w-64 animate-pulse rounded-md"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-muted relative h-20 w-20 animate-pulse rounded-full"></div>
            <div className="space-y-2">
              <div className="bg-muted h-5 w-32 animate-pulse rounded-md"></div>
              <div className="bg-muted h-4 w-48 animate-pulse rounded-md"></div>
              <div className="bg-muted h-4 w-16 animate-pulse rounded-md"></div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <div className="bg-muted h-4 w-32 animate-pulse rounded-md"></div>
              <div className="bg-muted h-3 w-48 animate-pulse rounded-md"></div>
              <div className="mt-2 space-y-3 rounded-md border p-4">
                <div className="bg-muted h-3 w-full animate-pulse rounded-md"></div>
                <div className="bg-muted h-3 w-full animate-pulse rounded-md"></div>
                <div className="bg-muted h-3 w-full animate-pulse rounded-md"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="bg-muted h-4 w-32 animate-pulse rounded-md"></div>
              <div className="bg-muted h-3 w-48 animate-pulse rounded-md"></div>
              <div className="mt-2 space-y-3 rounded-md border p-4">
                <div className="bg-muted h-3 w-full animate-pulse rounded-md"></div>
                <div className="bg-muted h-8 w-32 animate-pulse rounded-md"></div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-muted h-32 w-full animate-pulse rounded-md"></div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="bg-muted ml-auto h-8 w-24 animate-pulse rounded-md"></div>
        </CardFooter>
      </Card>
    </div>
  );
}
