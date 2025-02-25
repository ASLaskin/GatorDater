"use client"
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast"

interface ProfileFormProps {
  initialUser: {
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

export default function ProfileForm({ initialUser }: ProfileFormProps) {
  const [user, setUser] = useState({
    name: initialUser.name || '',
    image: initialUser.image || '',
    bio: initialUser.bio || '',
    gender: initialUser.gender || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof typeof user, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/profile/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    } catch {
      toast({
        title: "Error",
        description: "Profile failed to update",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        toast({
          title: "Error",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg border-slate-200">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Profile Picture</label>
          <div className="flex items-center space-x-4">
            {user.image && (
              <img
                src={user.image}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-grow"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Name</label>
          <Input
            value={user.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block mb-2">Bio</label>
          <Textarea
            value={user.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="Tell us about yourself"
            className="min-h-[100px]"
            maxLength={150}
          />
          <p className="text-sm text-gray-500 mt-1">
            {user.bio.length}/150 characters
          </p>
        </div>

        <div>
          <label className="block mb-2">Gender</label>
          <Select
            value={user.gender}
            onValueChange={(value) => handleChange('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="nonbinary">Non-Binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}

