import {Component} from "@angular/core";

@Component({
    selector: 'app',
    templateUrl: "./app/app.html",
})
export class AppComponent {

    contentActive: boolean = false;

    setContentActive(value: boolean) {
        this.contentActive = value;
    }

    get isContentActive() {
        return this.contentActive !=== undefined;
    }

}
