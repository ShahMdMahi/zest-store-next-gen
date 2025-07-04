"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";
import SessionManagement from "@/components/auth/session-management";
import Image from "next/image";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null | undefined;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated" || !session) {
      router.push("/auth/login");
      return;
    }

    if (session && session.user) {
      setUserData({
        id: session.user.id || "",
        name: session.user.name || null,
        email: session.user.email || null,
        role: session.user.role || "USER",
        image: session.user.image,
      });
    }

    setLoading(false);
  }, [session, status, router]);

  if (loading || status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
      </div>
    );
  }

  if (!userData || status === "unauthenticated") {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>Manage your account details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-muted relative h-20 w-20 overflow-hidden rounded-full">
              {userData.image ? (
                <Image
                  src={userData.image}
                  alt={userData.name || "User"}
                  className="h-full w-full object-cover"
                  fill
                />
              ) : (
                <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center">
                  <span className="text-2xl font-bold">
                    {userData.name ? userData.name[0].toUpperCase() : "U"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{userData.name || "User"}</h2>
              <p className="text-muted-foreground text-sm">{userData.email}</p>
              <div className="mt-1">
                <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {userData.role}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Account Information</h3>
              <p className="text-muted-foreground text-sm">Your account details and preferences</p>
              <div className="mt-2 rounded-md border p-4">
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground text-xs">User ID</dt>
                    <dd>{userData.id}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Email</dt>
                    <dd>{userData.email}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Role</dt>
                    <dd className="capitalize">{userData.role.toLowerCase()}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Account Security</h3>
              <p className="text-muted-foreground text-sm">
                Manage your password and account security
              </p>
              <div className="mt-2 rounded-md border p-4">
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground text-xs">Password</dt>
                    <dd>••••••••</dd>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Session Management */}
          <div className="mt-8">
            <SessionManagement />
          </div>
        </CardContent>
        <CardFooter>
          <LogoutButton className="ml-auto" />
        </CardFooter>
      </Card>
    </div>
  );
}
