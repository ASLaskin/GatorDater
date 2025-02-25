"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PreferencesFormProps {
  initialPreferences?: { genderPreferences?: string } | null;
}

export default function PreferencesForm({ initialPreferences }: PreferencesFormProps) {
  // Parse initial preferences to set the correct select value
  const getInitialSelectValue = (prefsString?: string) => {
    if (!prefsString) return '';
    
    // Check if it's a comma-separated list
    if (prefsString.includes(',')) {
      const values = prefsString.split(',').map(v => v.trim());
      
      // If it contains male and female, select "both"
      if (values.includes('male') && values.includes('female') && values.length === 2) {
        return 'both';
      }
      
      // If it has multiple values including non-binary, select "any"
      if (values.length > 1) {
        return 'any';
      }
    }
    
    // Single value cases
    if (prefsString === 'male' || prefsString === 'female' || prefsString === 'any') {
      return prefsString;
    }
    
    return '';
  };

  const [selectValue, setSelectValue] = useState(
    getInitialSelectValue(initialPreferences?.genderPreferences)
  );
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    let genderPreferences: string;
    
    // Transform the select value to the appropriate string format
    if (selectValue === 'both') {
      genderPreferences = 'male,female';
    } else if (selectValue === 'any') {
      genderPreferences = 'male,female,non-binary';
    } else {
      genderPreferences = selectValue;
    }
    
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
            value={selectValue}
            onValueChange={setSelectValue}
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