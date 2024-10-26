import { ChangeDetectionStrategy, Component, DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Bee } from '../../models/bee.model';
import { GameBoardService } from '../../services/game-board.service';
import { HiveComponent } from '../hive/hive.component';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [HiveComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent {
  beesSignal: Signal<Bee[]>;
  targetBeeSignal: Signal<Bee | undefined>;
  playerNameSignal: Signal<string | undefined>;

  private gameBoardService = inject(GameBoardService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.beesSignal = this.gameBoardService.beesSignal;
    this.targetBeeSignal = this.gameBoardService.targetBeeSignal;
    this.playerNameSignal = this.gameBoardService.playerNameSignal;
  }

  ngOnInit(): void {
    this.getBees();
  }

  onHitButtonClick() {
    this.gameBoardService.hitRandomBee();
  }

  onRestartButtonClick() {
    this.gameBoardService.resetBoard().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private getBees() {
    this.gameBoardService.getData().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
