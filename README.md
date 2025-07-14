# MongoDB & API Integration Troubleshooting Guide

## Table of Contents
- [Common Issues & Solutions](#common-issues--solutions)
  - [MongoDB ObjectId Handling](#1-mongodb-objectid-handling)
  - [Duplicate Key Errors](#2-duplicate-key-errors)
  - [API Response Handling](#3-api-response-handling)
  - [State Management & UI Updates](#4-state-management--ui-updates)
- [Best Practices](#best-practices-checklist)
- [Error Resolution Steps](#common-error-resolution-steps)
- [Troubleshooting Templates](#troubleshooting-templates)

## Common Issues & Solutions

### 1. MongoDB ObjectId Handling

#### Common Issues:
- 404: Category/Item not found
- BSONError: input must be a 24 character hex string
- Invalid ID format errors

#### Solution Template:
```
"I need help fixing MongoDB ObjectId handling in my application. Specifically:
1. Ensure proper ID validation before database operations
2. Add proper type definitions for MongoDB documents
3. Set up virtual ID getters for consistent API responses
4. Handle ObjectId conversion in routes

Please check:
- Model definitions for proper schema setup
- Route handlers for proper ID validation
- Frontend code for correct ID field usage (_id vs id)
- Type definitions in shared schema files"
```

### 2. Duplicate Key Errors

#### Common Issues:
- E11000 duplicate key error
- Unique constraint violations
- Categories/items with same name/identifier

#### Solution Template:
```
"I'm getting MongoDB duplicate key errors (E11000). Please help:
1. Add proper error handling for duplicate keys in routes
2. Implement frontend validation before submission
3. Add user-friendly error messages
4. Set up proper HTTP status codes (409 for conflicts)

Check:
- MongoDB schema unique constraints
- Route error handling
- Frontend mutation error handling
- User feedback mechanisms"
```

### 3. API Response Handling

#### Common Issues:
- White screen after operations
- Data not showing in frontend
- Undefined or null data
- State management issues

#### Solution Template:
```
"Need help with API response handling in my React/Next.js application:
1. Ensure proper JSON parsing of API responses
2. Implement proper loading states
3. Add optimistic updates for better UX
4. Handle error states appropriately

Please review:
- API request utility functions
- React Query/mutation implementations
- Loading state management
- Error boundary setup"
```

### 4. State Management & UI Updates

#### Common Issues:
- UI not updating after operations
- Stale data after mutations
- Cache inconsistencies
- Loading state issues

#### Solution Template:
```
"Help improve state management in my React application:
1. Set up proper React Query invalidation
2. Implement optimistic updates
3. Add proper loading states
4. Handle error states and rollbacks

Focus on:
- Query client configuration
- Mutation handlers
- Cache invalidation strategies
- Loading state indicators"
```

## Best Practices Checklist

### 1. MongoDB Models
```typescript
// Always include:
- Proper schema definitions with types
- Virtual ID getters
- Proper indexes
- Timestamp fields
- JSON serialization options
```

### 2. Route Handlers
```typescript
// Include:
- Input validation
- ObjectId validation
- Proper error handling
- Appropriate HTTP status codes
- Consistent response format
```

### 3. Frontend Mutations
```typescript
// Implement:
- Optimistic updates
- Error handling
- Loading states
- Cache invalidation
- User feedback (toasts)
```

### 4. Type Definitions
```typescript
// Define:
- MongoDB document types
- API request/response types
- Shared schema types
- Zod validation schemas
```

## Common Error Resolution Steps

### 1. For Database Errors
- Check schema definitions
- Validate indexes
- Verify ID handling
- Check data types

### 2. For API Errors
- Verify route handlers
- Check response parsing
- Validate error handling
- Confirm status codes

### 3. For UI Issues
- Check query/mutation setup
- Verify loading states
- Review error handling
- Test cache invalidation

### 4. For Type Errors
- Update shared schemas
- Check model definitions
- Verify API types
- Update frontend types

## Troubleshooting Templates

### Template for Complex Issues
```
"I need help debugging a full-stack issue in my MERN application. Please help by:

1. Database Layer:
   - Check MongoDB schema definitions
   - Verify indexes and constraints
   - Review ObjectId handling
   - Check data validation

2. API Layer:
   - Review route handlers
   - Check error handling
   - Verify response formats
   - Test status codes

3. Frontend Layer:
   - Check React Query setup
   - Verify mutation handlers
   - Review loading states
   - Test error handling

4. Type System:
   - Update shared schemas
   - Check MongoDB types
   - Verify API types
   - Review frontend types

Current error: [Insert specific error]
Expected behavior: [Insert expected behavior]
Current behavior: [Insert current behavior]

Please provide a systematic approach to identify and fix the issue."
```

### Important Notes When Using Templates:
1. Always provide specific error messages
2. Include current and expected behavior
3. Mention any recent changes
4. Provide relevant code snippets
5. Specify the tech stack and versions 