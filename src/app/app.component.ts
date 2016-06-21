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

    constructor(private countriesService: CountriesService) {
        this.countriesService.getCountries()
            .then(questions => this.countries = questions);
    }


    setContentActive(value: boolean) {
        this.contentActive = value;
    }

    fetchData() {
        this.setContentActive(true);
    }

    get isContentActive() {
        return this.contentActive !== undefined;
    }

}
