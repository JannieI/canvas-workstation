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
import { DashboardTag }               from './models';

// Models
import { PaletteButtonBar }           from './models';
import { PaletteButtonsSelected }     from './models';


@Component({
    selector: 'dashboard-tags',
    templateUrl: './dashboard.tags.component.html',
    styleUrls: ['./dashboard.tags.component.css']
})
export class DashboardTagsComponent implements OnInit {

    @Input() selectedDashboard: Dashboard
    @Output() formDashboardTagsClosed: EventEmitter<string> = new EventEmitter();

    availableDashboardTags: DashboardTag[] = [];
    selectedDashboardTags: DashboardTag[] = [];
    newTag: string = '';
    paletteButtons: PaletteButtonBar[];
    paletteButtonsSelected: PaletteButtonsSelected[];
    selectedTagIndex: number = -1;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getDashboardTags().then(dt => {

            // Get selected, before any manipulation done to dt
            this.selectedDashboardTags = dt.filter(f =>
                f.dashboardID == this.selectedDashboard.id
            )

            // Get a unique list of tags
            let availableTagText = new Set(dt.map(t => t.tag));
            let availableTagTextArray = Array.from(availableTagText);
            
            for (let i = 0; i < dt.length; i++) {

                if (availableTagTextArray.indexOf(dt[i].tag) >= 0) {
                    this.availableDashboardTags.push(dt[i]);
                    availableTagTextArray = availableTagTextArray.slice(1);
                };
            };
 
            // Sort the available tags
            this.availableDashboardTags.sort( (obj1,obj2) => {
                if (obj1.tag > obj2.tag) {
                    return 1;
                };
                if (obj1.tag < obj2.tag) {
                    return -1;
                };
                return 0;
            });

        });

    }

    clickAvailable(id: number, index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAvailable', '@Start');

        this.selectedTagIndex = index;
    }


    clickAddNew() {
        // Add text for a new tag
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddNew', '@Start');
        
        // Nothing to do
        if (this.newTag == ''  ||  this.newTag == null  ||  this.newTag == undefined) {
            return;
        };
        let isFound: boolean = false;
        this.selectedDashboardTags.forEach(dt => {
            if (dt.tag == this.newTag) {
                isFound = true;
            }
        });
        if (isFound) {
            return;
        };
        
        // TODO - do this better with a DB
        let maxIDs: number[] = [];
        let maxID: number = 0;
        this.globalVariableService.currentDashboardTags.forEach(pbs =>
            maxIDs.push (pbs.id)
        );
        maxID = Math.max(...maxIDs);

        maxID = maxID + 1;
        this.selectedDashboardTags.push(
            {
                id: maxID,
                dashboardID: this.selectedDashboard.id,
                tag: this.newTag

            }
        );
    }

    clickAdd() {
        // Add tag that is selected on the Avaliable Tag list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Nothing to do
        if (this.selectedTagIndex < 0) {
            return;
        };
        let isFound: boolean = false;
        this.selectedDashboardTags.forEach(dt => {
            if (dt.tag == this.availableDashboardTags[this.selectedTagIndex].tag) {
                isFound = true;
            }
        });
        if (isFound) {
            return;
        };

        // Get selected in Available, and add to Selected

        // TODO - do this better with a DB
        let maxIDs: number[] = [];
        let maxID: number = 0;
        this.globalVariableService.currentDashboardTags.forEach(pbs =>
            maxIDs.push (pbs.id)
        );
        maxID = Math.max(...maxIDs);

        maxID = maxID + 1;
        this.selectedDashboardTags.push(
            {
                id: maxID,
                dashboardID: this.selectedDashboard.id,
                tag: this.availableDashboardTags[this.selectedTagIndex].tag

            }
        );

    }

    clickDelete(id: number, index: number){
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        // Remove from seleted list
        this.selectedDashboardTags.splice(index, 1);
        
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardTagsClosed.emit(action);
    }

    clickSave(action: string) {
        // Save data, and Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Delete all Tags for this D
        for (let i = this.globalVariableService.dashboardTags.length - 1; i >= 0; i--) {
            if (this.globalVariableService.dashboardTags[i].dashboardID == 
                this.selectedDashboard.id) {
                    this.globalVariableService.deleteDashboardTag(
                        this.globalVariableService.dashboardTags[i].id
                    );
                    this.globalVariableService.dashboardTags.splice(i, 1)
            };
        };

        // Add the new ones to the DB
        // TODO - note that IDs in paletteButtonsSelected sent to app is DIFF to DB ...
        this.selectedDashboardTags.forEach(dt =>
                this.globalVariableService.addDashboardTag(dt)
        );

        // Tell user
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'Changes Saved',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );

		this.formDashboardTagsClosed.emit(action);
    }

}

