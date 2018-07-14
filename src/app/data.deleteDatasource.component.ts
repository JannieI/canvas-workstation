/*
 * Manage (add, edit, delete) Transformations for a Datasource.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource }                 from './models';
import { Widget }                     from './models';


@Component({
    selector: 'data-deleteDatasource',
    templateUrl: './data.deleteDatasource.component.html',
    styleUrls:  ['./data.deleteDatasource.component.css']
})
export class DataDeleteDatasourceComponent implements OnInit {

    @Output() formDataDeleteDatasourceClosed: EventEmitter<string> = new EventEmitter();

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

    datasources: Datasource[];
    errorMessage: string = "";
    selectedRowIndex: number = 0;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Load from global variables
        this.datasources = this.globalVariableService.datasources.slice();

        // Count the Ws
        let widgets: Widget[];
        this.datasources.forEach(ds => {
            widgets = this.globalVariableService.widgets.filter(w => w.datasourceID == ds.id);
            ds.nrWidgets = widgets.length;
        });

    }

    clickSelectedDatasource(index: number, id: number) {
        // Clicked a DS -> Show related info and preview its data
        // index = Index / position on CURRENT page, when using pagination
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;

        this.errorMessage = '';
    }

    dblclickDelete(index: number, id: number) {
        // Delete a DS and associated info
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');

        this.globalVariableService.deleteDatasource(id).then(res => {
            this.datasources = this.datasources.filter(ds => ds.id != id)

            this.globalVariableService.datasets.forEach(dSet => {
                if (dSet.datasourceID == id) {
                    let url: string = dSet.url;
                    let dataID: number = null;
                    if (url != null  &&  url != '') {
                        let slashPositon = url.indexOf('/');
                        if (slashPositon >= 0) {
                            dataID = +url.substring(slashPositon + 1);
                        }
                    };
                    if (dataID != null) {
                        this.globalVariableService.deleteData(dataID);
                    }
                    this.globalVariableService.deleteDataset(dSet.id).then();
                };
            })
        });
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDeleteDatasourceClosed.emit(action);

    }

}


