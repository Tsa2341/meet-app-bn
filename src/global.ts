import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalClass {
  [x: string]: any;

  set(key: string, value: any) {
    this[key] = value;
  }
}
