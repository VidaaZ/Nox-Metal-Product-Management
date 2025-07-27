import { db } from '../models/database.js';
import { AuditLog } from '../types/index.js';

export const logAuditAction = async (
  action: 'create' | 'update' | 'delete' | 'restore',
  userEmail: string,
  productId?: number,
  productName?: string,
  details?: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO audit_logs (action, user_email, product_id, product_name, details) 
       VALUES (?, ?, ?, ?, ?)`,
      [action, userEmail, productId, productName, details],
      function (err) {
        if (err) {
          console.error('Audit log error:', err);
          reject(err);
        } else {
          console.log(`Audit log created: ${action} by ${userEmail} for product ${productName || productId}`);
          resolve();
        }
      }
    );
  });
};

export const getAuditLogs = async (
  page: number = 1,
  limit: number = 20
): Promise<{ logs: AuditLog[], total: number }> => {
  const offset = (page - 1) * limit;
  
  return new Promise((resolve, reject) => {
    // Get total count
    db.get('SELECT COUNT(*) as count FROM audit_logs', [], (err, countRow: any) => {
      if (err) {
        reject(err);
        return;
      }
      
      const total = countRow.count;
      
      // Get paginated logs
      db.all(
        `SELECT * FROM audit_logs 
         ORDER BY timestamp DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, rows: AuditLog[]) => {
          if (err) {
            reject(err);
          } else {
            resolve({ logs: rows, total });
          }
        }
      );
    });
  });
}; 