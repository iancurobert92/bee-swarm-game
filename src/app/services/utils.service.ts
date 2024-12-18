import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  groupItemsBy<T>(items: T[], propName: keyof T): Record<string, T[]> {
    return items.reduce((acc: Record<string, T[]>, item) => {
      const key = item[propName] as unknown as string;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }

  getRandomItem<T>(items: T[]) {
    return items[Math.floor(Math.random() * items.length)];
  }
}
