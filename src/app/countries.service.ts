import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CountriesService {

    private apiUrl: string = 'http://api.geonames.org/countryInfoJSON?formatted=true&username=hydrane';

    constructor(private http: Http) { }

    getCountries(): Promise {
        return this.http.get(this.apiUrl).toPromise()
            .then(response => response.json());
    }


}
