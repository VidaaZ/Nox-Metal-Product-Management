describe('Data Validation', () => {
  describe('Email validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com'
      ];

      validEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com'
      ];

      invalidEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('Password validation', () => {
    it('should validate password requirements', () => {
      const validatePassword = (password: string) => {
        return password.length >= 6;
      };

      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('longer')).toBe(true);
      expect(validatePassword('123456')).toBe(true);
    });
  });

  describe('Product validation', () => {
    it('should validate product name', () => {
      const validateProductName = (name: string) => {
        return Boolean(name && name.trim().length > 0 && name.length <= 100);
      };

      expect(validateProductName('')).toBe(false);
      expect(validateProductName('   ')).toBe(false);
      expect(validateProductName('Valid Product')).toBe(true);
      expect(validateProductName('A'.repeat(101))).toBe(false);
    });

    it('should validate product price', () => {
      const validatePrice = (price: number) => {
        return typeof price === 'number' && price > 0;
      };

      expect(validatePrice(0)).toBe(false);
      expect(validatePrice(-10)).toBe(false);
      expect(validatePrice(10.99)).toBe(true);
      expect(validatePrice(100)).toBe(true);
    });
  });

  describe('Pagination validation', () => {
    it('should validate pagination parameters', () => {
      const validatePagination = (page: number, limit: number) => {
        return page > 0 && limit > 0 && limit <= 100;
      };

      expect(validatePagination(1, 10)).toBe(true);
      expect(validatePagination(0, 10)).toBe(false);
      expect(validatePagination(1, 0)).toBe(false);
      expect(validatePagination(1, 101)).toBe(false);
      expect(validatePagination(5, 50)).toBe(true);
    });
  });
}); 