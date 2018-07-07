/*
 * Open an existing Dashboard
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
import { CanvasAuditTrail, Datasource }           from './models';
import { CanvasGroup }                from './models';
import { Dashboard }                  from './models';
import { DashboardPermission }        from './models';
import { DashboardScheduleLog }       from './models';
import { DashboardSchedule }          from './models';
import { Scheduler } from 'rxjs/Scheduler';

@Component({
    selector: 'dashboard-open',
    templateUrl: './dashboard.open.component.html',
    styleUrls: ['./dashboard.open.component.css']
})
export class DashboardOpenComponent implements OnInit {

    @Input() test: boolean;
    @Output() formDashboardOpenClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    canvasAuditTrails: CanvasAuditTrail[] = [];
    dashboardsOriginal: Dashboard[];
    dashboardPermission: DashboardPermission[];
    dashboards: Dashboard[];
    dashboardScheduleLog: DashboardScheduleLog[] = [];
    dashboardSchedules: DashboardSchedule[] = [];
    datasources: Datasource[] = [];
    errorMessage: string = '';       
    filteredDashboardIDs: number[] = [];
    filterDashboardName: string = '';
    filterSchedulesSendTo: string = '';
    filterSchedulesDueOn: string = '';
    filterSchedulesSentAfter: string = '';
    filterSchedulesSentBefore: string = '';
    filterSharedByUserID: string = '';
    filterSharedWithUserID: string = '';
    filterSharedWithGroup: string = '';
    filterOpenedByUserID: string = '';
    filterOpenedAfterDate: string = '';
    filterCreatedBy: string = '';
    filterCreatedAfter: string = '';
    filterDataDatasource: string = '';
    filterState: string = '';
    filterTag: string = '';
    filterMyFav: string = '';
    filterModifiedAfter: string = '';
    filterModifiedBefore: string = '';
    filterModifiedByUserID: string = '';
    groups: CanvasGroup[] = [];
    records: number = 15;
    selectedRow: number = 0;
    showAdvancedFilters: boolean = false;
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Prefetch data
        this.globalVariableService.getCanvasGroups().then( res => {
            this.groups = res;
        });

        // Get DSs
        this.datasources = this.globalVariableService.datasources.slice();

        // Get Ds
        this.dashboardsOriginal = this.globalVariableService.dashboards.slice()
        this.dashboards = this.dashboardsOriginal.slice().sort((n1,n2) => {
            if (n1.name > n2.name) {
                return 1;
            };

            if (n1.name < n2.name) {
                return -1;
            };

            return 0;
        });
    }

    clickSearch() {
        // Create a new Dashboard, and close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSearch', '@Start');

        // Reset
        this.dashboards = this.dashboardsOriginal;

        // Filter Name
        if (this.filterDashboardName != '') {
            this.dashboards = this.dashboardsOriginal.filter(d => 
                d.name.toLowerCase().includes(this.filterDashboardName.toLowerCase())
            );
        };
    }

    clickClose(action: string) {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.test = true;

        console.log('DashboardOpen clickClose', this.test)

		this.formDashboardOpenClosed.emit(action);
    }

    clickShowAdvancedFilters() {
        // Open area with advanced filters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowAdvancedFilters', '@Start');

        this.showAdvancedFilters = !this.showAdvancedFilters;
        console.warn('xx ', this.filterDataDatasource)
        // Get AuditTrail in advance
        this.globalVariableService.getCanvasAuditTrails().then( res => {
            this.canvasAuditTrails = res;
        });
        
        // Get Schedule Logs in advance
        this.globalVariableService.getDashboardScheduleLog().then(res =>
            this.dashboardScheduleLog = res);

        // Get Schedules in advance
        this.globalVariableService.getDashboardSchedules().then(res =>
            this.dashboardSchedules = res);

        // Nothing selected
        this.filteredDashboardIDs = [];
    }

    clickFiltersClose() {
        // Clear the filters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFiltersClose', '@Start');

        // Close the filter
        this.showAdvancedFilters = false;
    }

    clickFiltersClear() {
        // Clear the filters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFiltersClear', '@Start');

        this.filterDashboardName = '';
        this.filterSchedulesSendTo = '';
        this.filterSchedulesDueOn = '';
        this.filterSchedulesSentAfter = '';
        this.filterSchedulesSentBefore = '';
        this.filterSharedByUserID = '';
        this.filterSharedWithUserID = '';
        this.filterSharedWithGroup = '';
        this.filterOpenedByUserID = '';
        this.filterOpenedAfterDate = '';
        this.filterCreatedBy = '';
        this.filterCreatedAfter = '';
        this.filterDataDatasource = '';
        // this.filterDataField = '';
        this.filterState = '';
        this.filterTag = '';
        this.filterMyFav = '';
        this.filterModifiedAfter = '';
        this.filterModifiedBefore = '';
        this.filterModifiedByUserID = '';

    }

    clickFiltersApply() {
        // Open area with advanced filters
        // Note: these are combined as AND conditions
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowAdvancedFilters', '@Start');

        // Reset
        this.filteredDashboardIDs = [];
        this.dashboards = this.dashboardsOriginal.slice();

        // TODO - add Schedule filters later
        if (this.filterSchedulesSendTo != '') {
            if (this.dashboardScheduleLog.length = 0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };
            this.dashboards.forEach(d => {
                this.dashboardScheduleLog.forEach(dsl => {
                    if (dsl.dashboardID == d.id  
                        &&  
                        (
                            dsl.userID.toLowerCase() == this.filterSchedulesSendTo.toLowerCase()
                            ||
                            dsl.groupID.toLowerCase() == this.filterSchedulesSendTo.toLowerCase()
                        )
                        ) {
                            if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                                this.filteredDashboardIDs.push(d.id);
                            };
                    };
                });
            });

        };
        if (this.filterSchedulesDueOn != '') {
            // TODO - this is not final - needs to calc the due date
            if (this.dashboardSchedules.length = 0) {
                this.errorMessage = 'Still retrieving Schedules ...';
                return;
            };
            let dueOn: Date = new Date(this.filterSchedulesDueOn);
            this.dashboards.forEach(d => {
                this.dashboardSchedules.forEach(sch => {
                    if (sch.dashboardID == d.id  
                        &&  
                        sch.startsOn >= dueOn
                        ) {
                            if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                                this.filteredDashboardIDs.push(d.id);
                            };
                    };
                });
            });

        };
        if (this.filterSchedulesSentAfter != '') {
            if (this.dashboardScheduleLog.length = 0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };
            let sentAfter: Date = new Date(this.filterSchedulesSentAfter);
            this.dashboards.forEach(d => {
                this.dashboardScheduleLog.forEach(dsl => {
                    if (dsl.dashboardID == d.id  
                        &&  
                        dsl.sentOn >= sentAfter
                        ) {
                            if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                                this.filteredDashboardIDs.push(d.id);
                            };
                    };
                });
            });

        };
        if (this.filterSchedulesSentBefore != '') {
            if (this.dashboardScheduleLog.length = 0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };
            let sentBefore: Date = new Date(this.filterSchedulesSentBefore);
            this.dashboards.forEach(d => {
                this.dashboardScheduleLog.forEach(dsl => {
                    if (dsl.dashboardID == d.id  
                        &&  
                        dsl.sentOn <= sentBefore
                        ) {
                            if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                                this.filteredDashboardIDs.push(d.id);
                            };
                    };
                });
            });

        };

        if (this.filterSharedByUserID != '') {
            this.dashboards.forEach(d => {
                this.globalVariableService.dashboardPermissions.forEach(dP => {
                    if (dP.dashboardID == d.id  
                        &&  
                        dP.grantor.toLowerCase() == this.filterSharedByUserID.toLowerCase()) {
                        if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                            this.filteredDashboardIDs.push(d.id);
                        };
                    };
                });
            });
        };
        if (this.filterSharedWithUserID != '') {
            this.dashboards.forEach(d => {
                this.globalVariableService.dashboardPermissions.forEach(dP => {
                    if (dP.dashboardID == d.id  
                        &&  
                        dP.userID.toLowerCase() == this.filterSharedWithUserID.toLowerCase()) {
                        if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                            this.filteredDashboardIDs.push(d.id);
                        };
                    };
                });
            });
        };
        if (this.filterSharedWithGroup != '') {
            let groupIndex: number = this.groups.findIndex(grp => grp.name == this.filterSharedWithGroup);
            let groupID: number = null;
            if (groupIndex >= 0) {
                groupID = this.groups[groupIndex].id;
            } else {
                this.errorMessage = 'Unexpected error: The group does not exist in the DB';
                return;
            };

            this.groups.findIndex(grp => grp.name == this.filterSharedWithGroup);
            this.dashboards.forEach(d => {
                this.globalVariableService.dashboardPermissions.forEach(dP => {
                    if (dP.dashboardID == d.id  
                        &&  
                        dP.groupID == groupID) {
                        if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                            this.filteredDashboardIDs.push(d.id);
                        };
                    };
                });
            });

        };

        if (this.filterOpenedByUserID != '') {
            if (this.dashboardScheduleLog.length = 0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };
            this.dashboards.forEach(d => {
                this.canvasAuditTrails.forEach(aud => {
                    if (aud.dashboardID == d.id  
                        &&  
                        aud.userID.toLowerCase() == this.filterOpenedByUserID.toLowerCase()
                        &&
                        aud.objectType == 'Dashboard'
                        &&
                        aud.actionType == 'Open'
                        ) {
                            if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                                this.filteredDashboardIDs.push(d.id);
                            };
                    };
                });
            });

        };
        if (this.filterOpenedAfterDate != '') {
            if (this.dashboardScheduleLog.length = 0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };
            let afterDate: Date = new Date(this.filterOpenedAfterDate);
            this.dashboards.forEach(d => {
                this.canvasAuditTrails.forEach(aud => {
                    if (aud.dashboardID == d.id  
                        &&  
                        aud.changedOn == afterDate
                        &&
                        aud.objectType == 'Dashboard'
                        &&
                        aud.actionType == 'Open'
                        ) {
                            if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                                this.filteredDashboardIDs.push(d.id);
                            };
                    };
                });
            });

        };
        if (this.filterCreatedBy != '') {
            this.dashboards = this.dashboards.filter(d => {
                if (d.creator != null) {
                    if (d.creator.toLowerCase() == this.filterCreatedBy.toLowerCase()) {
                        return d;
                        // if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                        //     this.filteredDashboardIDs.push(d.id);
                        // };
                    };
                };
            });

        };
        if (this.filterCreatedAfter != '') {
            let dateAfter: Date = new Date(this.filterModifiedAfter);
            this.dashboards.forEach(d => {
                if (d.dateCreated != null) {
                    if (d.dateCreated >= dateAfter) {
                        if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                            this.filteredDashboardIDs.push(d.id);
                        };
                    };
                };
            });

        };
        if (this.filterDataDatasource != '') {
            let datasourceIndex: number = this.datasources.findIndex(ds => ds.name == this.filterDataDatasource);
            let datasourceID: number = null;
            if (datasourceIndex >= 0) {
                datasourceID = this.datasources[datasourceIndex].id;
            } else {
                this.errorMessage = 'Unexpected error: The selected datasource does not exist in the DB';
                return;
            };

            this.dashboards.forEach(d => {
                this.globalVariableService.widgets.forEach(w => {
                    if (w.dashboardID == d.id  
                        &&  
                        w.datasourceID == datasourceID) {
                        if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                            this.filteredDashboardIDs.push(d.id);
                        };
                    };
                });
            });

        };
        if (this.filterState != '') {
            this.dashboards.forEach(d => {
                if (d.state != null) {
                    if (d.state.toLowerCase() == this.filterModifiedByUserID.toLowerCase()) {
                        if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                            this.filteredDashboardIDs.push(d.id);
                        };
                    };
                };
            });

        };
        if (this.filterTag != '') {
            this.dashboards.forEach(d => {
                this.globalVariableService.dashboardTags.forEach(tag => {
                    if (d.id == tag.id) {
                        if (tag.tag.toLowerCase() == this.filterTag.toLowerCase()) {
                            if (this.filteredDashboardIDs.indexOf(tag.id) < 0) {
                                this.filteredDashboardIDs.push(tag.id);
                            };
                        };
                    };
                });
            });


        };
        if (this.filterMyFav != '') {
            this.dashboards.forEach(d => {
                if (this.globalVariableService.currentUser.favouriteDashboards.indexOf(d.id) >= 0) {
                    if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                        this.filteredDashboardIDs.push(d.id);
                    };
                };
            });

        };
        if (this.filterModifiedAfter != '') {
            let dateAfter: Date = new Date(this.filterModifiedAfter);
            this.dashboards.forEach(d => {
                if (d.dateEdited != null) {
                    if (d.dateEdited >= dateAfter) {
                        if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                            this.filteredDashboardIDs.push(d.id);
                        };
                    };
                };
            });

        };
        if (this.filterModifiedBefore != '') {
            let dateAfter: Date = new Date(this.filterModifiedAfter);
            this.dashboards.forEach(d => {
                if (d.dateEdited != null) {
                    if (d.dateEdited <= dateAfter) {
                        if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                            this.filteredDashboardIDs.push(d.id);
                        };
                    };
                };
            });

        };
        if (this.filterModifiedByUserID != '') {
            this.dashboards = this.dashboards.filter(d => {
                if (d.editor != null) {
                    if (d.editor.toLowerCase() == this.filterModifiedByUserID.toLowerCase()) {
                        return d;
                    };
                };
            });
        };
        console.warn('xx this.filteredDashboardIDs', this.filteredDashboardIDs)

        // Close the filter
        this.showAdvancedFilters = false;
    }

    clickOpenView(dashboardID: number) {
        // Open a Dashboard in ViewOnly Mode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenView', '@Start');

        this.globalVariableService.editMode.next(false);

		this.globalVariableService.refreshCurrentDashboard(
			'openDashboard-clickOpenRecentDashboard', dashboardID, -1, ''
        );

        this.formDashboardOpenClosed.emit('View');
    }

    clickOpenEdit(index: number, dashboardID: number) {
        // Open a Dashboard in EditMode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenEdit', '@Start');

        // Only Editor can open his Draft
        if (this.dashboards[index].state == 'Draft'
            &&
            this.dashboards[index].editor != this.globalVariableService.currentUser.
            userID) {
                this.errorMessage = 'Dashboard is edited by ' + this.dashboards[index].editor;
                return;
        };

        // Copy Original to Draft
        if (this.dashboards[index].state == 'Complete') {
            this.globalVariableService.copyDashboard(
                this.dashboards[index].id, null, 'Draft'
            ).then(res => {
                console.warn('xx res', res)
                this.globalVariableService.refreshCurrentDashboard(
                    'openDashboard-clickOpenEdit', res.id, -1, ''
                );
                this.globalVariableService.editMode.next(true);
                this.formDashboardOpenClosed.emit('View');
            });
        } else {
                
            this.globalVariableService.refreshCurrentDashboard(
                'openDashboard-clickOpenEdit', dashboardID, -1, ''
            );
            this.globalVariableService.editMode.next(true);
            this.formDashboardOpenClosed.emit('View');
        };
    }

    clickRow(index: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }
}
