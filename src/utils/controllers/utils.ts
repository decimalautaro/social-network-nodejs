import { Request } from 'express';

export function getLimit(req: Request): number {
  const { limit } = req.query;
  return parseInt(limit?.toString() || '10');
}

export function getSkip(req: Request): number {
  const { skip } = req.query;
  return parseInt(skip?.toString() || '0');
}
