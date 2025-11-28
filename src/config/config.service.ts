import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get(key: string, fallback?: string) {
    return process.env[key] ?? fallback;
  }

  getNumber(key: string, fallback?: number) {
    const value = process.env[key];
    return value ? Number(value) : fallback;
  }

  getBoolean(key: string, fallback?: boolean) {
    const value = process.env[key];
    return value ? value === 'true' : fallback;
  }
}