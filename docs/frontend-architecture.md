# FarmCalc Frontend Architecture Document

**Version:** 1.0  
**Date:** 2025-08-26  
**Author:** Winston (Architect)  
**Status:** ✅ COMPLETE - Ready for Implementation

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-26 | 1.0 | Initial frontend architecture document creation | Winston (Architect) |

## Frontend Tech Stack

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Framework | Next.js | 14.2.5 | React framework with SSR/SSG/ISR | App Router for modern React patterns, optimal SEO, edge runtime support |
| UI Library | React | 18.3.1 | Component-based UI | Concurrent features, Server Components, improved hydration |
| Language | TypeScript | 5.5.4 | Type-safe development | Prevents runtime errors, excellent IDE support, self-documenting |
| State Management | Zustand | 4.5.5 | Client state management | Minimal boilerplate, TypeScript-first, devtools support |
| Server State | TanStack Query | 5.51.x | Server state & caching | Optimistic updates, infinite queries, prefetching for Neo4j data |
| GraphQL Client | Apollo Client | 3.10.8 | GraphQL operations | Subscriptions for real-time field updates, normalized cache |
| Routing | Next.js App Router | Built-in | File-based routing | Layouts, parallel routes, intercepting routes, type-safe |
| Build Tool | Turborepo | 2.0.9 | Monorepo orchestration | Incremental builds, remote caching, parallel execution |
| Component Library | Material-UI (MUI) | 5.16.7 | UI components | Accessible, comprehensive agriculture-friendly components |
| Styling | Tailwind CSS | 3.4.7 | Utility-first CSS | JIT compilation, tree-shaking, dark mode support |
| CSS-in-JS | Emotion | 11.13.x | MUI theming | Required by MUI, runtime styling for dynamic themes |
| Form Handling | React Hook Form | 7.52.x | Form state management | Uncontrolled components, minimal re-renders for large field forms |
| Validation | Zod | 3.23.x | Schema validation | Runtime validation, TypeScript inference, composable schemas |
| Animation | Framer Motion | 11.3.x | Animations & gestures | GPU-accelerated, gesture support for map interactions |
| Charts | Recharts | 2.12.x | Data visualization | Responsive charts for yield predictions, weather data |
| Maps | Mapbox GL JS | 3.5.x | Field mapping | WebGL rendering, vector tiles, offline support |
| Testing | Vitest | 2.0.5 | Unit testing | ESM native, fast execution, Jest compatible |
| Component Testing | Testing Library | 16.0.0 | React testing | User-centric testing, accessibility queries |
| E2E Testing | Playwright | 1.45.3 | Browser automation | Cross-browser, visual regression, mobile testing |
| Dev Tools | React DevTools | Latest | Development experience | Component profiling, hook inspection, performance monitoring |
| Bundle Analyzer | Next Bundle Analyzer | 14.2.x | Bundle optimization | Identify large dependencies, code splitting opportunities |
| Linting | ESLint | 9.8.x | Code quality | Next.js config, accessibility rules, hooks rules |
| Formatting | Prettier | 3.3.x | Code formatting | Consistent style, format on save, Tailwind plugin |

## Project Structure

```plaintext
apps/web/                               # Next.js application
├── src/
│   ├── app/                           # App Router pages (Next.js 14)
│   │   ├── (auth)/                    # Auth group with shared layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/               # Dashboard group
│   │   │   ├── farms/
│   │   │   │   ├── [farmId]/
│   │   │   │   │   ├── fields/
│   │   │   │   │   │   └── [fieldId]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── optimization/
│   │   │   │   └── page.tsx
│   │   │   ├── network/               # Farmer network views
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/                       # API route handlers
│   │   │   └── webhooks/
│   │   │       └── weather/
│   │   │           └── route.ts
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home page
│   │   ├── loading.tsx                # Loading UI
│   │   ├── error.tsx                  # Error boundary
│   │   └── not-found.tsx              # 404 page
│   │
│   ├── components/                    # React components (Atomic Design)
│   │   ├── atoms/                     # Basic building blocks
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Label/
│   │   │   └── index.ts
│   │   │
│   │   ├── molecules/                 # Simple component groups
│   │   │   ├── FormField/
│   │   │   ├── WeatherCard/
│   │   │   ├── CropSelector/
│   │   │   └── HerbicideWarning/
│   │   │
│   │   ├── organisms/                 # Complex components
│   │   │   ├── FieldMap/             # Mapbox field boundary editor
│   │   │   ├── RotationPlanner/      # Crop rotation interface
│   │   │   ├── YieldChart/           # Recharts predictions
│   │   │   ├── NetworkGraph/         # Neo4j visualization
│   │   │   └── HerbicideValidator/   # Restriction checker
│   │   │
│   │   ├── templates/                 # Page layouts
│   │   │   ├── DashboardLayout/
│   │   │   ├── AuthLayout/
│   │   │   └── MarketingLayout/
│   │   │
│   │   └── providers/                 # Context providers
│   │       ├── ThemeProvider.tsx
│   │       ├── AuthProvider.tsx
│   │       └── GraphQLProvider.tsx
│   │
│   ├── features/                      # Feature-specific modules
│   │   ├── farms/
│   │   │   ├── hooks/
│   │   │   │   ├── useFarm.ts
│   │   │   │   └── useFarmMutations.ts
│   │   │   ├── components/
│   │   │   ├── queries/
│   │   │   └── types.ts
│   │   │
│   │   ├── fields/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   ├── utils/
│   │   │   └── types.ts
│   │   │
│   │   ├── herbicides/               # Critical constraint feature
│   │   │   ├── hooks/
│   │   │   ├── validators/
│   │   │   └── types.ts
│   │   │
│   │   └── predictions/
│   │       ├── hooks/
│   │       ├── models/
│   │       └── types.ts
│   │
│   ├── lib/                          # Core libraries and utilities
│   │   ├── apollo/                   # Apollo Client setup
│   │   │   ├── client.ts
│   │   │   ├── cache.ts
│   │   │   └── links.ts
│   │   ├── api/                      # API service layer
│   │   │   ├── client.ts
│   │   │   └── endpoints.ts
│   │   ├── auth/                     # Auth utilities
│   │   │   ├── cognito.ts
│   │   │   └── session.ts
│   │   ├── utils/                    # Shared utilities
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   └── config/                   # App configuration
│   │       ├── env.ts
│   │       └── feature-flags.ts
│   │
│   ├── hooks/                        # Global React hooks
│   │   ├── useAuth.ts
│   │   ├── useNotification.ts
│   │   ├── useWebSocket.ts
│   │   └── useOffline.ts
│   │
│   ├── stores/                       # Zustand stores
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   ├── farmStore.ts
│   │   └── index.ts
│   │
│   ├── styles/                       # Global styles
│   │   ├── globals.css               # Tailwind directives
│   │   └── themes/
│   │       ├── mui-theme.ts
│   │       └── colors.ts
│   │
│   └── types/                        # TypeScript definitions
│       ├── generated/                # GraphQL codegen types
│       ├── global.d.ts
│       └── index.ts
│
├── public/                           # Static assets
│   ├── images/
│   ├── fonts/
│   └── manifest.json
│
├── tests/                            # Test configuration
│   ├── setup.ts
│   ├── mocks/
│   └── fixtures/
│
├── .env.local                        # Local environment variables
├── .env.production                   # Production environment variables
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── vitest.config.ts                  # Vitest configuration
└── package.json                      # Dependencies
```

## Component Standards

### Component Template

```typescript
// components/organisms/FieldMap/FieldMap.tsx

import { memo, useCallback, useEffect, useState } from 'react';
import { Box, Paper } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import { z } from 'zod';
import type { Field, GeoJSON } from '@/types';

// Props validation schema
const FieldMapPropsSchema = z.object({
  field: z.custom<Field>(),
  onBoundaryChange: z.function().args(z.custom<GeoJSON>()).optional(),
  readOnly: z.boolean().default(false),
  className: z.string().optional(),
});

// Infer TypeScript types from schema
export type FieldMapProps = z.infer<typeof FieldMapPropsSchema>;

/**
 * FieldMap - Interactive field boundary editor using Mapbox
 * 
 * @component
 * @example
 * ```tsx
 * <FieldMap 
 *   field={currentField}
 *   onBoundaryChange={handleBoundaryUpdate}
 *   readOnly={!isEditing}
 * />
 * ```
 */
export const FieldMap = memo<FieldMapProps>(({ 
  field, 
  onBoundaryChange,
  readOnly = false,
  className 
}) => {
  // Validate props at runtime in development
  if (process.env.NODE_ENV === 'development') {
    FieldMapPropsSchema.parse({ field, onBoundaryChange, readOnly, className });
  }

  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize Mapbox
  useEffect(() => {
    // Map initialization logic
  }, [field.id]);

  // Handle boundary editing
  const handleDrawComplete = useCallback((geometry: GeoJSON) => {
    if (!readOnly && onBoundaryChange) {
      onBoundaryChange(geometry);
    }
  }, [readOnly, onBoundaryChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Paper 
        elevation={2}
        sx={{ height: 400, position: 'relative' }}
        data-testid="field-map"
      >
        <Box id={`map-${field.id}`} sx={{ height: '100%' }} />
        {isDrawing && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16,
              bgcolor: 'primary.main',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 1
            }}
          >
            Drawing mode active
          </Box>
        )}
      </Paper>
    </motion.div>
  );
});

FieldMap.displayName = 'FieldMap';

// Export with default props for Storybook
export default FieldMap;
```

### Naming Conventions

- **Components**: PascalCase (e.g., `FieldMap`, `WeatherCard`)
- **Files**: Component files match component name (e.g., `FieldMap.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useFarmData`, `useHerbicideValidation`)
- **Utilities**: camelCase (e.g., `formatAcres`, `validateBoundary`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_FIELD_SIZE`, `API_TIMEOUT`)
- **Types/Interfaces**: PascalCase (e.g., `FarmData`, `FieldBoundary`)
- **Props Types**: ComponentName + 'Props' (e.g., `FieldMapProps`)
- **Test Files**: Component.test.tsx or Component.spec.tsx
- **Stories**: Component.stories.tsx (for Storybook)

## State Management

### Store Structure

```plaintext
stores/
├── authStore.ts          # Authentication & user state
├── farmStore.ts          # Farm & field data cache
├── uiStore.ts            # UI state (modals, notifications)
├── optimizationStore.ts  # Optimization results cache
├── weatherStore.ts       # Real-time weather updates
└── index.ts             # Store exports & devtools
```

### State Management Template

```typescript
// stores/farmStore.ts

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Farm, Field } from '@/types';

interface FarmState {
  // State
  farms: Map<string, Farm>;
  selectedFarmId: string | null;
  fields: Map<string, Field>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setFarms: (farms: Farm[]) => void;
  selectFarm: (farmId: string) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  addHerbicideApplication: (fieldId: string, herbicide: HerbicideApplication) => void;
  clearError: () => void;
  
  // Computed getters
  getSelectedFarm: () => Farm | undefined;
  getFieldsByFarm: (farmId: string) => Field[];
  getAdjacentFields: (fieldId: string) => Field[];
}

export const useFarmStore = create<FarmState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // Initial state
          farms: new Map(),
          selectedFarmId: null,
          fields: new Map(),
          isLoading: false,
          error: null,

          // Actions
          setFarms: (farms) => set((state) => {
            state.farms.clear();
            farms.forEach(farm => {
              state.farms.set(farm.id, farm);
            });
          }),

          selectFarm: (farmId) => set((state) => {
            state.selectedFarmId = farmId;
          }),

          updateField: (fieldId, updates) => set((state) => {
            const field = state.fields.get(fieldId);
            if (field) {
              Object.assign(field, updates);
            }
          }),

          addHerbicideApplication: (fieldId, herbicide) => set((state) => {
            const field = state.fields.get(fieldId);
            if (field) {
              field.herbicideHistory = field.herbicideHistory || [];
              field.herbicideHistory.push(herbicide);
              
              // Trigger restriction recalculation
              field.plantBackRestrictions = calculateRestrictions(
                field.herbicideHistory
              );
            }
          }),

          clearError: () => set((state) => {
            state.error = null;
          }),

          // Computed getters
          getSelectedFarm: () => {
            const state = get();
            return state.selectedFarmId 
              ? state.farms.get(state.selectedFarmId) 
              : undefined;
          },

          getFieldsByFarm: (farmId) => {
            const state = get();
            return Array.from(state.fields.values())
              .filter(field => field.farmId === farmId);
          },

          getAdjacentFields: (fieldId) => {
            const state = get();
            const field = state.fields.get(fieldId);
            if (!field) return [];
            
            // Use Neo4j relationships to find adjacent fields
            return field.adjacentFieldIds
              .map(id => state.fields.get(id))
              .filter(Boolean) as Field[];
          },
        }))
      ),
      {
        name: 'farm-storage',
        partialize: (state) => ({
          selectedFarmId: state.selectedFarmId,
          // Don't persist farms/fields - fetch fresh on load
        }),
      }
    ),
    {
      name: 'FarmStore',
    }
  )
);

// Selectors for common queries
export const useSelectedFarm = () => 
  useFarmStore(state => state.getSelectedFarm());

export const useFieldsForFarm = (farmId: string) => 
  useFarmStore(state => state.getFieldsByFarm(farmId));

export const useHerbicideRestrictions = (fieldId: string) =>
  useFarmStore(state => {
    const field = state.fields.get(fieldId);
    return field?.plantBackRestrictions || [];
  });
```

## API Integration

### Service Template

```typescript
// lib/api/services/farmService.ts

import { z } from 'zod';
import { apolloClient } from '@/lib/apollo/client';
import { apiClient } from '@/lib/api/client';
import { 
  GET_FARM, 
  UPDATE_FIELD, 
  CHECK_HERBICIDE_RESTRICTIONS 
} from '@/features/farms/queries';
import type { Farm, Field, HerbicideRestriction } from '@/types';

// Response schemas for runtime validation
const FarmResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  ownerId: z.string(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  totalAcres: z.number(),
  fields: z.array(z.custom<Field>()),
});

/**
 * Farm Service - Handles all farm-related API operations
 */
export class FarmService {
  /**
   * Fetch farm with all fields using GraphQL
   */
  static async getFarm(farmId: string): Promise<Farm> {
    try {
      const { data } = await apolloClient.query({
        query: GET_FARM,
        variables: { farmId },
        fetchPolicy: 'cache-first', // Use cache for 5 minutes
      });

      // Validate response at runtime
      return FarmResponseSchema.parse(data.farm);
    } catch (error) {
      console.error('Failed to fetch farm:', error);
      throw new Error('Unable to load farm data. Please try again.');
    }
  }

  /**
   * Update field boundaries with optimistic update
   */
  static async updateFieldBoundary(
    fieldId: string, 
    boundary: GeoJSON
  ): Promise<Field> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_FIELD,
        variables: { fieldId, boundary },
        optimisticResponse: {
          updateField: {
            __typename: 'Field',
            id: fieldId,
            boundary,
            acres: calculateAcres(boundary),
          },
        },
      });

      return data.updateField;
    } catch (error) {
      console.error('Failed to update field boundary:', error);
      throw new Error('Unable to save field changes.');
    }
  }

  /**
   * Check herbicide restrictions - Critical safety feature
   */
  static async checkHerbicideRestrictions(
    fieldId: string,
    cropId: string,
    plantingDate: Date
  ): Promise<HerbicideRestriction[]> {
    try {
      // This is a critical safety check - never cache
      const { data } = await apolloClient.query({
        query: CHECK_HERBICIDE_RESTRICTIONS,
        variables: { fieldId, cropId, plantingDate },
        fetchPolicy: 'network-only', // Always fetch fresh data
      });

      // Validate each restriction
      return data.restrictions.map((r: any) => ({
        herbicideId: r.herbicideId,
        herbicideName: r.herbicideName,
        applicationDate: new Date(r.applicationDate),
        restrictionMonths: r.restrictionMonths,
        expirationDate: new Date(r.expirationDate),
        isViolation: r.isViolation,
        message: r.message,
      }));
    } catch (error) {
      // Critical safety feature - fail safe
      console.error('Herbicide restriction check failed:', error);
      throw new Error(
        'Unable to verify herbicide safety. Please verify restrictions manually before planting.'
      );
    }
  }

  /**
   * Bulk sync fields for offline support
   */
  static async syncFields(farmId: string): Promise<Field[]> {
    try {
      const response = await apiClient.post('/sync/fields', {
        farmId,
        lastSync: localStorage.getItem(`lastSync_${farmId}`) || null,
      });

      // Store in IndexedDB for offline access
      await storeOfflineData('fields', response.data.fields);
      localStorage.setItem(`lastSync_${farmId}`, new Date().toISOString());

      return response.data.fields;
    } catch (error) {
      // Fallback to offline data if available
      const offlineFields = await getOfflineData('fields', farmId);
      if (offlineFields.length > 0) {
        console.warn('Using offline field data');
        return offlineFields;
      }
      throw error;
    }
  }
}

// Export singleton instance for convenience
export const farmService = FarmService;
```

### API Client Configuration

```typescript
// lib/api/client.ts

import axios, { AxiosError, AxiosInstance } from 'axios';
import { getSession, refreshToken } from '@/lib/auth/session';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        
        // Add request ID for tracing
        config.headers['X-Request-Id'] = crypto.randomUUID();
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue request while refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await refreshToken();
            
            // Retry queued requests
            this.failedQueue.forEach(({ resolve }) => resolve(newToken));
            this.failedQueue = [];
            
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Redirect to login
            this.failedQueue.forEach(({ reject }) => reject(refreshError));
            this.failedQueue = [];
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
          
          // Implement exponential backoff
          if (originalRequest._retryCount < 3) {
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
            const delay = retryAfter 
              ? parseInt(retryAfter) * 1000 
              : Math.pow(2, originalRequest._retryCount) * 1000;
            
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.client(originalRequest);
          }
        }

        // Log errors for monitoring
        if (error.response?.status >= 500) {
          console.error('Server error:', {
            url: error.config?.url,
            status: error.response.status,
            data: error.response.data,
            requestId: error.config?.headers?.['X-Request-Id'],
          });
        }

        return Promise.reject(error);
      }
    );
  }

  // Public methods
  get = this.client.get;
  post = this.client.post;
  put = this.client.put;
  patch = this.client.patch;
  delete = this.client.delete;
}

export const apiClient = new ApiClient();
```

## Routing

### Route Configuration

```typescript
// app/routes.ts

import { z } from 'zod';

// Route parameter schemas for type safety
export const RouteParams = {
  farmId: z.string().uuid(),
  fieldId: z.string().uuid(),
  seasonId: z.string().regex(/^\d{4}$/),
};

// Route definitions with type-safe parameters
export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  
  // Dashboard routes
  dashboard: '/dashboard',
  farms: '/farms',
  farm: (farmId: string) => `/farms/${farmId}`,
  field: (farmId: string, fieldId: string) => `/farms/${farmId}/fields/${fieldId}`,
  
  // Feature routes
  optimization: '/optimization',
  network: '/network',
  predictions: '/predictions',
  herbicides: '/herbicides',
  
  // Settings
  settings: '/settings',
  profile: '/settings/profile',
  billing: '/settings/billing',
} as const;

// Route guards for protected pages
export const protectedRoutes = [
  '/dashboard',
  '/farms',
  '/optimization',
  '/network',
  '/predictions',
  '/settings',
];

// Middleware for route protection (app/middleware.ts)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if route is protected
  const isProtected = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtected) {
    const token = await getToken({ req: request });
    
    if (!token) {
      // Redirect to login with return URL
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    // Check for specific role requirements
    if (pathname.startsWith('/admin') && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## Styling Guidelines

### Styling Approach

We use a hybrid approach combining Tailwind CSS for rapid development with MUI components for complex UI elements. Emotion is used for dynamic theming required by MUI.

**Priority Order:**
1. Use MUI components when available (for consistency and accessibility)
2. Style with Tailwind utilities for layout and spacing
3. Use Emotion styled components only for complex dynamic styles
4. CSS modules for component-specific animations

### Global Theme Variables

```css
/* styles/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors - Agricultural theme */
    --color-primary: 34 139 34; /* Forest Green */
    --color-primary-dark: 25 104 25;
    --color-primary-light: 50 175 50;
    
    --color-secondary: 139 90 43; /* Soil Brown */
    --color-secondary-dark: 101 65 31;
    --color-secondary-light: 177 118 61;
    
    --color-accent: 255 193 7; /* Wheat Gold */
    --color-success: 76 175 80; /* Growth Green */
    --color-warning: 255 152 0; /* Caution Orange */
    --color-error: 211 47 47; /* Alert Red */
    --color-info: 33 150 243; /* Sky Blue */
    
    /* Neutral colors */
    --color-background: 250 250 250;
    --color-surface: 255 255 255;
    --color-text-primary: 33 33 33;
    --color-text-secondary: 117 117 117;
    --color-border: 224 224 224;
    
    /* Spacing scale (rem) */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --spacing-3xl: 4rem;
    
    /* Typography */
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'Fira Code', 'Courier New', monospace;
    
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: 1.875rem;
    --text-4xl: 2.25rem;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    
    /* Border radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-full: 9999px;
    
    /* Animation */
    --transition-fast: 150ms;
    --transition-base: 250ms;
    --transition-slow: 350ms;
    
    /* Z-index scale */
    --z-dropdown: 1000;
    --z-modal: 1050;
    --z-popover: 1100;
    --z-tooltip: 1150;
    --z-toast: 1200;
  }
  
  /* Dark mode */
  [data-theme='dark'] {
    --color-background: 18 18 18;
    --color-surface: 33 33 33;
    --color-text-primary: 245 245 245;
    --color-text-secondary: 158 158 158;
    --color-border: 66 66 66;
    
    --color-primary: 46 160 46;
    --color-primary-dark: 34 139 34;
    --color-primary-light: 60 180 60;
  }
}

/* Custom utility classes */
@layer utilities {
  /* Consistent focus styles */
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
  }
  
  /* Card styles */
  .card {
    @apply bg-surface rounded-lg shadow-md border border-border;
  }
  
  /* Form field styles */
  .field {
    @apply w-full px-3 py-2 border border-border rounded-md focus-ring;
  }
  
  /* Agricultural data badges */
  .badge-herbicide {
    @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error;
  }
  
  .badge-safe {
    @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success;
  }
  
  .badge-warning {
    @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning;
  }
}
```

## Testing Requirements

### Component Test Template

```typescript
// components/organisms/HerbicideValidator/HerbicideValidator.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { HerbicideValidator } from './HerbicideValidator';
import { CHECK_HERBICIDE_RESTRICTIONS } from '@/features/herbicides/queries';

// Mock data
const mockField = {
  id: 'field-1',
  name: 'North 40',
  acres: 40,
  herbicideHistory: [
    {
      id: 'app-1',
      herbicideId: 'herb-1',
      herbicideName: 'Pursuit',
      applicationDate: new Date('2024-06-15'),
      rate: 4,
      unit: 'oz/acre',
    },
  ],
};

const mockCrop = {
  id: 'crop-1',
  name: 'Corn',
  variety: 'Pioneer P9234',
};

// GraphQL mocks
const mocks = [
  {
    request: {
      query: CHECK_HERBICIDE_RESTRICTIONS,
      variables: {
        fieldId: 'field-1',
        cropId: 'crop-1',
        plantingDate: expect.any(Date),
      },
    },
    result: {
      data: {
        restrictions: [
          {
            herbicideId: 'herb-1',
            herbicideName: 'Pursuit',
            applicationDate: '2024-06-15',
            restrictionMonths: 18,
            expirationDate: '2025-12-15',
            isViolation: true,
            message: 'Cannot plant corn for 18 months after Pursuit application',
          },
        ],
      },
    },
  },
];

describe('HerbicideValidator', () => {
  const user = userEvent.setup();
  const onValidationComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders validation form correctly', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HerbicideValidator
          field={mockField}
          onValidationComplete={onValidationComplete}
        />
      </MockedProvider>
    );

    // Check form elements
    expect(screen.getByLabelText(/select crop/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/planting date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check restrictions/i }))
      .toBeInTheDocument();
    
    // Check herbicide history display
    const history = screen.getByTestId('herbicide-history');
    expect(within(history).getByText('Pursuit')).toBeInTheDocument();
    expect(within(history).getByText('06/15/2024')).toBeInTheDocument();
  });

  it('validates herbicide restrictions on form submit', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HerbicideValidator
          field={mockField}
          onValidationComplete={onValidationComplete}
        />
      </MockedProvider>
    );

    // Select crop
    const cropSelect = screen.getByLabelText(/select crop/i);
    await user.click(cropSelect);
    await user.click(screen.getByText('Corn'));

    // Set planting date
    const dateInput = screen.getByLabelText(/planting date/i);
    await user.type(dateInput, '2025-04-15');

    // Submit form
    const submitButton = screen.getByRole('button', { 
      name: /check restrictions/i 
    });
    await user.click(submitButton);

    // Wait for validation results
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Check violation display
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-error/10');
    expect(within(alert).getByText(/cannot plant corn/i)).toBeInTheDocument();
    
    // Verify callback
    expect(onValidationComplete).toHaveBeenCalledWith({
      isValid: false,
      violations: expect.arrayContaining([
        expect.objectContaining({
          herbicideName: 'Pursuit',
          isViolation: true,
        }),
      ]),
    });
  });

  it('shows success when no restrictions are violated', async () => {
    const safeMocks = [
      {
        request: {
          query: CHECK_HERBICIDE_RESTRICTIONS,
          variables: {
            fieldId: 'field-1',
            cropId: 'crop-2',
            plantingDate: expect.any(Date),
          },
        },
        result: {
          data: {
            restrictions: [],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={safeMocks} addTypename={false}>
        <HerbicideValidator
          field={mockField}
          onValidationComplete={onValidationComplete}
        />
      </MockedProvider>
    );

    // Select soybeans (no restrictions)
    const cropSelect = screen.getByLabelText(/select crop/i);
    await user.click(cropSelect);
    await user.click(screen.getByText('Soybeans'));

    // Submit
    await user.click(screen.getByRole('button', { 
      name: /check restrictions/i 
    }));

    // Check success message
    await waitFor(() => {
      const successAlert = screen.getByRole('status');
      expect(successAlert).toHaveClass('bg-success/10');
      expect(within(successAlert).getByText(/safe to plant/i))
        .toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const errorMocks = [
      {
        request: {
          query: CHECK_HERBICIDE_RESTRICTIONS,
          variables: expect.any(Object),
        },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <HerbicideValidator
          field={mockField}
          onValidationComplete={onValidationComplete}
        />
      </MockedProvider>
    );

    // Trigger validation
    await user.click(screen.getByRole('button', { 
      name: /check restrictions/i 
    }));

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/unable to verify herbicide safety/i))
        .toBeInTheDocument();
    });
  });
});
```

### Testing Best Practices

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions and data flow
3. **E2E Tests**: Test critical user flows (login, herbicide validation, field creation)
4. **Coverage Goals**: Aim for 80% code coverage, 100% for critical safety features
5. **Test Structure**: Arrange-Act-Assert pattern
6. **Mock External Dependencies**: API calls, routing, state management
7. **Accessibility Testing**: Include ARIA queries in all component tests
8. **Visual Regression**: Chromatic for UI consistency
9. **Performance Testing**: Measure render times for large datasets

## Environment Configuration

```bash
# .env.local (Development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_WS_URL=ws://localhost:4000/graphql
NEXT_PUBLIC_MAPBOX_TOKEN=pk.test_xxxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# AWS Cognito
NEXT_PUBLIC_COGNITO_REGION=us-west-2
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-west-2_xxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxx

# Feature flags
NEXT_PUBLIC_ENABLE_NETWORK_FEATURES=false
NEXT_PUBLIC_ENABLE_ML_PREDICTIONS=false
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=xxxxx
```

```bash
# .env.production (Production)
NEXT_PUBLIC_APP_URL=https://farmcalc.app
NEXT_PUBLIC_API_URL=https://api.farmcalc.app/graphql
NEXT_PUBLIC_WS_URL=wss://api.farmcalc.app/graphql
NEXT_PUBLIC_MAPBOX_TOKEN=pk.prod_xxxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# AWS Cognito
NEXT_PUBLIC_COGNITO_REGION=us-west-2
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-west-2_xxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxx

# Feature flags
NEXT_PUBLIC_ENABLE_NETWORK_FEATURES=true
NEXT_PUBLIC_ENABLE_ML_PREDICTIONS=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=xxxxx

# Security
NEXT_PUBLIC_CSP_REPORT_URI=https://csp.farmcalc.app/report
```

## Frontend Developer Standards

### Critical Coding Rules

1. **NEVER use fallback data without user consent** - All data must be real
2. **ALWAYS validate herbicide restrictions** - Safety critical feature
3. **Type everything** - No `any` types except for third-party integrations
4. **Use server components by default** - Client components only when needed
5. **Validate environment variables** - Use zod schemas for runtime validation
6. **Check for offline mode** - Provide graceful degradation
7. **Use semantic HTML** - For accessibility and SEO
8. **Implement error boundaries** - Catch and handle React errors
9. **Lazy load heavy components** - Maps, charts, large forms
10. **Use React.memo sparingly** - Only for expensive re-renders
11. **Avoid inline styles** - Use Tailwind or styled components
12. **Test critical paths** - 100% coverage for safety features
13. **Use feature flags** - For gradual rollout of new features
14. **Implement proper loading states** - Skeleton screens, not spinners
15. **Handle race conditions** - Cancel previous requests
16. **Use proper form validation** - Client and server-side
17. **Implement proper SEO** - Meta tags, structured data
18. **Monitor bundle size** - Keep under 200KB initial JS
19. **Use proper image optimization** - Next.js Image component
20. **Implement proper caching** - Apollo cache, React Query

### Quick Reference

```bash
# Development commands
npm run dev          # Start Next.js dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run test         # Run Vitest tests
npm run test:e2e     # Run Playwright tests
npm run storybook    # Start Storybook (port 6006)

# Code generation
npm run codegen      # Generate GraphQL types
npm run generate:component  # Generate component boilerplate

# Analysis
npm run analyze      # Analyze bundle size
npm run lighthouse   # Run Lighthouse audit

# Common imports
import { Button, TextField, Card } from '@mui/material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFarmStore } from '@/stores/farmStore';
import { farmService } from '@/lib/api/services/farmService';
import { routes } from '@/app/routes';
import type { Farm, Field } from '@/types';

# File naming
ComponentName.tsx         # Component file
ComponentName.test.tsx    # Test file
ComponentName.stories.tsx # Storybook file
use-hook-name.ts         # Custom hook
service-name.ts          # API service
store-name.ts            # Zustand store

# Project patterns
- Use Server Components for data fetching
- Use Client Components for interactivity
- Use route groups for layout sharing
- Use parallel routes for simultaneous rendering
- Use intercepting routes for modals
- Use loading.tsx for loading states
- Use error.tsx for error boundaries
- Use Suspense for async components
```

---

*This frontend architecture document provides comprehensive guidance for implementing the FarmCalc user interface with modern React patterns, type safety, and agricultural domain requirements. All patterns are optimized for AI agent implementation with clear, consistent conventions.*