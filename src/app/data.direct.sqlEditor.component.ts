/*
 * Create a new Datasource using a SQL Editor.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                     from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { DataSchema }                 from './models';
import { Dataset }                    from './models';
import { Datasource }                 from './models';
import { TributaryServerType }        from './models';

@Component({
    selector: 'data-direct-sqlEditor',
    templateUrl: './data.direct.sqlEditor.component.html',
    styleUrls:  ['./data.direct.sqlEditor.component.css']
})
export class DataDirectSQLEditorComponent implements OnInit {

    @Input() editingDS: boolean;
    @Input() selectedDatasource: Datasource;

    @Output() formDataDirectSQLEditorClosed: EventEmitter<Datasource> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };

    }


    canSave: boolean = false;
    dataSchemas: DataSchema[] = [];
    errorMessage: string = "";
    fieldsInTable: string[];
    fileData: any = [];
    fileDataFull: any = [];
    reader = new FileReader();
    savedMessage: string = '';
    selectedTable: string = '';
    selectedField: string = '';
    serverTypes: TributaryServerType[];
    showPreview: boolean = false;
    spinner: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Set base info
        this.serverTypes = this.globalVariableService.serverTypes;

        if (this.selectedDatasource == null) {
            let today: Date = new Date();
            this.selectedDatasource = {
                id: null,
                type: 'Server',
                subType: '',
                typeVersion: '',
                name: '',
                username: 'ftfhgfzh',
                password: 'L0Eph9ftbx0yh45aeDtgzsGKBa2ZNhfl',
                description: '',
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: today,
                createMethod: 'directSQLEditor',
                editor: '',
                dateEdited: null,
                refreshedBy: '',
                refreshedOn: null,
                dataFieldIDs: [0],
                dataFields: [''],
                dataFieldTypes: [''],
                dataFieldLengths: [0],
                parameters: '',
                folder: '',
                fileName: '',
                excelWorksheet: '',
                transposeOnLoad: false,
                startLineNr: 0,
                csvSeparationCharacter: '',
                csvQuotCharacter: '',
                webUrl: '',
                webTableIndex: '',
                connectionID: 0,
                dataTableID: 0,
                nrWidgets: 0,
                databaseName: 'ftfhgfzh',
                port: '5432',
                serverType: 'PostgresSQL',
                serverName: 'pellefant.db.elephantsql.com',
                dataTableName: 'ftfhgfzh',
                dataSQLStatement: 'SELECT "InvoiceDate", "BillingCity"  FROM invoices',
                dataNoSQLStatement: '',
                dataNeo4jStatement: '',
                dataGraphQLStatement: '',
                dataOverlaySpecification: '',
                businessGlossary: 'Obtained using SQL Editor',
                dataDictionary: ''

            };
        };


    }

    clickGo() {
        // Load the File content
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGo',           '@Start');

        // Reset
        this.errorMessage = '';
        this.showPreview = false;
        this.canSave = false;

        // Show user
        this.spinner = true;

        // Get drivers
        let driver: string = this.serverTypes
            .filter(styp => styp.serverType == this.selectedDatasource.serverType)
            .map(styp => styp.driverName)[0];

        // Set up specification for Connector
        this.selectedDatasource.dataSQLStatement = this.selectedDatasource.dataSQLStatement.trim();
        let specificationConnect: any = {
            "source": {
                "connector": "tributary.connectors.sql:SqlConnector",
                "specification": {
                    "drivername": driver,
                    "username": this.selectedDatasource.username,
                    "password": this.selectedDatasource.password,
                    "database": this.selectedDatasource.databaseName,
                    "host": this.selectedDatasource.serverName,
                    "port": +this.selectedDatasource.port,
                    "query": this.selectedDatasource.dataSQLStatement
                }
            }
        };

        // Get Tributary data
        this.globalVariableService.getTributaryData(specificationConnect)
            .then(res => {

                // Fill the data
                this.fileData = res.slice(0,10);
                this.fileDataFull = res;

                // Construct a list of field name / column headings from the data
                this.selectedDatasource.dataFields = [];

                if (res.length > 0) {
                    console.warn('xx res[0]', res[0])
                    for(var key in res[0]) {
                        console.warn('xx key', key)
                        this.selectedDatasource.dataFields.push(key);
                    }
                };

                // Show the results
                this.showPreview = true;
                this.spinner = false;

                // Can Add now
                this.canSave = true;

            })
            .catch(err => {
                this.spinner = false;
                this.errorMessage = 'Error connecting to server: check login or permissions'
                    + err.message;
            });

    }

    clickExplore() {
        // Load the Tables and Fields, using the Tributary Inspector
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExplore',           '@Start');

        // Reset
        this.errorMessage = '';
        this.showPreview = false;
        this.canSave = false;

        // Show user
        this.spinner = true;

        // Get drivers
        let driver: string = this.serverTypes
            .filter(styp => styp.serverType == this.selectedDatasource.serverType)
            .map(styp => styp.driverName)[0];

        let specificationInspect: any = {
            "source": {
                "inspector": "tributary.inspectors.sql:SqlInspector",
                "specification": {
                    "drivername": driver,
                    "username": this.selectedDatasource.username,
                    "password": this.selectedDatasource.password,
                    "database": this.selectedDatasource.databaseName,
                    "host": this.selectedDatasource.serverName,
                    "port": +this.selectedDatasource.port
                }
            }
        };
        // Call Tributary Inspector
        this.globalVariableService.getTributaryInspect(specificationInspect).then(res => {

            // Fill the tables and Fields
            this.dataSchemas = [];
            res.forEach(row => {

                this.dataSchemas.push(
                {
                    serverName: this.selectedDatasource.serverName,
                    tableName: row.name,
                    tableDescription: row.name,
                    tableFields: [],
                    tableMetadata: []
                });
                row.fields.forEach(fld => {
                    this.dataSchemas[this.dataSchemas.length - 1].tableFields.push(
                        {
                            fieldName: fld.name,
                            fieldType: fld.dtype
                        }
                    )
                });
            });
            this.spinner = false;
            console.warn('xx res I', res, this.dataSchemas)

        })
        .catch(err => {
            console.warn('xx err', err)
            this.spinner = false;
            this.errorMessage = 'Error connecting to server: check login or permissions'
                + err.message;
        });

    }

    clickSelectTable(ev: any) {
        // User selected a table, fill the fields for it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTable', '@Start');

        this.fieldsInTable = [];
        let selectedDataSchema: DataSchema[] = this.dataSchemas.filter(
            dsch => dsch.tableName == ev.target.value
        );
        console.warn('xx selectedDataSchema',selectedDataSchema, this.dataSchemas, ev.target.value )

        if (selectedDataSchema.length > 0) {
            this.fieldsInTable = selectedDataSchema[0].tableFields.map(tf => tf.fieldName);
        };
        console.warn('xx this.fieldsInTable',ev, this.selectedTable, this.fieldsInTable )
    }

    clickExport() {
        // Export the file, and close the file
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExport', '@Start');

        // Reset
        this.errorMessage = '';

        let fileName = 'SQL statement';

        // Export
        var obj = JSON.stringify(this.selectedDatasource.dataSQLStatement);
        this.saveText(JSON.stringify(obj), fileName);

    }

    saveText(text, filename){
        // Actual Export of selected DS to a file by creating <a> tag
        this.globalFunctionService.printToConsole(this.constructor.name,'saveText',           '@Start');

        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/json;charset=utf-u,'+encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    }


    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectSQLEditorClosed.emit(null);

    }

    clickAdd(action: string) {
        // Add the DS, with data, to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.errorMessage = '';
        this.savedMessage = '';

        // Save changes to the Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Validation
        if (this.selectedDatasource.name == ''  ||  this.selectedDatasource.name == null) {
            this.errorMessage = 'The name is compulsory';
            return;
        };
        if (this.selectedDatasource.description == ''  ||  this.selectedDatasource.description == null) {
            this.errorMessage = 'The description is compulsory';
            return;
        };

        // Construct DS and add to DB
        if (this.editingDS) {
            let today: Date = new Date();
            this.selectedDatasource.editor = this.globalVariableService.currentUser.userID;
            this.selectedDatasource.dateEdited = today;

            // Save DS to DB, but create a new dSet and new data records.
            let ds: number[] = [];
            let dSetID: number = 1;
            for (var i = 0; i < this.globalVariableService.datasets.length; i++) {
                if(this.globalVariableService.datasets[i].datasourceID ==
                    this.selectedDatasource.id) {
                    ds.push(this.globalVariableService.datasets[i].id)
                };
            };
            if (ds.length > 0) {
                dSetID = Math.max(...ds);
            };
            let datasetIndex: number = this.globalVariableService.datasets.findIndex(dSet => {
                if (dSet.id == dSetID) {
                    return dSet;
                };
            });
            let updatedDataset: Dataset = this.globalVariableService.datasets[datasetIndex];

            let dataID: number = -1;
            let dataIndex: number = updatedDataset.url.indexOf('/');
            if (dataIndex >= 0) {
                dataID = +updatedDataset.url.substring(dataIndex + 1);
            } else {
                alert('Error in save Web - url has no / character');
                return;
            };
            let updatedData: any = {
                id: dataID,
                data: this.fileDataFull
            };

            // Add Data, then dataset, then DS
            this.globalVariableService.saveData(updatedData).then(resData => {

                updatedDataset.url = 'data/' + dataID;
                this.globalVariableService.saveDatasource(this.selectedDatasource).then(
                    resDS => {
                        updatedDataset.datasourceID = this.selectedDatasource.id;
                        this.globalVariableService.saveDataset(updatedDataset);
                });

                // Indicate to the user
                this.canSave = false;
                this.savedMessage = 'Datasource updated';
            });

        } else {
            // Add new one
            let newdDataset: Dataset = {
                id: null,
                datasourceID: null,
                sourceLocation: 'HTTP',
                url: 'data',
                folderName: '',
                fileName: '',
                data: this.fileDataFull,
                dataRaw: this.fileDataFull
            };
            let newData: any = {
                id: null,
                data: this.fileDataFull
            };

            // Add Data, then dataset, then DS
            this.globalVariableService.addData(newData).then(resData => {

                newdDataset.url = 'data/' + resData.id.toString();
                this.globalVariableService.addDatasource(this.selectedDatasource).then(resDS => {
                    newdDataset.datasourceID = resDS.id;
                    this.globalVariableService.addDataset(newdDataset);

                });

                // Indicate to the user
                this.canSave = false;
                this.savedMessage = 'Datasource created';
            });
        };

        // Close form and open Transitions if requested
        if (action == 'Saved') {
            this.formDataDirectSQLEditorClosed.emit(null);

        } else {
            this.formDataDirectSQLEditorClosed.emit(this.selectedDatasource);

        };
    }

}


