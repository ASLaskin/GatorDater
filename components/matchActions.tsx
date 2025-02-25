import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';

interface MatchActionsProps {
  matchId: string;
  isLiked: boolean;
  onLike: () => Promise<void>;
  onPass: () => Promise<void>;
  disabled?: boolean;
  onResetLike?: () => void;
}

const MatchActions = ({ 
  isLiked, 
  onLike, 
  onPass, 
  disabled = false,
  onResetLike
}: MatchActionsProps) => {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isPassAnimating, setIsPassAnimating] = useState(false);
  const [internalLiked, setInternalLiked] = useState(isLiked);
  const [isPassed, setIsPassed] = useState(false);

  // Sync internal state with prop
  useEffect(() => {
    setInternalLiked(isLiked);
  }, [isLiked]);

  const handleLike = async () => {
    setIsLikeAnimating(true);
    setInternalLiked(true);
    setIsPassed(false); // Reset pass state when liking
    await onLike();
    // Reset animation state after a delay
    setTimeout(() => setIsLikeAnimating(false), 600);
  };

  const handlePass = async () => {
    setIsPassAnimating(true);
    // Reset like state when passing
    setInternalLiked(false);
    setIsPassed(true);
    if (onResetLike) {
      onResetLike();
    }
    await onPass();
    // Reset animation state after a delay
    setTimeout(() => setIsPassAnimating(false), 600);
  };

  return (
    <div className="flex justify-center gap-4 mt-4">
      <Button
        variant={internalLiked ? "default" : "outline"}
        size="lg"
        onClick={handleLike}
        disabled={disabled || isLikeAnimating}
        className={`w-32 transition-all duration-300 relative overflow-hidden
          ${isLikeAnimating ? 'scale-110' : 'hover:scale-105'}
          ${internalLiked ? 'bg-pink-500 hover:bg-pink-600 border-pink-500' : ''}
        `}
      >
        <Heart
          className={`mr-2 h-5 w-5 transition-all duration-300
            ${internalLiked ? 'fill-current text-white' : ''}
            ${isLikeAnimating ? 'relative' : ''}
          `}
        />
        <span className={`transition-all duration-300 ${isLikeAnimating ? 'ml-2' : ''}`}>
          {internalLiked ? 'Liked' : 'Like'}
        </span>
      </Button>
      
      <Button
        variant={isPassed ? "default" : "outline"}
        size="lg"
        onClick={handlePass}
        disabled={disabled || isPassAnimating}
        className={`w-32 transition-all duration-300
          ${isPassAnimating ? 'scale-110 rotate-12' : 'hover:scale-105'}
          ${isPassed ? 'bg-blue-500 hover:bg-blue-600 border-blue-500 text-white' : 'hover:bg-gray-100'}
        `}
      >
        <X 
          className={`mr-2 h-5 w-5 transition-all duration-300
            ${isPassAnimating ? 'rotate-90' : ''}
            ${isPassed ? 'text-white' : ''}
          `}
        />
        {isPassed ? 'Passed' : 'Pass'}
      </Button>
    </div>
  );
};

export default MatchActions;