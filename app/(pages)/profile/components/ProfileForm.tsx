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

interface ProfileFormProps {
  initialUser?: {
    name?: string;
    email?: string;
    image?: string;
    bio?: string;
    gender?: string;
  };
}

export default function ProfileForm({ initialUser }: ProfileFormProps) {
  const [name, setName] = useState(initialUser?.name || '');
  const [image, setImage] = useState(initialUser?.image || '');
  const [bio, setBio] = useState(initialUser?.bio || '');
  const [gender, setGender] = useState(initialUser?.gender || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/profile/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          bio,
          gender,
          image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      console.log("Profile updated")
    } catch (error) {
      console.log("Profile failed to upload")
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        console.log("Image must be less than 5MB")
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Profile Picture</label>
          <div className="flex items-center space-x-4">
            {image && (
              <img
                src={image}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block mb-2">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            className="min-h-[100px]"
            maxLength={150}
          />
          <p className="text-sm text-gray-500 mt-1">
            {bio.length}/150 characters
          </p>
        </div>

        <div>
          <label className="block mb-2">Gender</label>
          <Select
            value={gender}
            onValueChange={setGender}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="nonbinary">Non-Binary</SelectItem>
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