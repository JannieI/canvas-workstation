/*
 * Shows form with all tasks, as table or gannt chart
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { CanvasTask }                 from './models';
import { CanvasUser }                 from './models';
import { Dashboard }                  from './models';

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';

@Component({
    selector: 'collaborate-tasks',
    templateUrl: './collaborate.tasks.component.html',
    styleUrls: ['./collaborate.tasks.component.css']
})
export class CollaborateTasksComponent implements OnInit {

    @Output() formCollaborateTasksClosed: EventEmitter<string> = new EventEmitter();
    @ViewChild('widgetDOM') widgetDOM: ElementRef;

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

    canvasTasks: CanvasTask[] = [];
    canvasTasksOrignal: CanvasTask[] = [];
    cloudActive: boolean = true;
    dashboardActive: boolean = true;
    dashboardNames: string[] = [];
    dashboards: Dashboard[] = [];
    errorMessage: string = '';
    selectedDashboard: string = '';
    selectedDetailRow: number = 0;
    selectedRow: number = 0;
    selectedStatus: string = '';
    selectedTaskText: string = '';
    selectedUser: string = '';
    userNames: string[] = [];
    users: CanvasUser[] = [];

    displayGantt: boolean = true;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource('canvasTasks')
            .then (ca => {

                // Set the data for the grid
                this.canvasTasks = ca;
                this.canvasTasksOrignal = ca;

                // Get User list
                this.globalVariableService.getResource('canvasUsers')
                    .then(usr => {
                        this.users = usr;
                        usr.forEach(u => {
                            this.userNames.push(u.userID);
                        });
                        this.userNames = ['', ...this.userNames];

                        // Add 'dead' users from Tasks - in case not in Users any longer
                        let isFound: boolean = false;
                        this.canvasTasks.forEach(tsk => {
                            isFound = false;
                            if (tsk.assignedToUserID != ''  &&  tsk.assignedToUserID != null) {
                                this.userNames.forEach(usn => {
                                    if (usn.toLowerCase() === tsk.assignedToUserID.toLowerCase()) {
                                        isFound = true;
                                    };
                                });
                                if (!isFound) {
                                    this.userNames.push(tsk.assignedToUserID);
                                };
                            };
                        });

                        // Get Dashboard list
                        this.globalVariableService.getResource('dashboards')
                        .then(res => {
                            this.dashboards = res;
                            this.dashboardNames = [];
                            this.dashboards.forEach(d => {
                                this.dashboardNames.push(d.name + ' (' + d.state + ')');
                            });
                            this.dashboardNames = ['', ...this.dashboardNames];

                            this.dashboardNames = this.dashboardNames.sort( (obj1,obj2) => {
                                if (obj1.toLowerCase() > obj2.toLowerCase()) {
                                    return 1;
                                };
                                if (obj1.toLowerCase() < obj2.toLowerCase()) {
                                    return -1;
                                };
                                return 0;
                            });
                        })
                        .catch(err => {
                            console.error('Error in Collaborate.addTask reading dashboards: ' + err)
                            this.errorMessage = err.slice(0, 100);
                        });
                    })
                    .catch(err => {
                        this.errorMessage = err.slice(0, 100);
                        console.error('Error in Collaborate.tasks reading canvasUsers: ' + err);
                    });
    
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Collaborate.tasks reading canvasTasks: ' + err);
            });


        this.clickGantt()
    }

    clickGantt() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGantt', '@Start');

        let definition = this.globalVariableService.vlTemplate;

        definition['data'] = {
            "values": [
                {"task": "A","start": 1, "end": 3},
                {"task": "B","start": 3, "end": 8},
                {"task": "C","start": 8, "end": 10}
            ]
        };
        definition['mark']['type'] ='bar';
        definition['encoding'] = {
            "y": {"field": "task", "type": "ordinal"},
            "x": {"field": "start", "type": "quantitative"},
            "x2": {"field": "end", "type": "quantitative"}
        };

        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        view.renderer('svg')
            .initialize(this.widgetDOM.nativeElement)
            .hover()
            .width(400)
            .height(200)
            .run()
            .finalize();

    }

    clickRow(index: number, id: number){
        // Heighlight the clicked High Level row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRow = index;
    }

    clickDetailRow(index: number, id: number){
        // Heighlight the clicked Detail row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDetailRow', '@Start');

        this.selectedDetailRow = index;
    }

    clickClose(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formCollaborateTasksClosed.emit(action);
    }

    clickFilter() {
        // Filter results
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilter', '@Start');

        // Reset
        this.canvasTasks = this.canvasTasksOrignal;

        // Filter down
        // TODO - maybe this can be done better.  Also, still todo the detail one ...
        //        but only after feedback on how to make it more useful
        if (this.selectedUser != '') {
            this.canvasTasks = this.canvasTasks.filter(
                tsk => tsk.assignedToUserID === this.selectedUser
            );
        };
        if (this.selectedStatus != '') {
            this.canvasTasks = this.canvasTasks.filter(
                tsk => tsk.taskStatus.toLowerCase() === this.selectedStatus.toLowerCase()
            );
        };
        if (this.selectedTaskText != '') {
            this.canvasTasks = this.canvasTasks.filter(
                tsk => tsk.taskText.toLowerCase().includes(this.selectedTaskText.toLowerCase())
            );
        };

        
        let dashboardName: string = '';
        let dashboardState: string = '';
        if (this.selectedDashboard != null  &&  this.selectedDashboard != '') {
            let index: number = this.selectedDashboard.indexOf(' (');
            if (index >= 0) {
                dashboardName = this.selectedDashboard.substring(0, index);
                dashboardState = this.selectedDashboard.substring(
                    index + 2, this.selectedDashboard.length - 1
                );
            };
        };

        let today = new Date();
        let dashboardID: number = null;
        if (dashboardName != '') {
            let dashboardIndex: number = this.dashboards.findIndex(
                d => d.name === dashboardName
                     &&
                     d.state === dashboardState
            );
            if (dashboardIndex >= 0) {
                dashboardID = this.dashboards[dashboardIndex].id;
                this.canvasTasks = this.canvasTasks.filter(
                    tsk => tsk.linkedDashboardID === dashboardID
                );
            };
        };

    }
}
