import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import React from 'react';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
