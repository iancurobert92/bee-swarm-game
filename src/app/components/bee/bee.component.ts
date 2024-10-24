import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-bee',
  standalone: true,
  imports: [],
  templateUrl: './bee.component.html',
  styleUrl: './bee.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeeComponent {
  @Input({ required: true }) type!: string;
  @Input({ required: true }) health!: number;

  get imageUrl(): string {
    return `${this.type?.toLowerCase()}.svg`;
  }
}
