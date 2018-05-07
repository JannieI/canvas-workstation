




            /*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { CanvasAuditTrail }           from './models';

@Component({
    selector: 'dashboard-usagestats',
    templateUrl: './dashboard.usagestats.component.html',
    styleUrls: ['./dashboard.usagestats.component.css']
})
export class DashboardUsagestatsComponent implements OnInit {

    @Output() formDataDictionaryClosed: EventEmitter<string> = new EventEmitter();
    @ViewChild('widgetDOM') widgetDOM: ElementRef;

    finalFields: any = [];
    selectedRow: number = 0;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // TODO - fix!!
        this.finalFields = this.globalVariableService.finalFields.slice();

    }

    clickRow(index: number, id: number) {
        // User clicked a row, now refresh the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRow = index;
    }

    clickClose(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDataDictionaryClosed.emit(action);
    }
}
