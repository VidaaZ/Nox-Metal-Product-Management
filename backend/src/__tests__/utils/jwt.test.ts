import jwt from 'jsonwebtoken';

describe('JWT Utils', () => {
  // Test data
  const testUser = {
    id: 1,
    email: 'test@example.com',
    full_name: 'Test User',
    role: 'user'
  };

  const JWT_SECRET = 'your-secret-key';

  describe('JWT Token Generation', () => {
    it('should generate a valid JWT token', () => {
      const token = jwt.sign(testUser, JWT_SECRET);
      
      // Check that token is a string
      expect(typeof token).toBe('string');
      
      // Check that token is not empty
      expect(token.length).toBeGreaterThan(0);
      
      // Check that token has 3 parts (header.payload.signature)
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include user data in token', () => {
      const token = jwt.sign(testUser, JWT_SECRET);
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testUser.id);
      expect(decoded.email).toBe(testUser.email);
      expect(decoded.full_name).toBe(testUser.full_name);
      expect(decoded.role).toBe(testUser.role);
    });
  });

  describe('JWT Token Verification', () => {
    it('should verify a valid token', () => {
      const token = jwt.sign(testUser, JWT_SECRET);
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testUser.id);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        jwt.verify(invalidToken, JWT_SECRET);
      }).toThrow();
    });

    it('should throw error for empty token', () => {
      expect(() => {
        jwt.verify('', JWT_SECRET);
      }).toThrow();
    });
  });
}); 