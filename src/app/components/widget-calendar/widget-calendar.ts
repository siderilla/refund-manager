import { Component } from '@angular/core';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexPlotOptions, ApexDataLabels } from 'ng-apexcharts';

export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	dataLabels: ApexDataLabels;
	fill: any;
	colors: any;
	title: any;
	xaxis: ApexXAxis;
	plotOptions: ApexPlotOptions;
};

@Component({
	selector: 'app-widget-calendar',
	imports: [
		NgApexchartsModule,
	],
	templateUrl: './widget-calendar.html',
	styleUrl: './widget-calendar.scss',
})
export class WidgetCalendar {

	public chartOptions: Partial<ChartOptions>;

	constructor() {
		this.chartOptions = {
			series: [
				// Ogni "name" è una riga (Settimana)
				{ name: "Sett 4", data: this.generateData(7, { min: 0, max: 90 }) },
				{ name: "Sett 3", data: this.generateData(7, { min: 0, max: 90 }) },
				{ name: "Sett 2", data: this.generateData(7, { min: 0, max: 90 }) },
				{ name: "Sett 1", data: this.generateData(7, { min: 0, max: 90 }) }
			],
			chart: {
				height: 350,
				type: "heatmap",
				toolbar: { show: false },
				events: {
					// Fondamentale: qui catturiamo il click sul giorno!
					dataPointSelection: (event, chartContext, config) => {
						const val = config.w.config.series[config.seriesIndex].data[config.dataPointIndex];
						console.log("Giorno selezionato:", val.x, "Valore spesa:", val.y);
					}
				}
			},
			dataLabels: { enabled: true }, // Nascondiamo i numeri dentro i quadratini
			colors: ["#008FFB"], // Colore base (il "calore" lo gestiamo dopo)
			xaxis: {
				type: "category",
				categories: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]
			},
			plotOptions: {
				heatmap: {
					shadeIntensity: 0.5,
					radius: 0, // 0 per quadrati, >0 per arrotondati (più moderni)
					useFillColorAsStroke: true,
					colorScale: {
						ranges: [
							{ from: 0, to: 0, name: 'Nessuna spesa', color: '#F3F4F6' },
							{ from: 1, to: 30, name: 'Basso', color: '#DBEAFE' },
							{ from: 31, to: 60, name: 'Medio', color: '#60A5FA' },
							{ from: 61, to: 100, name: 'Alto', color: '#1D4ED8' }
						]
					}
				}
			}
		};
	}

	// Funzione temporanea per generare numeri casuali
	public generateData(count: number, yrange: any) {
		let i = 0;
		let series = [];
		const days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
		while (i < count) {
			series.push({
				x: days[i],
				y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
			});
			i++;
		}
		return series;
	}

}
