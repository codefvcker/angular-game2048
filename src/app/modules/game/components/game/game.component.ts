import { GameService } from './../../services/game.service';
import { IItem } from './../../models/item.interface';
import { Component, OnInit, HostListener } from '@angular/core';

const colorMap: { [k: number]: string } = {
  2: '#626567',
  4: '#424949',
  8: '#7e5109',
  16: '#196f3d',
  32: '#138d75',
  64: '#154360',
  128: '#9b59b6',
  256: '#78281f',
  512: '#c0392b',
  1024: '#7d6608',
  2048: '#45b39d',
};

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  items: IItem[] = [];

  keyEventCodeMap: { [type: string]: string } = {
    arrowright: 'right',
    arrowleft: 'left',
    arrowup: 'up',
    arrowdown: 'down',
  };

  constructor(public gameService: GameService) {}

  ngOnInit(): void {}

  getStyles(item: IItem): { [p: string]: string } {
    const top = item.row * 110 - 100 + 'px';
    const left = item.col * 110 - 100 + 'px';
    return {
      top: top,
      left: left,
      'background-color': colorMap[item.value] || 'black',
    };
  }

  newGame() {
    this.gameService.resetGame();
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    console.log(e);

    this.items = this.gameService.getItems();

    if (this.keyEventCodeMap[e.code.toLowerCase()]) {
      this.gameService[this.keyEventCodeMap[e.code.toLowerCase()]]();
    }
  }
}
