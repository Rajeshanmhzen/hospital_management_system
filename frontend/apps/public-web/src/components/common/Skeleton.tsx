import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'wave'
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  }

  const baseBg =
    'bg-slate-300 dark:bg-gray-400'

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%')
  }

  return (
    <div
      className={`relative overflow-hidden ${baseBg} ${variantClasses[variant]} ${
        animation === 'wave' ? 'skeleton-wave' : ''
      } ${className}`}
      style={style}
    />
  )
}

// Patient Card Skeleton
export const PatientCardSkeleton: React.FC = () => (
  <div className="p-4 border rounded-lg space-y-3">
    <div className="flex items-center space-x-3">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
    <Skeleton variant="text" width="80%" height={14} />
  </div>
)

// Appointment Card Skeleton
export const AppointmentCardSkeleton: React.FC = () => (
  <div className="p-4 border rounded-lg space-y-3">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton variant="text" width={120} height={16} />
        <Skeleton variant="text" width={80} height={14} />
      </div>
      <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
    </div>
    <Skeleton variant="text" width="90%" height={14} />
  </div>
)

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton variant="text" height={16} />
      </td>
    ))}
  </tr>
)

// Dashboard Stats Skeleton
export const StatsCardSkeleton: React.FC = () => (
  <div className="p-6 bg-white rounded-lg border space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="text" width={60} height={20} />
    </div>
    <Skeleton variant="text" width="40%" height={14} />
  </div>
)

// Form Field Skeleton
export const FormFieldSkeleton: React.FC = () => (
  <div className="space-y-2">
    <Skeleton variant="text" width={100} height={16} />
    <Skeleton variant="rectangular" width="100%" height={40} />
  </div>
)

// Page Header Skeleton
export const PageHeaderSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton variant="text" width={200} height={24} />
        <Skeleton variant="text" width={300} height={16} />
      </div>
      <Skeleton variant="rectangular" width={120} height={40} />
    </div>
  </div>
)

// Pricing Card Skeleton
export const PricingCardSkeleton = ({ featured = false }) => (
  <div
    className={`p-6 rounded-2xl border space-y-6 ${
      featured
        ? 'border-slate-400 scale-[1.02]'
        : 'border-slate-300'
    }`}
  >
    {featured && (
      <Skeleton
        width={110}
        height={22}
        className="mx-auto rounded-full"
      />
    )}

    <div className="text-center space-y-3">
      <Skeleton width={120} height={20} className="mx-auto" />
      <Skeleton width={160} height={20} className="mx-auto" />
      <Skeleton width={80} height={14} className="mx-auto" />
    </div>

    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton width="85%" height={14} />
        </div>
      ))}
    </div>

    <Skeleton height={44} className="rounded-xl" />
  </div>
)
