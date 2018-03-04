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
import { CanvasComment }              from './models';

@Component({
    selector: 'dashboard-dataQuality',
    templateUrl: './dashboard.dataQuality.component.html',
    styleUrls: ['./dashboard.dataQuality.component.css']
})
export class DashboardDataQualityComponent implements OnInit {

    @Output() formDashboardDataQualityClosed: EventEmitter<string> = new EventEmitter();
    @Input() selectedWidgetID: number;

    canvasComments: CanvasComment[] = [];
    dashboards: Dashboard[];
    headerText: string;
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        if (this.selectedWidgetID == -1) {
            this.headerText = 'this Dashboard';
        } else {
            this.headerText = 'selected Widget';
        };

        this.globalVariableService.getCanvasComments().then(cC => {
             cC.forEach(i => {
                 if (i.widgetID == this.selectedWidgetID  ||  this.selectedWidgetID == -1) {
                     this.canvasComments.push(i)
                 };
            });
            console.log('xx comm', cC, this.canvasComments)
        });
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardDataQualityClosed.emit(action);
    }
}
