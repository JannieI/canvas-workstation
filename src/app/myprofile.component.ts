/*
 * Shows a profile of the current user, ie roles.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { CanvasUser }                 from './models';
import { Dashboard }                  from './models';
import { DashboardPermission }        from './models';

@Component({
    selector: 'myprofile',
    templateUrl: './myprofile.component.html',
    styleUrls: ['./myprofile.component.css']
})
export class MyProfileComponent implements OnInit {

    @Output() formDashboardMyProfileClosed: EventEmitter<string> = new EventEmitter();
    @Input() selectedDashboard: Dashboard;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    accessType: string = '';
    currentData: any[] = [];
    currentUser: CanvasUser;
    dashboardPermissions: DashboardPermission[];
    dataFieldNames: number[] = [];
    errorMessage: string = '';
    favDashboards: Dashboard[] = [];
    showFavs: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.currentUser = this.globalVariableService.currentUser;
        this.accessType = this.selectedDashboard.accessType;

        this.globalVariableService.getResource('dashboardPermissions')
            .then(res => {
                this.dashboardPermissions = res
                    .filter(dp => dp.dashboardID === 
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID)
                    .slice();
            })
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 45)  :  err.message.slice(0, 45);
                console.error('Error in myProfile reading dashboardPermissions: ' + err);
            });


        // KEEP - getting my Fav Ds, and put into fancy table.  Could be useful somewhere
        // this.favDashboards = this.globalVariableService.dashboards.filter(d =>
        //     this.globalVariableService.currentUser.favouriteDashboards.indexOf(d.id) >= 0
        // );
        // if (this.favDashboards.length > 0) {

        //     // Show Table
        //     this.showFavs = true;

        //     // Get nr cols, with set rows
        //     let nrRows: number = 2;
        //     let nrCols: number = Math.floor(this.favDashboards.length / nrRows);
        //     if ((this.favDashboards.length % nrRows) != 0) {
        //         nrCols = nrCols + 1;
        //     };

        //     // Create the col headers
        //     for (var i = 0; i < nrCols; i++) {
        //         this.dataFieldNames.push((i));
        //     };

        //     // Create the data
        //     let c: number = 0;
        //     let row0: any[] = [];
        //     let row1: any[] = [];

        //     this.favDashboards.forEach( d => {

        //         if (c === 0) {
        //             row0.push(d.name);
        //         } else {
        //             row1.push(d.name);
        //         };

        //         // Increment, mod 2
        //         c = c + 1;
        //         if (c === 2) {
        //             c = 0
        //         };

        //     })
        //     if (row0.length > 0) {
        //         this.currentData.push(row0);
        //     };
        //     if (row1.length > 0) {
        //         this.currentData.push(row1);
        //     };
        //     // this.currentData.push( row0, row1)
        // };
    }

    clickProfilePic() {
        // Upload a profile pic
        this.globalFunctionService.printToConsole(this.constructor.name,'clickProfilePic', '@Start');

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

}
