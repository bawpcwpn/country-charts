import {Component, EventEmitter, Input, Output} from "@angular/core";
import { HTTP_PROVIDERS } from '@angular/http';
import { Country } from './country';
import { CountriesService } from './countries.service';
import {InfiniteScroll} from './directives/infinitescroll';

@Component({
    selector: 'app',
    providers: [HTTP_PROVIDERS, CountriesService],
    directives: [InfiniteScroll],
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


    moreTableResults() {
        console.log('more results!');
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


    checkWhichColActive() {
        switch(this.metricSelect) {
            case 'all':
                this.areaColVisible = true;
                this.populationColVisible = true;
                break;
            case 'areaInSqKm':
                this.areaColVisible = true;
                this.populationColVisible = false;
                break;
            case 'population':
                this.populationColVisible = true;
                this.areaColVisible = false;
                break;
        }
    }


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


    sortTable(field: string) {
        
    }

}
