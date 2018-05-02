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
import { Widget }                     from './models';

@Component({
    selector: 'widget-annotations',
    templateUrl: './widget.annotations.component.html',
    styleUrls: ['./widget.annotations.component.css']
})
export class WidgetAnnotationsComponent implements OnInit {

    @Output() formWidgetAnnotationsClosed: EventEmitter<string> = new EventEmitter();
    @Input() selectedWidget: Widget;

    annotation: string;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Set startup info
        this.annotation = this.selectedWidget.annotation;
    }

    clickClose() {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formWidgetAnnotationsClosed.emit();
    }

    clickSave() {
        // Save changes to the last Comment
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.selectedWidget.annotation = this.annotation;
		this.formWidgetAnnotationsClosed.emit();

    }

}