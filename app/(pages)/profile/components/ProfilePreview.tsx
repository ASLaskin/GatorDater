import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User } from "next-auth";

interface ExtendedUser extends Partial<User> {
  bio?: string;
  gender?: string;
}

interface ProfilePreviewProps {
  user: ExtendedUser | null | undefined;
}

const ProfilePreview = ({ user }: ProfilePreviewProps) => {
  if (!user) {
    return null;
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-center text-center">
          {user.image ? (
            <img
              src={user.image}
              alt={`${user.name || 'User'}'s profile`}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md mb-4">
              <span className="text-4xl text-gray-500">
                {user.name?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
          )}
          <h2 className="text-2xl font-bold">{user.name || 'Anonymous User'}</h2>
          {user.email && (
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4 border-t border-gray-100">
        {user.bio && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">About Me</h3>
            <p className="text-gray-700">{user.bio}</p>
          </div>
        )}
        {user.gender && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Gender</h3>
            <p className="text-gray-700 capitalize">{user.gender}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfilePreview;