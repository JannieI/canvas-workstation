/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';

@Component({
    selector: 'myprofile',
    templateUrl: './myprofile.component.html',
    styleUrls: ['./myprofile.component.css']
})
export class MyProfileComponent implements OnInit {

    @Output() formDashboardMyProfileClosed: EventEmitter<string> = new EventEmitter();

    currentData: any[] = [];
    dataFieldNames: number[] = [];
    favDashboards: Dashboard[] = [];
    showFavs: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.favDashboards = this.globalVariableService.dashboards.filter(d => 
            this.globalVariableService.currentUser.favouriteDashboards.indexOf(d.id) != 0
        );
console.log('xx this.favDashboards', this.favDashboards, this.globalVariableService.currentUser.favouriteDashboards)

        if (this.favDashboards.length > 0) {

            // Show Table
            this.showFavs = true;

            // Get nr cols, with set rows
            let nrRows: number = 2;
            let nrCols: number = Math.floor(this.favDashboards.length / nrRows);
            if ((this.favDashboards.length % nrRows) != 0) {
                nrCols = nrCols + 1;
            };

            // Create the col headers
            for (var i = 0; i < nrCols; i++) {
                this.dataFieldNames.push((i));
            };
            console.log('xx dataFieldNames', this.dataFieldNames)

            // Create the data
            let c: number = 0;
            let row0: any[] = [];
            let row1: any[] = [];

            this.favDashboards.forEach( d => {

                if (c == 0) {
                    row0.push(d.name);
                } else {
                    row1.push(d.name);
                };

                // Increment, mod 2
                c = c + 1;
                if (c == 2) {
                    c = 0
                };

            })
            console.log('xx rows', this.currentData.length, row0, row1)
            if (row0.length > 0) {
                this.currentData.push(row0);
            };
            if (row1.length > 0) {
                this.currentData.push(row1);
            };
            // this.currentData.push( row0, row1)
            console.log('xx cData', this.currentData.length, this.currentData)
        };
    }

    clickDelete(ev, row, col) {
        // Close form, no changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        console.log('xx', ev, row, 'c', col)
}

    clickClose(action: string) {
        // Close form, no changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.globalVariableService.showStatusBarMessage(
            {
                message: 'No changes',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );
		this.formDashboardMyProfileClosed.emit(action);
    }

    clickSave(action: string) {
        // Save data and close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.globalVariableService.showStatusBarMessage(
            {
                message: 'Fix save later ...',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );
		this.formDashboardMyProfileClosed.emit(action);
    }

}
