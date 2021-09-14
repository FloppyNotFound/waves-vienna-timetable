import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isFavorite'
})
export class IsFavoritePipe implements PipeTransform {
  transform(id: number, favoriteIds: number[]): boolean {
    if (!favoriteIds?.length) {
      return false;
    }

    return favoriteIds.includes(id);
  }
}
