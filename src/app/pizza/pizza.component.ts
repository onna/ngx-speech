import { Component, Input } from '@angular/core';

@Component({
selector: 'app-pizza',
templateUrl: './pizza.component.html',
styleUrls: ['./pizza.component.css']
})
export class PizzaComponent {

    @Input() pizza?: string;
    ordered = false;

    order() {
        console.log('ORDER', this);
        this.ordered = true;
    }

}
