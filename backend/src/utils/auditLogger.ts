import { AuditLog as AuditLogModel } from '../models/database.js';
import { AuditLog } from '../types/index.js';
import { Types } from 'mongoose';

export const logAuditAction = async (
  action: 'create' | 'update' | 'delete' | 'restore',
  userEmail: string,
  productId?: string,
  productName?: string,
  details?: string
): Promise<void> => {
  try {
    const auditLog = new AuditLogModel({
      action,
      user_email: userEmail,
      product_id: productId ? new Types.ObjectId(productId) : undefined,
      product_name: productName,
      details
    });

    await auditLog.save();
    console.log(`Audit log created: ${action} by ${userEmail} for product ${productName || productId}`);
  } catch (error) {
    console.error('Audit log error:', error);
    throw error;
  }
};

export const getAuditLogs = async (
  page: number = 1,
  limit: number = 20
): Promise<{ logs: AuditLog[], total: number }> => {
  const offset = (page - 1) * limit;
  
  console.log('Getting audit logs with offset:', offset, 'limit:', limit);
  
  try {
    // Get total count
    const total = await AuditLogModel.countDocuments();
    console.log('Total audit logs in database:', total);
    
    // Get paginated logs
    const foundLogs = await AuditLogModel
      .find({})
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const logs: AuditLog[] = foundLogs.map((log: any) => ({
      _id: log._id,
      action: log.action,
      user_email: log.user_email,
      product_id: log.product_id || undefined,
      product_name: log.product_name || undefined,
      details: log.details || undefined,
      timestamp: log.timestamp
    }));

    console.log('Retrieved audit logs:', logs.length);
    return { logs, total };
  } catch (error) {
    console.error('Error getting audit logs:', error);
    throw error;
  }
};