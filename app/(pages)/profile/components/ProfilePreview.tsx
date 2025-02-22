import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfilePreviewProps {
  user: {
    name: string | null;
    email?: string;
    image: string | null;
    bio: string;
    gender: string | null;
    id?: string;
    emailVerified?: Date | null;
    preferencesComplete?: boolean;
  };
}

export default function ProfilePreview({ user }: ProfilePreviewProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Profile Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name || "User"} />
            ) : (
              <AvatarFallback>
                {user.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="text-center">
            <h3 className="text-xl font-bold">{user.name || "Anonymous"}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.gender && (
              <Badge variant="outline" className="mt-2">
                {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
              </Badge>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">About</h4>
          <p className="text-sm text-muted-foreground">
            {user.bio || "No bio provided yet."}
          </p>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>This is how your profile appears to other users</p>
        </div>
      </CardContent>
    </Card>
  );
}