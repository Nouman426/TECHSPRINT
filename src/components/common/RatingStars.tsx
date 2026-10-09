import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 16,
  showValue = true,
  reviewCount,
  interactive = false,
  onRate
}) => {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars.map((starIndex) => {
          const isFilled = starIndex <= Math.round(rating);
          return (
            <button
              key={starIndex}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRate && onRate(starIndex)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5`}
            >
              <Star
                size={size}
                className={`${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="font-semibold text-slate-700 text-xs ml-1">
          {rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="text-slate-500 text-xs ml-0.5">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
