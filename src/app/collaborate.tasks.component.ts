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
import { CanvasActivity }             from './models';
import { CanvasTask }                 from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';

@Component({
    selector: 'collaborate-tasks',
    templateUrl: './collaborate.tasks.component.html',
    styleUrls: ['./collaborate.tasks.component.css']
})
export class CollaborateTasksComponent implements OnInit {

    @Output() formCollaborateTasksClosed: EventEmitter<string> = new EventEmitter();

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

        this.canvasTasks.push(
            {
                id: 1,
                taskText: 'Perform QA of Dashboard XYZ',
                activityType: 'QA Dashboard',
                taskStatus: 'Pending',
                assignedToUserID: 'QuentinI',
                precedingTaskID: null,
                linkedDashboardID: 1,
                taskComments: [],
                startDate: '2017/01/01',
                deadlineDate: '2017/01/01',
                endDate: '',
                durationDays: 1,
                editedBy: 'ChristianN',
                editedOn: '2017/01/01',
                createdBy: 'ChristianN',
                createdOn: '2017/01/01'
            }
        );
        this.canvasTasks.push(
            {
                id: 1,
                taskText: 'Add outstanding figures',
                activityType: 'Ad hoc',
                taskStatus: 'Pending',
                assignedToUserID: 'QuentinI',
                precedingTaskID: null,
                linkedDashboardID: 2,
                taskComments: [],
                startDate: '2017/01/01',
                deadlineDate: '2017/01/01',
                endDate: '',
                durationDays: 1,
                editedBy: 'ChristianN',
                editedOn: '2017/01/01',
                createdBy: 'ChristianN',
                createdOn: '2017/01/01'
            }
        );
        this.canvasTasks.push(
            {
                id: 1,
                taskText: 'Visualise marketing campaign',
                activityType: 'QA Dashboard',
                taskStatus: 'Pending',
                assignedToUserID: 'QuentinI',
                precedingTaskID: null,
                linkedDashboardID: null,
                taskComments: [],
                startDate: '2017/01/01',
                deadlineDate: '2017/01/01',
                endDate: '',
                durationDays: 1,
                editedBy: 'ChristianN',
                editedOn: '2017/01/01',
                createdBy: 'ChristianN',
                createdOn: '2017/01/01'
            }
        );

        this.globalVariableService.getCanvasActivities().then (ca => {

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

		this.formCollaborateTasksClosed.emit(action);
    }
}
