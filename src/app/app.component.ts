import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { GameBoardService } from './services/game-board.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameBoardComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  playerName: string = '';
  isLoggedIn: boolean = false;

  private gameBoardService = inject(GameBoardService);

  ngOnInit(): void {
    this.playerName = this.gameBoardService.playerNameSignal();
    this.isLoggedIn = !!this.playerName;
  }

  onSubmit() {
    if (!this.playerName) return;
    this.gameBoardService.setPlayerName(this.playerName);
    this.isLoggedIn = true;
  }
}
