import { IItem } from './../models/item.interface';
import { Injectable } from '@angular/core';
import { merge } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private size = 4;
  private availableCells: number[] = [];

  public theEnd = false;
  score = 0;

  private items: IItem[] = [];

  constructor() {
    this.generateAvalilableCells();
    this.generateItems();
  }

  private get emptyCells(): number[] {
    const notEmptyCells = this.notEmptyCells;
    return this.availableCells.filter((pos) => !notEmptyCells.includes(pos));
  }

  private get notEmptyCells(): number[] {
    return this.items.map((item) => item.row * 10 + item.col);
  }

  getItems(): IItem[] {
    return this.items;
  }

  right() {
    this.moveItems('row', 'col', true);
  }

  left() {
    this.moveItems('row', 'col', false);
  }

  up() {
    this.moveItems('col', 'row', false);
  }

  down() {
    this.moveItems('col', 'row', true);
  }

  private moveItems(
    dimX: 'col' | 'row' = 'row',
    dimY: 'col' | 'row' = 'col',
    reverse = false
  ) {
    if (this.theEnd || !this.canMove(dimX, false, reverse)) {
      return;
    }
    this.clearDeletedItems();

    const mergedItems: IItem[] = [];

    for (let x = 1; x <= this.size; x++) {
      const rowItems = this.items
        .filter((item) => item[dimX] === x)
        .sort((a, b) => a[dimY] - b[dimY]);

      if (reverse) {
        rowItems.reverse();
      }

      console.log(rowItems);
      let y = reverse ? this.size : 1;
      let merged = false;
      let prevItem: IItem = null;

      for (let i = 0; i < rowItems.length; i++) {
        let item: IItem = rowItems[i];

        if (prevItem) {
          if (merged) {
            merged = false;
          } else if (item.value === prevItem.value) {
            reverse ? y++ : y--;
            prevItem.isOnDelete = true;
            item.isOnDelete = true;
            mergedItems.push({
              value: item.value * 2,
              [dimY]: y,
              [dimX]: x,
            } as any);

            merged = true;
          }
        }

        item[dimY] = y;
        reverse ? y-- : y++;
        prevItem = item;
      }
    }

    this.score += mergedItems.reduce((acc, item) => acc + item.value, 0);

    this.items = [...this.items, ...mergedItems];

    this.generateItems();

    this.theEnd = this.isEndGame();
  }

  private clearDeletedItems() {
    this.items = this.items.filter((item) => !item.isOnDelete);
  }

  private generateItems(length: number = 2) {
    const positions: number[] = this.emptyCells
      .sort(() => Math.random() - 0.5)
      .slice(0, length);

    this.items = [
      ...this.items,
      ...positions.map<IItem>((pos) => ({
        value: 2,
        col: pos % 10,
        row: (pos - (pos % 10)) / 10,
      })),
    ];
  }

  private isEndGame() {
    return !this.canMove('row') || !this.canMove('col');
  }

  private canMove(dimX: 'row' | 'col', skipDir = true, forward = false) {
    let dimY = dimX === 'row' ? 'col' : 'row';
    for (let x = 1; x <= this.size; x++) {
      let items = this.items
        .filter((item) => !item.isOnDelete && item[dimX] === x)
        .sort((a, b) => a[dimY] - b[dimY]);

      if (items.length !== this.size) {
        if (skipDir) {
          return true;
        }

        const length = items.length;
        const positions: number[] = [];

        if (forward) {
          let start = forward ? 1 : this.size + 1 - length;
          let end = forward ? length : this.size;
          for (let i = start; i <= end; i++) {
            positions.push(i);
          }

          if (items.find((item) => !positions.includes(item[dimY]))) {
            return true;
          }
        }
      }

      let prevValue = 0;

      for (let i = 0; i < items.length; i++) {
        if (items[i].value === prevValue) {
          return true;
        }
        prevValue = items[i].value;
      }
    }

    return false;
  }

  resetGame() {
    this.score = 0;
    this.items = [];
    this.theEnd = false;
    this.generateItems();
  }

  private generateAvalilableCells() {
    for (let row = 1; row <= this.size; row++) {
      for (let col = 1; col <= this.size; col++) {
        this.availableCells.push(row * 10 + col);
      }
    }
  }
}
