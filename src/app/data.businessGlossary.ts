/*
 * Manage Business Glossary for Datasources
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
import { Datasource }                 from './models';
 
@Component({
    selector: 'data-business-glossary',
    templateUrl: './data.businessGlossary.component.html',
    styleUrls: ['./data.businessGlossary.component.css']
})

export class DataBusinessGlossaryComponent implements OnInit {

    @Output() formDataBusinessGlossaryClosed: EventEmitter<string> = new EventEmitter();

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

        this.globalVariableService.getDatasources().then(dc => {
            // Fill local Var
            this.datasources = dc.slice();
            
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

    }
    
    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataBusinessGlossaryClosed.emit(action);

    }


}


