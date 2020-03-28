import { Injectable } from '@angular/core';
import { StorageUtil, ExpiredUnit } from './util';

export class StorageService {
  constructor(private storage: Storage) {}

  get(key: string) {
    return StorageUtil.get(this.storage, key);
  }

  set(
    key: string,
    value: any,
    expiredAt: number = 0,
    expiredUnit: ExpiredUnit = 'd',
  ) {
    return StorageUtil.set(this.storage, key, value, expiredAt, expiredUnit);
  }

  /**
   * delete the specified key such as:
   * - remove('key')
   * - remove(/BMap_\w+/)
   * @param key Key name or regular expression
   */
  remove(key: string | RegExp) {
    if (typeof key === 'string') {
      StorageUtil.remove(this.storage, key);
      return;
    }
    let index = 0;
    let next = StorageUtil.key(this.storage, index);
    const ls: string[] = [];
    while (next) {
      if (key.test(next)) ls.push(next);
      next = StorageUtil.key(this.storage, ++index);
    }
    ls.forEach(v => StorageUtil.remove(this.storage, v));
  }

  clear() {
    this.storage.clear();
  }
}

@Injectable({ providedIn: 'root' })
export class LocalStorageService extends StorageService {
  constructor() {
    super(localStorage);
  }
}

@Injectable({ providedIn: 'root' })
export class SessionStorageService extends StorageService {
  constructor() {
    super(sessionStorage);
  }
}
