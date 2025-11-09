# Centralized Error Handling Plan

## Goal
Create centralized error handling with async wrapper and global error handler as last defense.

## File Structure

```
src/
├── utils/
│   └── errors.ts              # All error classes + asyncHandler
├── middleware/
│   └── error.middleware.ts    # Global error handler (last defense)
└── controllers/
    └── *.controller.ts        # Use asyncHandler, throw errors
```

## Implementation Steps

### Step 1: Enhance `src/utils/errors.ts`

**Add missing error classes:**
- `PaymentError` (400)
- `LoanError` (400)
- `DatabaseError` (500)
- `ServiceUnavailableError` (503)

**Add asyncHandler wrapper:**
```typescript
export function asyncHandler(fn: Function) {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw error; // Let global handler catch it
    }
  };
}
```

**Keep existing:**
- All current error classes
- Error formatter function

### Step 2: Create `src/middleware/error.middleware.ts`

**Global error handler (last defense):**
- Handle all error types
- Check if `AppError` instance → use its statusCode
- Handle Elysia built-in errors (NOT_FOUND, VALIDATION)
- Handle unknown errors → 500
- Log all errors with context
- Return standardized error response

**Error types to handle:**
- `AppError` and subclasses
- `NOT_FOUND` (Elysia)
- `VALIDATION` (Elysia)
- Unknown errors
- Database errors
- Service errors

### Step 3: Update `src/index.ts`

**Remove current onError handler**
**Import and use error middleware:**
```typescript
import { errorMiddleware } from './middleware/error.middleware';
app.use(errorMiddleware);
```

### Step 4: Refactor Controllers

**Pattern:**
```typescript
// Remove all try-catch blocks
// Use asyncHandler wrapper
// Throw errors directly

static getLoanById = asyncHandler(async (context: any) => {
  const { params } = context;
  const loan = await loanService.getLoanById(params.loanId);
  
  if (!loan) {
    throw new NotFoundError('Loan not found');
  }
  
  // No try-catch needed
  return { success: true, data: loan };
})
```

**Changes per controller:**
1. Import `asyncHandler` and error classes
2. Remove all try-catch blocks
3. Wrap methods with `asyncHandler`
4. Replace status code setting with throwing errors
5. Remove `set.status` calls (handler does it)

### Step 5: Update Services

**Services throw errors:**
- Throw `AppError` instances
- No HTTP concerns
- Example: `throw new NotFoundError('Loan not found')`

## Error Response Format

```typescript
{
  success: false,
  error: {
    message: string,
    statusCode: number,
    code?: string,        // For specific error types
    details?: any         // For validation errors
  }
}
```

## Implementation Order

1. ✅ Enhance `errors.ts` (add classes + asyncHandler)
2. ✅ Create `error.middleware.ts` (global handler)
3. ✅ Update `index.ts` (use middleware)
4. ✅ Refactor one controller (test pattern)
5. ✅ Refactor all controllers
6. ✅ Update services (throw errors)

## Benefits

- ✅ No try-catch in controllers
- ✅ Consistent error responses
- ✅ Global handler as last defense
- ✅ Better error logging
- ✅ Cleaner code

## Notes

- Global handler catches everything (last defense)
- Controllers just throw errors
- Services throw errors
- All errors go through global handler
- NOT_FOUND handled in global handler

