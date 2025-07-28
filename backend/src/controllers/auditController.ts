import { Request, Response } from 'express';
import { getAuditLogs } from '../utils/auditLogger.js';
import { PaginatedResponse, AuditLog } from '../types/index.js';

export const getLogs = async (req: any, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ 
        error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100' 
      });
    }

    const { logs, total } = await getAuditLogs(page, limit);

    const response: PaginatedResponse<AuditLog> = {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 