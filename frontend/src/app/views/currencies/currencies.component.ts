import { AfterViewInit, Component } from '@angular/core';
import { CurrenciesService } from 'src/app/graphql/currencies.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss'],
})
export class CurrenciesComponent implements AfterViewInit {
  correncies$ = this.currenciesService.currenciesWithValueRelatedMain$;

  displayedColumns: string[] = ['title', 'internationalSimbol', 'internationalShortName', 'valueRelatedMain'];
  chart: any | null = null;

  dataSource$ = this.correncies$

  

  constructor(private currenciesService: CurrenciesService) {
    currenciesService.load();
  }

  ngAfterViewInit() {
    this.correncies$.subscribe((currencies) => {
      const ctx = (
        document.getElementById('currencies-chart') as HTMLCanvasElement
      ).getContext('2d');
      if (!ctx) {
        return;
      }

      const datapoints = [
        ...currencies.map((balance) => [balance.valueRelatedMain]),
      ];

      const labels = currencies.map((balance) => balance.title);

      this.chart?.destroy();
      // this.chart = new Chart(ctx, {
      //   type: 'doughnut',
      //   data: {
      //     labels: labels,
      //     datasets:  {
      //       label: 'Cubic interpolation (monotone)',
      //       data: datapoints,
      //       fill: false,
      //       cubicInterpolationMode: 'monotone',
      //       tension: 0.4
      //     },
      //   },
      //   options: {
      //     responsive: true,
      //   },
      // });
    });
  }
}
