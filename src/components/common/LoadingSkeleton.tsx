import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface LoadingSkeletonProps {
  count?: number;
  height?: number;
  className?: string;
}

const LoadingSkeleton = ({ 
  count = 1, 
  height = 20,
  className = ''
}: LoadingSkeletonProps) => {
  return (
    <Skeleton
      count={count}
      height={height}
      className={className}
      baseColor="#f3f4f6"
      highlightColor="#e5e7eb"
      direction="rtl"
    />
  );
};

export default LoadingSkeleton; 