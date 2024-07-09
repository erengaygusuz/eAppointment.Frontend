import { Component } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './app.footer.component.html'
})
export class AppFooterComponent {
  constructor(
    public layoutService: LayoutService,
    private translate: TranslateService
  ) {}
}
