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
import { Datasource }                 from './models';
 
@Component({
    selector: 'data-manageBussGlossary',
    templateUrl: './data.manageBussGlossary.component.html',
    styleUrls: ['./data.manageBussGlossary.component.css']
})

export class DataManagBussGlossaryComponent implements OnInit {

    @Output() formDataManageBussGlossaryClosed: EventEmitter<string> = new EventEmitter();

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

    datasources: Datasource[] = [];
    editing: boolean = false;
    selectedDatasourceID: number = null;
    selectedDatasource: Datasource;
    selectedDatasourcesRowIndex: number = 0;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
        
        // Reset, else async too late and form load fails
        this.selectedDatasource = 
        {
            id: null,
            type: '',
            subType: '',
            typeVersion: '',
            name: '',
            username: '',
            password: '',
            description: '',
            createdBy: '',
            createdOn: '',
            refreshedBy: '',
            refreshedOn: '',
            dataFieldIDs: null,
            dataFields: null,
            dataFieldTypes: null,
            dataFieldLengths: null,
            parameters: '',
            folder: '',
            fileName: '',
            excelWorksheet: '',
            transposeOnLoad: false,
            startLineNr: null,
            csvSeparationCharacter: '',
            csvQuotCharacter: '',
            connectionID: null,
            dataTableID: null,
            businessGlossary: '',
            databaseName: '',
            port: '',
            serverType: '',
            serverName: '',
            dataTableName: '',
            dataSQLStatement: '',
            dataNoSQLStatement: '',
            nrWidgets: null
        }

        this.globalVariableService.getDatasources().then(dc => {
            // Fill local Var
            this.datasources = dc.slice();
            console.warn('xx this.datasources.length', this.datasources.length)
            
            // Click on first one, if available
            if (this.datasources.length > 0) {
                this.clickRow(0, this.datasources[0].id);
            };
        });

    }

    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set the row index
        this.selectedDatasourcesRowIndex = index;
        this.editing = false;
        this.selectedDatasourceID = id;

        // Fill the form
        let selectedDatasourceIndex: number = this.datasources
            .findIndex(dc => dc.id == id);
        if (selectedDatasourceIndex >= 0) {

            this.selectedDatasource = Object.assign({}, 
                this.datasources[selectedDatasourceIndex]
            );
        } else {
            this.selectedDatasource = null;
        };
console.warn('xx this.selectedDatasource ', this.selectedDatasource )
    }
    
    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataManageBussGlossaryClosed.emit(action);

    }

    clickCancel() {
        // Cancel Editing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        this.editing = false;
        this.clickRow(this.selectedDatasourcesRowIndex, this.selectedDatasourceID);
        
        // // Re Fill the form
        // let datasourceIndex: number = this.datasources
        //     .findIndex(sch => sch.id == this.selectedDatasource.id);
        // if (datasourceIndex >= 0) {
        //     this.selectedDatasource = Object.assign({}, 
        //         this.datasources[datasourceIndex]
        //     );
        // };

        // // Reset
        // this.selectedDatasourcesRowIndex = null;
        // this.selectedDatasourceID = null;

    }

    clickSave() {
        // Save changes to the Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Save the changes
        if (this.editing) {
            let datasourceIndex: number = this.datasources
                .findIndex(ds => ds.id == this.selectedDatasource.id);
            if (datasourceIndex >= 0) {
                this.datasources[datasourceIndex].businessGlossary = 
                    this.selectedDatasource.businessGlossary
            };
            this.globalVariableService.saveDatasource(this.selectedDatasource)
        };

        // Reset
        this.editing = false;
        // this.selectedDatasourcesRowIndex = null;
        // this.selectedDatasourceID = null;

    }

    clickEdit() {
        // Start editing selected Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        if (this.datasources.length > 0) {
            this.editing = true;
        };
console.warn('xx edit', this.editing)
    }

}


