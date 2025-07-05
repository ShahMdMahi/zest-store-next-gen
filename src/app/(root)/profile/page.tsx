import { auth } from "@/auth";
import { ProfileComponent } from "@/components/root/profile";

export default async function ProfilePage() {
  const session = await auth();
  return <ProfileComponent session={session} />;
}
