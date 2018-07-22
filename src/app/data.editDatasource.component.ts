/*
 * Select Datasource to be editied in next form.
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

interface ClrDatagridStringFilterInterface<T> {
    accepts(item: T, search: string): boolean;
}

class FilterDatasourceName implements ClrDatagridStringFilterInterface<Datasource> {
    accepts(datasource: Datasource, search: string):boolean {
        return "" + datasource.name == search
            || datasource.name.toLowerCase().indexOf(search) >= 0;
    }
}


@Component({
    selector: 'data-editDatasource',
    templateUrl: './data.editDatasource.component.html',
    styleUrls:  ['./data.editDatasource.component.css']
})
export class DataEditDatasourceComponent implements OnInit {

    @Output() formDataEditDatasourceClosed: EventEmitter<Datasource> = new EventEmitter();

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
               if (this.selectedRowIndex!=null) {
                   this.clickContinue();
               };
            return;
        };
        if (event.code == 'End'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            if (this.datasources.length == 0) {
                return;
            };
            // Click on the last one
            let dsIndex: number = this.datasources.length - 1;
            let dsID: number = this.datasources[dsIndex].id;
            this.clickSelectedDatasource(dsIndex, dsID);
            return;
        };

    }

    datasources: Datasource[];
    errorMessage: string = "";
    filterName = new FilterDatasourceName();
    selectedRowIndex: number = null;
    selectedDatasource: Datasource;


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
        console.warn('xx INIT this.selectedDatasource', this.selectedDatasource)

    }

    clickSelectedDatasource(index: number, id: number) {
        // Clicked a DS -> Show related info and preview its data
        // index = Index / position on CURRENT page, when using pagination
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;

        this.errorMessage = '';
    }

    clickTransformation(index: number, id: number) {
        // Close the form, and proceed to the Transformations of the relevant DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTransformation', '@Start');

        // Select this row
        this.selectedRowIndex = index;
        
        // Indicate how to continue when back in App, and close this form
        this.globalVariableService.continueToTransformations = true;
        this.clickContinue();
    }

    clickClose() {
        // Close the form, no further action
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataEditDatasourceClosed.emit(null);

    }

    clickContinue() {
        // Close the form, and proceed to the relevant Edit DS form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickContinue', '@Start');

        if (this.selectedRowIndex >= 0) {
            this.selectedDatasource = this.datasources[this.selectedRowIndex];
            this.formDataEditDatasourceClosed.emit(this.selectedDatasource);
        } else {
            this.formDataEditDatasourceClosed.emit(null);
        };


    }

}


