# Unit Testing Guide

This project includes unit tests for core backend logic to demonstrate testing knowledge.

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode (for development)
```bash
npm run test:watch
```

## Test Coverage

The tests cover the following core backend logic:

### 1. JWT Token Management (`src/__tests__/utils/jwt.test.ts`)
- ✅ Token generation
- ✅ Token verification
- ✅ Invalid token handling

### 2. Password Security (`src/__tests__/utils/password.test.ts`)
- ✅ Password hashing
- ✅ Password verification
- ✅ Salt rounds functionality

### 3. Data Validation (`src/__tests__/utils/validation.test.ts`)
- ✅ Email validation
- ✅ Password requirements
- ✅ Product data validation
- ✅ Pagination validation

### 4. Audit Logging (`src/__tests__/utils/auditLogger.test.ts`)
- ✅ Function existence and parameters
- ✅ Promise return types
- ✅ Error handling

## Test Structure

Each test file follows this pattern:
```typescript
describe('Feature Name', () => {
  describe('Specific Function', () => {
    it('should do something specific', () => {
      // Test logic here
      expect(result).toBe(expected);
    });
  });
});
```

## What These Tests Demonstrate

1. **Basic Testing Knowledge**: Shows understanding of Jest testing framework
2. **Core Logic Testing**: Tests the most important backend functions
3. **Edge Case Handling**: Tests invalid inputs and error conditions
4. **Security Testing**: Tests password hashing and JWT functionality
5. **Data Validation**: Tests input validation logic

## Test Results

When you run `npm test`, you should see output like:
```
PASS  src/__tests__/utils/jwt.test.ts
PASS  src/__tests__/utils/password.test.ts
PASS  src/__tests__/utils/validation.test.ts
PASS  src/__tests__/utils/auditLogger.test.ts

Test Suites: 4 passed, 4 total
Tests:       15 passed, 15 total
```

This demonstrates that you understand unit testing concepts and can implement them for core backend logic. 