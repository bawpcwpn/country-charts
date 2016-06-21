import {Component, EventEmitter, Input, Output} from "@angular/core";
import { HTTP_PROVIDERS } from '@angular/http';
import { Country } from './country';
import { CountriesService } from './countries.service';
import {InfiniteScroll} from './directives/infinitescroll';
import { CHART_DIRECTIVES } from 'angular2-highcharts';

@Component({
    selector: 'app',
    providers: [HTTP_PROVIDERS, CountriesService],
    directives: [InfiniteScroll, CHART_DIRECTIVES],
    templateUrl: "./app/app.html",
})
export class AppComponent {

    contentActive: boolean = false;
    countries: Country[];
    filteredCountries: Country[];
    continents: Array = [];

    totalPopulation = 0;
    areaInSqKmTotal = 0;

    areaColVisible = true;
    populationColVisible = true;

    chartVisible = false;
    chartOptions = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                }
            }
        },
        series: [{
            colorByPoint: true,
            data: []
        }],
    };

    constructor(private countriesService: CountriesService) {}


    private sortContinents() {
        // Get list of continents
        for (let value of this.countries) {
            if(value.hasOwnProperty('continentName')) {
                let continentName = value['continentName'];
                if(this.continents.indexOf(continentName) === -1) {
                    this.continents.push(continentName);
                }
            }
        }

        // Sort continents alphabetically
        this.continents.sort();
    }

    fetchData() {

        // Get the countries from the API
        this.countriesService.getCountries()
            .then(countries => {
                if(countries.hasOwnProperty('geonames')) {
                    this.countries = countries['geonames'];
                }
                this.sortContinents();
                this.contentActive = true;
                this.filterResults();
            });
    }

    get isContentActive() {
        return this.contentActive !== undefined;
    }

    get getPopulationTotal() {
        return this.totalPopulation;
    }
    
    get getAreaInSqKmTotal() {
        return this.areaInSqKmTotal;
    }

    /***
     *  Select Components
     */

    continentSelect: string = 'all';
    metricSelect: string = 'all';
    resultsSelect: number = 5;

    @Input() continentSelect;
    @Output() continentSelectChange = new EventEmitter<string>();

    onContinentSelectChange(selected: string) {
        this.continentSelect = selected;
        this.continentSelectChange.emit(selected);

        this.filterResults();
    }

    @Input() metricSelect;
    @Output() metricSelectSelectChange = new EventEmitter<string>();

    onMetricSelectChange(selected: string) {
        this.metricSelect = selected;
        this.metricSelectSelectChange.emit(selected);

        this.checkWhichColActive();
        this.filterResults();
    }

    @Input() resultsSelect;
    @Output() resultsSelectChange = new EventEmitter<string>();

    onResultsSelectChange(selected: string) {
        this.resultsSelect = selected;
        this.resultsSelectChange.emit(selected);

        this.filterResults();
    }


    /**
     * Check which column is active
     */
    checkWhichColActive() {
        switch(this.metricSelect) {
            case 'all':
                this.areaColVisible = true;
                this.populationColVisible = true;
                this.hideChart();
                break;
            case 'areaInSqKm':
                this.areaColVisible = true;
                this.populationColVisible = false;
                this.updateChart();
                break;
            case 'population':
                this.populationColVisible = true;
                this.areaColVisible = false;
                this.updateChart();
                break;
        }
    }


    /**
     *  Filter Results
     */
    filterResults() {

        if(this.continentSelect != 'all') {
            this.filteredCountries = [];

            if(this.continentSelect !== 'all') {
                for (let value of this.countries) {
                    if(value.hasOwnProperty('continentName')) {
                        let continentName = value['continentName'];
                        if(continentName == this.continentSelect) {
                            this.filteredCountries.push(value);
                        }
                    }
                }
            }
        } else {
            this.filteredCountries = this.countries;
        }

        // Set total population and area figures
        let totalPopulation = 0;
        let totalArea = 0;

        for (let value of this.filteredCountries) {
            totalPopulation += parseInt(value.population);
            totalArea += parseFloat(value.areaInSqKm);
        }

        this.totalPopulation = totalPopulation.toFixed(0);
        this.areaInSqKmTotal = totalArea.toFixed(2);

    }


    /**
     * Update Table
     * @param field
     */
    sortTable(field: string) {

    }


    /**
     * hide Chart
     */
    hideChart() {
        this.chartVisible = false;
    }

    /**
     * Show Chart
     */
    
    showChart() {
        this.chartVisible = true;
    }

    /**
     *  Update CHart
     */
    updateChart() {

        let chartArray = [];
        let metricName = this.metricSelect;
        let chartData = this.chartOptions.series['data'];

        for (let value of this.filteredCountries) {
            if(value.hasOwnProperty(metricName)) {
                chartArray.push(value);
            }
        }

        chartArray.sort(function(a,b){
            return a[metricName] - b[metricName];
        });

        let totalMetric = 0;
        for (let i = 1; i <= this.resultsSelect; i++) {
            let chartItem = chartArray[i];
            totalMetric += metricName = 'population' ? parseInt(chartItem[metricName]) : parseFloat(parseFloat(metricName).toFixed(2));
        }
        for (let i = 1; i <= this.resultsSelect; i++) {
            let chartItem = chartArray[i];
            let percentage = (chartItem[metricName] / totalMetric) * 100;
           chartData.push({
                name: chartItem.countryName,
                y: percentage
            });
        }

        this.showChart();
        console.log(this.chartOptions);


}
