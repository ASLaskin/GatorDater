"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PreferencesFormProps {
  initialPreferences?: { genderPreferences?: string } | null;
}

export default function PreferencesForm({ initialPreferences }: PreferencesFormProps) {
  const [genderPreferences, setGenderPreferences] = useState(initialPreferences?.genderPreferences || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/preferences/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genderPreferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update preferences');
      }

      console.log("Preferences updated");
    } catch {
      console.log("Preferences failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">I am interested in</label>
          <Select
            value={genderPreferences}
            onValueChange={setGenderPreferences}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Men</SelectItem>
              <SelectItem value="female">Women</SelectItem>
              <SelectItem value="both">Both</SelectItem>
              <SelectItem value="any">Anyone</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Preferences"}
        </Button>
      </form>
    </div>
  );
}