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
import { debugSessions, DebugSessionsResult } from "@/actions/auth/debug-sessions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SessionManagement() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [debugInfo, setDebugInfo] = useState<DebugSessionsResult | null>(null);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

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
          setSessions(sessions.filter(s => s.id !== sessionId));
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
          setSessions(sessions.filter(s => s.isCurrentSession));
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
          <CardDescription className="text-destructive">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your currently active sessions across devices</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">No active sessions found</p>
          ) : (
            <div className="space-y-4">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {session.deviceInfo?.browser || "Unknown"}
                      {session.deviceInfo?.browserVersion &&
                        ` ${session.deviceInfo.browserVersion}`}{" "}
                      on{" "}
                      {session.deviceInfo?.isMobile
                        ? session.deviceInfo?.device
                        : session.deviceInfo?.isTablet
                          ? session.deviceInfo?.device
                          : `${session.deviceInfo?.os}${session.deviceInfo?.osVersion ? ` ${session.deviceInfo.osVersion}` : ""}`}
                      {session.isCurrentSession && (
                        <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs">
                          Current Session
                        </span>
                      )}
                    </p>
                    {session.deviceInfo?.location && (
                      <p className="text-muted-foreground text-sm">{session.deviceInfo.location}</p>
                    )}
                    <p className="text-muted-foreground text-sm">
                      Created: {formatDate(session.createdAt)}
                    </p>
                    <p className="text-muted-foreground text-sm">
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
        <CardFooter className="flex flex-wrap gap-2">
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
            disabled={isPending || sessions.filter(s => !s.isCurrentSession).length === 0}
          >
            Revoke All Other Sessions
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              startTransition(async () => {
                try {
                  const result = await debugSessions();
                  if (result.success) {
                    setDebugInfo(result);
                    setIsDebugOpen(true);
                  } else {
                    toast.error(result.error || "Failed to get debug info");
                  }
                } catch (err) {
                  toast.error("Failed to get debug info");
                  console.error(err);
                }
              });
            }}
            disabled={isPending}
          >
            Debug Sessions
          </Button>
        </CardFooter>
      </Card>

      {/* Debug Dialog */}
      <Dialog open={isDebugOpen} onOpenChange={setIsDebugOpen}>
        <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Debug Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-md bg-slate-100 p-4 dark:bg-slate-800">
              <pre className="text-xs">
                {debugInfo ? JSON.stringify(debugInfo, null, 2) : "No debug info available"}
              </pre>
            </div>
            <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Note</h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-200">
                If sessions are not showing correctly, please check if the JWT session table exists
                in the database and if sessions are being properly recorded during sign-in.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
