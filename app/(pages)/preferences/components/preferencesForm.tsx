"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PreferencesFormProps {
  initialPreferences?: { genderPreferences?: string } | null;
}

export default function PreferencesForm({
  initialPreferences = null,

}: PreferencesFormProps) {
  const [genderPreferences, setGenderPreferences] = useState(
    initialPreferences?.genderPreferences || ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit button pressed")
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Set Your Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Gender Preferences</label>
          <Select
            value={genderPreferences}
            onValueChange={setGenderPreferences}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender preferences" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="all">All Genders</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Save Preferences
        </Button>
      </form>
    </div>
  );
}