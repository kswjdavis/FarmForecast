# FarmCalc Error Handling and Validation Patterns

## Overview

This document defines comprehensive error handling, validation patterns, and user feedback mechanisms for FarmCalc, ensuring robust operation and excellent user experience.

## Error Handling Architecture

### Error Classification

```typescript
// packages/shared/types/errors.ts
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  SYSTEM = 'SYSTEM'
}

export enum ErrorSeverity {
  LOW = 'LOW',        // User can continue, minor issue
  MEDIUM = 'MEDIUM',  // Feature impaired but app functional
  HIGH = 'HIGH',      // Major feature broken
  CRITICAL = 'CRITICAL' // App unusable
}

export interface FarmCalcError {
  id: string;
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  details?: Record<string, any>;
  timestamp: Date;
  context?: {
    userId?: string;
    farmId?: string;
    fieldId?: string;
    action?: string;
  };
  recovery?: {
    retryable: boolean;
    fallback?: string;
    suggestions: string[];
  };
}
```

### Backend Error Handler (FastAPI)

```python
# apps/api/core/errors.py
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
import traceback
import logging
from typing import Optional
from enum import Enum

logger = logging.getLogger(__name__)

class ErrorCode(Enum):
    # Validation Errors (4000-4099)
    INVALID_INPUT = "ERR_4001"
    MISSING_FIELD = "ERR_4002"
    INVALID_DATE_RANGE = "ERR_4003"
    INVALID_COORDINATES = "ERR_4004"
    
    # Business Logic Errors (4100-4199)
    HERBICIDE_RESTRICTION = "ERR_4101"
    PLANTING_WINDOW_CLOSED = "ERR_4102"
    INSUFFICIENT_MOISTURE = "ERR_4103"
    ROTATION_CONFLICT = "ERR_4104"
    
    # External Service Errors (5000-5099)
    WEATHER_API_UNAVAILABLE = "ERR_5001"
    NEO4J_CONNECTION_FAILED = "ERR_5002"
    SATELLITE_DATA_UNAVAILABLE = "ERR_5003"

class FarmCalcException(HTTPException):
    def __init__(
        self,
        code: ErrorCode,
        message: str,
        user_message: Optional[str] = None,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: Optional[dict] = None,
        recovery: Optional[dict] = None
    ):
        self.code = code.value
        self.message = message
        self.user_message = user_message or self._get_user_message(code)
        self.details = details or {}
        self.recovery = recovery or self._get_recovery_options(code)
        
        super().__init__(
            status_code=status_code,
            detail={
                "code": self.code,
                "message": self.message,
                "user_message": self.user_message,
                "details": self.details,
                "recovery": self.recovery
            }
        )
    
    @staticmethod
    def _get_user_message(code: ErrorCode) -> str:
        messages = {
            ErrorCode.HERBICIDE_RESTRICTION: 
                "This crop cannot be planted due to herbicide carryover restrictions. Please check the treatment history.",
            ErrorCode.PLANTING_WINDOW_CLOSED:
                "The optimal planting window for this crop has passed. Consider alternative crops or accept reduced yield potential.",
            ErrorCode.WEATHER_API_UNAVAILABLE:
                "Weather data is temporarily unavailable. Using cached data from last update."
        }
        return messages.get(code, "An error occurred. Please try again.")
    
    @staticmethod
    def _get_recovery_options(code: ErrorCode) -> dict:
        recovery = {
            ErrorCode.HERBICIDE_RESTRICTION: {
                "retryable": False,
                "suggestions": [
                    "Review herbicide application history",
                    "Select alternative crop with shorter restriction",
                    "Wait until restriction period expires"
                ]
            },
            ErrorCode.WEATHER_API_UNAVAILABLE: {
                "retryable": True,
                "fallback": "cached_data",
                "suggestions": [
                    "Continue with cached weather data",
                    "Retry in a few minutes",
                    "Enter weather data manually"
                ]
            }
        }
        return recovery.get(code, {"retryable": False, "suggestions": []})

async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unexpected errors"""
    
    # Log the full exception
    logger.error(
        f"Unhandled exception: {exc}",
        extra={
            "url": str(request.url),
            "method": request.method,
            "headers": dict(request.headers),
            "traceback": traceback.format_exc()
        }
    )
    
    # Return safe error to client
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "code": "ERR_5000",
            "message": "An unexpected error occurred",
            "user_message": "Something went wrong. Our team has been notified.",
            "recovery": {
                "retryable": True,
                "suggestions": ["Please try again in a moment"]
            }
        }
    )
```

### Frontend Error Boundary (React)

```typescript
// apps/web/components/error-boundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { trackError } from '@/lib/monitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    trackError(error, {
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                {this.state.error?.message || 'An unexpected error occurred'}
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={this.handleReset} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 p-4 bg-gray-100 rounded text-xs">
                <summary className="cursor-pointer font-medium">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Validation Patterns

### Backend Validation (Pydantic)

```python
# apps/api/schemas/field.py
from pydantic import BaseModel, Field, validator, root_validator
from typing import Optional, List
from datetime import date
import re

class FieldCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    acres: float = Field(..., gt=0, le=10000)
    soil_type: str = Field(..., regex="^(Sandy|Clay|Loam|Sandy Loam|Clay Loam|Silt Loam)$")
    organic_matter: Optional[float] = Field(None, ge=0, le=100)
    ph: Optional[float] = Field(None, ge=0, le=14)
    coordinates: List[tuple[float, float]] = Field(..., min_items=3)
    
    @validator('name')
    def validate_name(cls, v):
        if not re.match(r'^[a-zA-Z0-9\s\-]+$', v):
            raise ValueError('Field name can only contain letters, numbers, spaces, and hyphens')
        return v.strip()
    
    @validator('coordinates')
    def validate_coordinates(cls, v):
        for lat, lon in v:
            if not (-90 <= lat <= 90):
                raise ValueError(f'Invalid latitude: {lat}')
            if not (-180 <= lon <= 180):
                raise ValueError(f'Invalid longitude: {lon}')
        return v
    
    @root_validator
    def validate_field(cls, values):
        # Business logic validation
        acres = values.get('acres')
        coordinates = values.get('coordinates')
        
        if acres and coordinates:
            # Estimate area from coordinates and compare
            estimated_acres = calculate_polygon_area(coordinates)
            if abs(estimated_acres - acres) > acres * 0.2:  # 20% tolerance
                raise ValueError(
                    f'Specified acres ({acres}) differs significantly from '
                    f'calculated area ({estimated_acres:.1f})'
                )
        
        return values

class PlantingRequest(BaseModel):
    field_id: str
    crop_type: str
    variety: str
    plant_date: date
    seed_rate: float = Field(..., gt=0)
    
    @root_validator
    def validate_planting(cls, values):
        plant_date = values.get('plant_date')
        crop_type = values.get('crop_type')
        
        if plant_date and crop_type:
            # Check planting window
            windows = {
                'wheat': (date(2024, 9, 15), date(2024, 10, 31)),
                'corn': (date(2024, 4, 15), date(2024, 5, 31)),
                'sorghum': (date(2024, 5, 15), date(2024, 6, 30))
            }
            
            if crop_type in windows:
                start, end = windows[crop_type]
                if not (start <= plant_date <= end):
                    raise ValueError(
                        f'{crop_type.capitalize()} planting date must be between '
                        f'{start.strftime("%B %d")} and {end.strftime("%B %d")}'
                    )
        
        return values
```

### Frontend Validation (React Hook Form + Zod)

```typescript
// apps/web/lib/validations/field.ts
import * as z from 'zod';

export const fieldSchema = z.object({
  name: z.string()
    .min(1, 'Field name is required')
    .max(100, 'Field name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-]+$/, 'Field name can only contain letters, numbers, spaces, and hyphens'),
    
  acres: z.number()
    .positive('Acres must be greater than 0')
    .max(10000, 'Field size cannot exceed 10,000 acres'),
    
  soilType: z.enum(['Sandy', 'Clay', 'Loam', 'Sandy Loam', 'Clay Loam', 'Silt Loam'], {
    errorMap: () => ({ message: 'Please select a valid soil type' })
  }),
  
  organicMatter: z.number()
    .min(0, 'Organic matter cannot be negative')
    .max(100, 'Organic matter cannot exceed 100%')
    .optional(),
    
  ph: z.number()
    .min(0, 'pH cannot be less than 0')
    .max(14, 'pH cannot be greater than 14')
    .optional(),
    
  coordinates: z.array(
    z.tuple([
      z.number().min(-90).max(90),
      z.number().min(-180).max(180)
    ])
  ).min(3, 'Field boundary must have at least 3 points')
});

// Custom validation with business logic
export const plantingSchema = z.object({
  fieldId: z.string().uuid('Invalid field ID'),
  cropType: z.enum(['wheat', 'corn', 'sorghum']),
  variety: z.string().min(1, 'Variety is required'),
  plantDate: z.date(),
  seedRate: z.number().positive('Seed rate must be positive')
}).refine(
  (data) => {
    const windows = {
      wheat: { start: new Date('2024-09-15'), end: new Date('2024-10-31') },
      corn: { start: new Date('2024-04-15'), end: new Date('2024-05-31') },
      sorghum: { start: new Date('2024-05-15'), end: new Date('2024-06-30') }
    };
    
    const window = windows[data.cropType];
    return data.plantDate >= window.start && data.plantDate <= window.end;
  },
  {
    message: 'Planting date is outside the optimal window for this crop',
    path: ['plantDate']
  }
);

// Form component with validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function FieldForm() {
  const form = useForm<z.infer<typeof fieldSchema>>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: '',
      acres: 0,
      soilType: 'Loam'
    }
  });

  const onSubmit = async (data: z.infer<typeof fieldSchema>) => {
    try {
      await createField(data);
      toast.success('Field created successfully');
    } catch (error) {
      if (error.code === 'ERR_4101') {
        form.setError('root', {
          message: error.userMessage
        });
      } else {
        toast.error('Failed to create field');
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {form.formState.errors.root && (
        <Alert variant="destructive">
          <AlertDescription>
            {form.formState.errors.root.message}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Form fields with inline validation */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Field Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              A unique name to identify this field
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  );
}
```

## User Feedback Patterns

### Loading States

```typescript
// apps/web/components/loading-states.tsx
export function FieldSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );
}

export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
```

### Toast Notifications

```typescript
// apps/web/lib/toast.ts
import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, {
      duration: 4000,
      ...options
    });
  },
  
  error: (error: FarmCalcError | string, options?: ToastOptions) => {
    if (typeof error === 'string') {
      sonnerToast.error(error, options);
    } else {
      sonnerToast.error(error.userMessage, {
        description: error.recovery?.suggestions[0],
        action: error.recovery?.retryable ? {
          label: 'Retry',
          onClick: () => window.location.reload()
        } : undefined,
        ...options
      });
    }
  },
  
  warning: (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, {
      duration: 5000,
      ...options
    });
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  }
};
```

### Form Validation Feedback

```typescript
// apps/web/components/form-feedback.tsx
export function ValidationMessage({ 
  error, 
  warning, 
  info 
}: { 
  error?: string; 
  warning?: string; 
  info?: string;
}) {
  if (error) {
    return (
      <p className="text-sm text-red-600 mt-1 flex items-center">
        <XCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    );
  }
  
  if (warning) {
    return (
      <p className="text-sm text-yellow-600 mt-1 flex items-center">
        <AlertTriangle className="w-4 h-4 mr-1" />
        {warning}
      </p>
    );
  }
  
  if (info) {
    return (
      <p className="text-sm text-blue-600 mt-1 flex items-center">
        <Info className="w-4 h-4 mr-1" />
        {info}
      </p>
    );
  }
  
  return null;
}
```

## Error Recovery Strategies

### Retry Logic

```typescript
// packages/shared/lib/retry.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
    onRetry
  } = options;

  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      const delay = Math.min(
        initialDelay * Math.pow(factor, attempt - 1),
        maxDelay
      );
      
      onRetry?.(attempt, lastError);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}
```

### Fallback Data

```python
# apps/api/services/weather.py
async def get_weather_data(field_id: str, date: date) -> WeatherData:
    try:
        # Try primary source
        return await fetch_mesonet_data(field_id, date)
    except ExternalServiceError:
        logger.warning(f"Mesonet unavailable, trying cache for {field_id}")
        
        try:
            # Try cache
            cached = await get_cached_weather(field_id, date)
            if cached and (datetime.now() - cached.timestamp).hours < 24:
                return cached.data
        except CacheError:
            pass
        
        try:
            # Try interpolation from nearby stations
            return await interpolate_weather_data(field_id, date)
        except InterpolationError:
            pass
        
        # Last resort: historical average
        logger.warning(f"Using historical average for {field_id} on {date}")
        return await get_historical_average(field_id, date.month, date.day)
```

## Monitoring and Alerting

```typescript
// packages/shared/lib/monitoring.ts
import * as Sentry from '@sentry/react';
import { PostHog } from 'posthog-js';

export function initializeMonitoring() {
  // Sentry for error tracking
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    beforeSend(event, hint) {
      // Filter out non-critical errors
      if (event.level === 'warning') {
        return null;
      }
      return event;
    }
  });

  // PostHog for analytics
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST
  });
}

export function trackError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context
  });
  
  posthog.capture('error_occurred', {
    error_message: error.message,
    error_code: (error as any).code,
    ...context
  });
}
```