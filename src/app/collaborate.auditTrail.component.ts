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
import { CanvasActivity }             from './models';
import { CanvasTask }                 from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';

@Component({
    selector: 'collaborate-audittrail',
    templateUrl: './collaborate.auditTrail.component.html',
    styleUrls: ['./collaborate.auditTrail.component.css']
})
export class CollaborateAuditTrailComponent implements OnInit {

    @Output() formCollaborateAuditTrailClosed: EventEmitter<string> = new EventEmitter();
    @ViewChild('widgetDOM') widgetDOM: ElementRef;

    canvasTasks: CanvasTask[] = [];
    datagridColumns: DatagridColumn[];
    datagridInput: DatagridInput = null;
    datagridData: any;
    datagridPagination: boolean = false;
    datagridPaginationSize: number = 10;
    datagridShowHeader: boolean = false;
    datagridShowRowActionMenu: boolean = false;
    datagridShowData: boolean = true;
    datagridShowFooter: boolean = false;
    datagridRowHeight: number = 12;
    datagriduserCanChangeProperties: boolean = false;
    datagridShowTotalsRow: boolean = false;
    datagridShowTotalsCol: boolean = false;
    datagridCanEditInCell: boolean = false;
    datagridCanExportData: boolean = false;
    datagridEmptyMessage: string = 'No Activities created so far';
    datagridVisibleFields: string[];
    datagridShowFields: string[];


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getCanvasAuditTrails().then (ca => {

            // Set the data for the grid
            this.datagridData = ca;

            // Set the column object
            this.datagridColumns = this.globalVariableService.createDatagridColumns(
                ca[0], this.datagridShowFields, this.datagridVisibleFields);

        });

    }

    clickClose(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formCollaborateAuditTrailClosed.emit(action);
    }
}
