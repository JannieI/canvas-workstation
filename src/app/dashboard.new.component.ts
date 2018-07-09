/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';
import { DashboardTab }               from './models';

@Component({
    selector: 'dashboard-new',
    templateUrl: './dashboard.new.component.html',
    styleUrls: ['./dashboard.new.component.css']
})
export class DashboardNewComponent implements OnInit {

    @Output() formDashboardNewClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };
        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickCreate();
            return;
        };

    }

    dashboards: Dashboard[];
    dashboardCode: string = '';
    dashboardName: string = '';
    dashboardDescription: string = '';
    errorMessage: string = '';
    fileName: string = '';
    importFolder: string;
    reader = new FileReader();
    theFile: any;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards.slice();
    }

    clickClose() {
        // Close form, no action
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardNewClosed.emit('Cancel');
    }

    clickFileBrowse() {
        // Browse for file to import
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileBrowse', '@Start');

        if ( (<any>window).File && (<any>window).FileReader && (<any>window).FileList && window.Blob) {
            console.warn('xx Start Great success! All the File APIs are supported.')
          } else {
            alert('The File APIs are not fully supported in this browser.');
        };

        // TODO alert('Later: File component to browse ...')
        var inp: any = document.getElementById("get-files");

        // Return if nothing selected
        if (inp.files.length == 0) {
            return;
        };

        // Access and handle the files
        this.theFile = inp.files[0];
        console.warn('xx pre readAsText', this.theFile, this.theFile.name, this.theFile.type, this.theFile.size, this.theFile.lastModifiedDate, this.theFile.lastModifiedDate.toLocaleDateString())

        // Read file as Text

        this.reader.onerror = this.errorHandler;
        this.reader.onprogress = this.updateProgress;
        this.reader.onload = (theFile) =>{ this.loadFile(theFile) };

        // Read in the image file as a data URL.
        this.reader.readAsText(this.theFile);
        console.warn('xx Post readAsText')
    }

    loadFile(theFile) {
        // Callback for loading File
        console.warn('loadFile', '@Start');

        this.theFile = JSON.parse(JSON.stringify(theFile.target.result));
        let obj: Dashboard = JSON.parse(this.theFile);
        console.warn('xx obj', obj.code)

        // let newD: Dashboard = JSON.parse(JSON.stringify(theFile.target.result));
        // console.warn('  end loadFile', newD)
    }

    abortRead() {
        // Cancelled reading File
        console.warn('abortRead', '@Start');

        this.reader.abort();
    }

    errorHandler(evt) {
        // Handling errors on File load
        console.warn('errorHandler', '@Start');

        switch(evt.target.error.code) {
          case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
          case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
          case evt.target.error.ABORT_ERR:
            break; // noop
          default:
            alert('An error occurred reading this file.');
        };
    }

    updateProgress(evt) {
        // Update event to show progress on file load
        console.warn('updateProgress', '@Start');

        // evt is an ProgressEvent.
        if (evt.lengthComputable) {
            var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
            // Increase the progress bar length.
            if (percentLoaded < 100) {
                console.warn('xx % loaded', percentLoaded)
                // progress.style.width = percentLoaded + '%';
                // progress.textContent = percentLoaded + '%';
            };
        };
    }

    clickCreate() {
        // Create a new Dashboard, and close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCreate', '@Start');

        if (this.dashboardCode == '') {
            this.errorMessage = 'Code compulsory';
            return;
        };
        if (this.dashboardName == '') {
            this.errorMessage = 'Name compulsory';
            return;
        };
        if (this.dashboardDescription == '') {
            this.errorMessage = 'Description compulsory';
            return;
        };

        // Reset
        this.errorMessage = '';

        // Create new D
        let newDashboard: Dashboard = this.globalVariableService.dashboardTemplate;
        newDashboard.code = this.dashboardCode;
        newDashboard.name = this.dashboardName;
        newDashboard.description = this.dashboardDescription;
        newDashboard.creator = this.globalVariableService.currentUser.userID;

        // Add new (Complete + Draft) to DB, and open Draft
        newDashboard.state = 'Complete';
        this.globalVariableService.addDashboard(newDashboard).then(newD => {
            newDashboard.state = 'Draft';
            newDashboard.originalID = newD.id;
            this.globalVariableService.addDashboard(newDashboard).then(draftD => {
                newD.draftID = draftD.id;
                this.globalVariableService.saveDashboard(newD).then(originalD => {

                    let newDashboardTab: DashboardTab = this.globalVariableService.dashboardTabTemplate;
                    newDashboardTab.dashboardID = draftD.id;

                    // Add Tab to DB
                    this.globalVariableService.addDashboardTab(newDashboardTab).then(t => {

                        this.globalVariableService.amendDashboardRecent(draftD.id, t.id).then(dR => {

                            this.globalVariableService.refreshCurrentDashboard(
                                'addDashboard-clickCreate', draftD.id, t.id, ''
                            );

                            this.formDashboardNewClosed.emit('Created');
                        });
                    })
                });
            });
        });

    }
}
