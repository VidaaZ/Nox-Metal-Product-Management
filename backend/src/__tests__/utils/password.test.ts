import bcrypt from 'bcryptjs';

describe('Password Hashing', () => {
  describe('bcryptjs functionality', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(password.length);
    });

    it('should verify a correct password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const isValid = await bcrypt.compare(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const isValid = await bcrypt.compare(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    it('should handle different salt rounds', async () => {
      const password = 'testPassword123';
      const hash1 = await bcrypt.hash(password, 5);
      const hash2 = await bcrypt.hash(password, 10);
      
      // Different salt rounds should produce different hashes
      expect(hash1).not.toBe(hash2);
      
      // But both should verify correctly
      const isValid1 = await bcrypt.compare(password, hash1);
      const isValid2 = await bcrypt.compare(password, hash2);
      
      expect(isValid1).toBe(true);
      expect(isValid2).toBe(true);
    });
  });
}); 