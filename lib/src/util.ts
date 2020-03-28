/**
 * expiration time unit
 * s：second
 * m：minute
 * h：hour
 * d：day
 * w：week
 * y：year
 * t：custom (ms)
 */
export type ExpiredUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'y' | 't';

export class StorageUtil {
  static get(storage: Storage, key: string) {
    const value = StorageUtil.parse(storage.getItem(key) || 'null') || null;
    if (value === null) return null;
    if (
      typeof value === 'object' &&
      typeof value._expired !== 'undefined' &&
      value._expired !== 0 &&
      +new Date() > value._expired
    ) {
      StorageUtil.remove(storage, key);
      return null;
    }

    return value._value || null;
  }

  static set(
    storage: Storage,
    key: string,
    value: any,
    expiredAt: number = 0,
    expiredUnit: ExpiredUnit = 't',
  ) {
    storage.setItem(
      key,
      StorageUtil.stringify({
        _expired: StorageUtil.getExpired(expiredAt, expiredUnit),
        _value: value,
      }),
    );
  }

  static remove(storage: Storage, key: string) {
    storage.removeItem(key);
  }

  static key(storage: Storage, index: number) {
    return storage.key(index);
  }

  private static getExpired(val: number, unit: ExpiredUnit): number {
    if (val <= 0) return 0;
    const now = +new Date();
    switch (unit) {
      case 's': // second
        return now + 1000 * val;
      case 'm': // minute
        return now + 1000 * 60 * val;
      case 'h': // hour
        return now + 1000 * 60 * 60 * val;
      case 'd': // day
        return now + 1000 * 60 * 60 * 24 * val;
      case 'w': // week
        return now + 1000 * 60 * 60 * 24 * 7 * val;
      case 'y': // year
        return now + 1000 * 60 * 60 * 24 * 365 * val;
      case 't': // custom (ms)
        return now + val;
    }
    return 0;
  }

  private static stringify(value: any) {
    return JSON.stringify(value);
  }

  private static parse(text: string) {
    try {
      return JSON.parse(text) || null;
    } catch (e) {
      return text;
    }
  }
}
