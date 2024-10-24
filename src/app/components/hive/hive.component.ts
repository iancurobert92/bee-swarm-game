import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Bee } from '../../models/bee.model';
import { Utils } from '../../services/utils.service';
import { BeeComponent } from '../bee/bee.component';

@Component({
  selector: 'app-hive',
  standalone: true,
  imports: [BeeComponent, NgFor],
  templateUrl: './hive.component.html',
  styleUrl: './hive.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HiveComponent {
  @Input() bees: Bee[] = [];

  private utils = inject(Utils);

  get beeGroups() {
    const groups = this.utils.groupItemsBy(this.bees, 'type');
    return Object.values(groups);
  }
}
