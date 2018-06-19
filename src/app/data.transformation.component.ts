/*
 * List of Transformations that forms part of the Datasource definition.
 * 
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                     from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { DataField }                  from './models';
import { Datasource }                 from './models';
import { DatasourceTransformation }   from './models';
import { Dataset }                    from './models';
import { Transformation }             from './models';
import { Field }                      from './models';

interface localDatasourceTransformation extends DatasourceTransformation {
    name?: string;           // Name of the Transformation to display on form
}


@Component({
    selector: 'data-transformation',
    templateUrl: './data.transformation.component.html',
    styleUrls:  ['./data.transformation.component.css']
})
export class DataTransformationComponent implements OnInit {

    @Input() selectedDatasource: Datasource;

    @Output() formDataTransformationClosed: EventEmitter<string> = new EventEmitter();

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
    
    
    adding: boolean = false;
    dataFields: DataField[];
    datasourceTransformations: localDatasourceTransformation[] = [];
    errorMessage: string = "";

    parameter1Placeholder: string = '';
    parameter1Title: string = '';
    parameter1Value: string = '';
    parameter1Heading: string = '';

    parameter2Placeholder: string = '';
    parameter2Title: string = '';
    parameter2Value: string = '';
    parameter2Heading: string = '';

    parameter3Placeholder: string = '';
    parameter3Title: string = '';
    parameter3Value: string = '';
    parameter3Heading: string = '';

    parameter4Placeholder: string = '';
    parameter4Title: string = '';
    parameter4Value: string = '';
    parameter4Heading: string = '';

    parameter5Placeholder: string = '';
    parameter5Title: string = '';
    parameter5Value: string = '';
    parameter5Heading: string = '';

    parameter6Placeholder: string = '';
    parameter6Title: string = '';
    parameter6Value: string = '';
    parameter6Heading: string = '';

    selectedTransformationRowIndex: number = 0;
    selectedDataRowIndex: number = 0;
    transformationName: string = '';
    transformations: Transformation[] = [];

    // connections ->

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getDatasourceTransformations().then(dtr => {
            this.globalVariableService.getTransformations().then(tr => {
                // Set local Vars
                this.datasourceTransformations = dtr.filter(ftr =>
                    ftr.datasourceID == this.selectedDatasource.id
                ).sort( (obj1,obj2) => {
                    if (obj1.sequence > obj2.sequence) {
                        return 1;
                    };
                    if (obj1.sequence < obj2.sequence) {
                        return -1;
                    };
                    return 0;
                });
                this.transformations = tr.slice();

                // Fill name for display
                this.datasourceTransformations.forEach(dtr => {
                    this.transformations.forEach(tr => {
                        if (dtr.transformationID == tr.id) {
                            dtr.name = tr.name;
                        };
                    });
                });

                if (this.datasourceTransformations.length > 0) {
                    this.clickRow(0, this.datasourceTransformations[0].id);
                };
                console.warn('xx tr', this.datasourceTransformations, this.transformations, this.selectedDatasource)
            });
        });
    }

    clickSelect(ev: any) {
        // Select a Transformation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelect', '@Start');

        // Set seletected index - used for highlighting row
        console.warn('xx ev', ev.target.value)
    }

    clickSelectedTransformation() {
        // Click on Transformation 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedTransformation', '@Start');
        
        // Select the Tr master record
        this.selectedTransformationRowIndex = this.transformations.findIndex(tr => 
            tr.name == this.transformationName
        );
        console.warn('xx clickSelectedTransformation',this.selectedTransformationRowIndex, this.transformationName)
        this.clickFillParameters(this.selectedTransformationRowIndex, -1);
    }

    clickRow(index: number, id: number) {
        // Click on DatasourceTransformation row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedDataRowIndex = index;

        // Select the Tr master record
        this.selectedTransformationRowIndex = this.transformations.findIndex(tr => tr.id == 
            this.datasourceTransformations[this.selectedDataRowIndex].transformationID
        );
        console.warn('xx crow selectedTransformationRowIndex ', this.selectedTransformationRowIndex)
        console.warn('xx crow tr-record', this.transformations[this.selectedTransformationRowIndex])
        console.warn('xx crow selectedDataRowIndex ', this.selectedDataRowIndex)
        console.warn('xx crow dsTr record ', this.datasourceTransformations[this.selectedDataRowIndex])

        this.clickFillParameters(this.selectedTransformationRowIndex, this.selectedDataRowIndex);
    }
    
    clickFillParameters(transformationRowIndex, dataRowIndex) {
        // Fill the Paramers, based on what was selected
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFillParameters', '@Start');
    
        // Reset
        this.parameter1Placeholder = '';
        this.parameter1Title = '';
        this.parameter1Value = '';
        this.parameter1Heading = '';

        this.parameter2Placeholder = '';
        this.parameter2Title = '';
        this.parameter2Value = '';
        this.parameter2Heading = '';

        this.parameter3Placeholder = '';
        this.parameter3Title = '';
        this.parameter3Value = '';
        this.parameter3Heading = '';

        this.parameter4Placeholder = '';
        this.parameter4Title = '';
        this.parameter4Value = '';
        this.parameter4Heading = '';

        this.parameter5Placeholder = '';
        this.parameter5Title = '';
        this.parameter5Value = '';
        this.parameter5Heading = '';

        this.parameter6Placeholder = '';
        this.parameter6Title = '';
        this.parameter6Value = '';
        this.parameter6Heading = '';

        // Fill values
        if (dataRowIndex >= 0) {
            
            for (var i = 0; i < this.datasourceTransformations[dataRowIndex].parameterValue.length; i++) {
                if (i == 0 ) {
                    this.parameter1Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
                if (i == 1 ) {
                    this.parameter2Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
                if (i == 2 ) {
                    this.parameter3Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
                if (i == 3 ) {
                    this.parameter4Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
                if (i == 4 ) {
                    this.parameter5Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
                if (i == 5 ) {
                    this.parameter6Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
            };
        };

        // Fill the rest, ie field headers, title and placeholders
        for (var i = 0; i < this.transformations[transformationRowIndex].parameterHeading.length; i++) {
            if (i == 0 ) {
                this.parameter1Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
            if (i == 1 ) {
                this.parameter2Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
            if (i == 2 ) {
                this.parameter3Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
            if (i == 3 ) {
                this.parameter4Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
            if (i == 4 ) {
                this.parameter5Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
            if (i == 5 ) {
                this.parameter6Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
        };

        for (var i = 0; i < this.transformations[transformationRowIndex].parameterTitle.length; i++) {
            if (i == 0 ) {
                this.parameter1Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
            if (i == 1 ) {
                this.parameter2Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
            if (i == 2 ) {
                this.parameter3Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
            if (i == 3 ) {
                this.parameter4Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
            if (i == 4 ) {
                this.parameter5Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
            if (i == 5 ) {
                this.parameter6Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
        };
    
        for (var i = 0; i < this.transformations[transformationRowIndex].parameterPlaceholder.length; i++) {
            if (i == 0 ) {
                this.parameter1Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
            if (i == 1 ) {
                this.parameter2Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
            if (i == 2 ) {
                this.parameter3Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
            if (i == 3 ) {
                this.parameter4Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
            if (i == 4 ) {
                this.parameter5Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
            if (i == 5 ) {
                this.parameter6Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
        };

    }

    clickMoveUp(index: number, id: number) {
        // Move Transformation Up
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveUp', '@Start');

        // Nothing to do
        if (index == 0) {
            return;
        };

        // Get 2 records
        let previousSequence: number = this.datasourceTransformations[index - 1].sequence;
        let selectedSequence: number = this.datasourceTransformations[index].sequence;

        // Swap Sequence, and sort again
        this.datasourceTransformations[index - 1].sequence = selectedSequence;
        this.datasourceTransformations[index].sequence = previousSequence;

        // Save to DB
        this.globalVariableService.saveDatasourceTransformation(
            this.datasourceTransformations[index - 1]);
        this.globalVariableService.saveDatasourceTransformation(
            this.datasourceTransformations[index]);

        // Resort
        this.datasourceTransformations = this.datasourceTransformations.sort( (obj1,obj2) => {
            if (obj1.sequence > obj2.sequence) {
                return 1;
            };
            if (obj1.sequence < obj2.sequence) {
                return -1;
            };
            return 0;
        });

        // Highlight same row
        let currentIndex: number = this.datasourceTransformations.findIndex(dtr =>
            dtr.id == id
        );
        this.clickRow(currentIndex, id);
    }
    
    clickMoveDown(index: number, id: number) {
        // Move Transformation Down
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveDown', '@Start');

        // Nothing to do
        if (index == (this.datasourceTransformations.length - 1) )  {
            return;
        };

        // Get 2 records
        let selectedSequence: number = this.datasourceTransformations[index].sequence;
        let nextSequence: number = this.datasourceTransformations[index + 1].sequence;

        // Swap Sequence, and sort again
        this.datasourceTransformations[index + 1].sequence = selectedSequence;
        this.datasourceTransformations[index].sequence = nextSequence;

        // Save to DB
        this.globalVariableService.saveDatasourceTransformation(
            this.datasourceTransformations[index]);
        this.globalVariableService.saveDatasourceTransformation(
            this.datasourceTransformations[index + 1]);

        // Resort
        this.datasourceTransformations = this.datasourceTransformations.sort( (obj1,obj2) => {
            if (obj1.sequence > obj2.sequence) {
                return 1;
            };
            if (obj1.sequence < obj2.sequence) {
                return -1;
            };
            return 0;
        });

        // Highlight same row
        let currentIndex: number = this.datasourceTransformations.findIndex(dtr =>
            dtr.id == id
        );
        this.clickRow(currentIndex, id);
    }
    
    clickEdit(index: number, id: number) {
        // Edit Transformation 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        this.adding = true;
        
    }
    
    clickDelete(index: number, id: number) {
        // Delete Transformation 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

    }

    clickAdd() {
        // Start Adding a new Transformation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        this.adding = true;
    }

    clickSave() {
        // Save Transformation and its parameters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.adding = false;
    }
    
    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataTransformationClosed.emit(action);

    }

}


