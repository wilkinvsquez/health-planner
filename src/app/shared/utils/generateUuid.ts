import { nanoid } from 'nanoid';

export function generateUniqueId(): string {
  return nanoid(26);
}
