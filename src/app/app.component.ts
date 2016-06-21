import {Component} from "@angular/core";
import { HTTP_PROVIDERS } from '@angular/http';
import { Country } from './country';
import { CountriesService } from './countries.service';

@Component({
    selector: 'app',
    providers: [HTTP_PROVIDERS, CountriesService],
    templateUrl: "./app/app.html",
})
export class AppComponent {

    contentActive: boolean = false;
    countries: Country[];
    sortedCountries: Country[];
    continents: Array = [];
    totalPopulation = 0;

    constructor(private countriesService: CountriesService) {}


    private sortContinents() {
        console.log('sort continents!');

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
                console.log('finished!');
                if(countries.hasOwnProperty('geonames')) {
                    this.countries = countries['geonames'];
                    this.sortedCountries = this.countries;
                }
                this.sortContinents();
                this.contentActive = true;
            });
    }

    get isContentActive() {
        return this.contentActive !== undefined;
    }

    get getTotalPopulation() {
        return this.totalPopulation;
    }

}
