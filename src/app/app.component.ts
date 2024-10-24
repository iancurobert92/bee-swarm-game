import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HiveComponent } from './components/hive/hive.component';
import { BeeType } from './enums/bee-type';
import { Bee } from './models/bee.model';
import { BeesService } from './services/bees.service';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HiveComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  localStorageService = inject(LocalStorageService);
  beesService = inject(BeesService);
  bees = signal<Bee[]>([]);
  targetBee?: Bee;
  playerName: string = 'Player 1';

  ngOnInit(): void {
    this.bees.set(this.localStorageService.getBees());
    this.targetBee = this.localStorageService.getTargetBee();
    this.getBees();
  }

  onHitButtonClick() {
    const randomIndex = Math.floor(Math.random() * this.bees().length);
    this.targetBee = this.bees()[randomIndex];
    this.hitBee(this.targetBee);
    this.bees.set([...this.bees()]);
    this.localStorageService.setTargetBee(this.targetBee);
    this.localStorageService.setBees(this.bees());
  }

  onRestartButtonClick() {
    this.getBees();
    this.targetBee = undefined;
  }

  private hitBee(bee: Bee): void {
    bee.health -= bee.damage;
    if (bee.health <= 0) {
      const index = this.bees().findIndex((item) => item === bee);
      this.bees().splice(index, 1);
    }

    const queenBee = this.bees().find((bee) => bee.type === BeeType.Queen);
    if (!queenBee) {
      this.killAllBees();
    }
  }

  private getBees() {
    if (this.bees().length) return;

    this.beesService.getBees().subscribe(this.bees.set);
  }

  private killAllBees() {
    this.bees.set([]);
    this.targetBee = undefined;
  }
}
