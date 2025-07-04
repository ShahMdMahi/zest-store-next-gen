"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  getUserSessions,
  revokeSession,
  revokeAllOtherSessions,
  UserSession,
} from "@/actions/auth/sessions";

export default function SessionManagement() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Function to format date in a user-friendly way
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  // Load sessions when component mounts
  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);
      try {
        const result = await getUserSessions();
        if (result.error) {
          setError(result.error);
        } else {
          setSessions(result.sessions);
        }
      } catch (err) {
        setError("Failed to load sessions");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  const handleRevoke = (sessionId: string) => {
    startTransition(async () => {
      try {
        const result = await revokeSession(sessionId);
        if (result.success) {
          // Remove the revoked session from the list
          setSessions(sessions.filter((s) => s.id !== sessionId));
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (err) {
        toast.error("Failed to revoke session");
        console.error(err);
      }
    });
  };

  const handleRevokeAll = () => {
    startTransition(async () => {
      try {
        const result = await revokeAllOtherSessions();
        if (result.success) {
          // Keep only the current session in the list
          setSessions(sessions.filter((s) => s.isCurrentSession));
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (err) {
        toast.error("Failed to revoke all sessions");
        console.error(err);
      }
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Loading your active sessions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription className="text-destructive">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your currently active sessions across devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">No active sessions found</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">
                    {session.deviceInfo?.browser || "Unknown"} on{" "}
                    {session.deviceInfo?.os || "Unknown"}
                    {session.isCurrentSession && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        Current Session
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created: {formatDate(session.createdAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last active: {formatDate(session.lastUsed)}
                  </p>
                </div>
                {!session.isCurrentSession && (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleRevoke(session.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            // Refresh the session list
            startTransition(async () => {
              try {
                const result = await getUserSessions();
                if (result.error) {
                  setError(result.error);
                } else {
                  setSessions(result.sessions);
                  toast.success("Session list refreshed");
                }
              } catch (err) {
                toast.error("Failed to refresh sessions");
                console.error(err);
              }
            });
          }}
          disabled={isPending}
        >
          Refresh List
        </Button>
        <Button
          variant="destructive"
          onClick={handleRevokeAll}
          disabled={
            isPending ||
            sessions.filter((s) => !s.isCurrentSession).length === 0
          }
        >
          Revoke All Other Sessions
        </Button>
      </CardFooter>
    </Card>
  );
}
