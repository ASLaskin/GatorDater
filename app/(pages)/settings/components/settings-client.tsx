"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsClientComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted",
      });
      
      // Redirect to home/login page after successful deletion
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      console.error("Account deletion failed:", error);
      toast({
        title: "Error",
        description: "Failed to delete your account. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="space-y-6">
        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View and manage your basic account details</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              To change your name, bio, or profile picture, please visit your <Link className='text-blue-400 hover:text-blue-500' href="/profile">profile settings.</Link>
            </p>
          </CardContent>
        </Card>
        
        {/* Data & Privacy Card */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>Manage your personal data and account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Delete Account Option */}
            <div className="pt-4 border-t">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all of your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : "Yes, delete my account"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <p className="mt-2 text-sm text-gray-500">
                Permanently delete your account and all associated data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}