import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';

interface MatchActionsProps {
  matchId: string;
  isLiked: boolean;
  onLike: () => Promise<void>;
  onPass: () => Promise<void>;
  disabled?: boolean;
}

const MatchActions = ({ matchId, isLiked, onLike, onPass, disabled = false }: MatchActionsProps) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <Button 
        variant={isLiked ? "default" : "outline"}
        size="lg"
        onClick={onLike}
        disabled={disabled}
        className="w-32"
      >
        <Heart 
          className={`mr-2 h-5 w-5 ${isLiked ? 'fill-current' : ''}`} 
        />
        {isLiked ? 'Liked' : 'Like'}
      </Button>
      
      <Button 
        variant="outline" 
        size="lg"
        onClick={onPass}
        disabled={disabled}
        className="w-32"
      >
        <X className="mr-2 h-5 w-5" />
        Pass
      </Button>
    </div>
  );
};

export default MatchActions;