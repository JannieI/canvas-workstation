/*
 * Visualise page, to view / present Dashboards previously created
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
import { Dashboard }                  from './models';

@Component({
    selector: 'dashboard-save-as',
    templateUrl: './dashboard.saveas.component.html',
    styleUrls: ['./dashboard.saveas.component.css']
})
export class DashboardSaveAsComponent implements OnInit {

    @Output() formDashboardSaveAsClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickSaveAs();
            return;
        };

    }

    newName: string = '';

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

    clickClose(action: string) {
        // Close form, nothing saved or copied
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardSaveAsClosed.emit(action);
    }

    clickSaveAs() {
        // Save As to an new D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickclickSaveAsSave', '@Start');

        // Copy D
        this.globalVariableService.copyDashboard(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            this.newName
        );

        this.formDashboardSaveAsClosed.emit('Saved');
    }
}
