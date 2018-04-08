// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { Widget }                     from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions

@Component({
    selector: 'widget-refresh',
    templateUrl: './widget.refresh.component.html',
    styleUrls: ['./widget.refresh.component.css']
})
export class WidgetRefreshComponent implements OnInit {

    @Input() selectedWidget: Widget[];
    @Output() formWidgetRefreshClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    // currentDatasources: Datasource[];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
    }

  	clickClose() {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');
  	  	this.formWidgetRefreshClosed.emit('Cancel');
    }

    clickSave(id: number) {
        // Close form, and Refresh data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // TODO - actually refresh data
        this.formWidgetRefreshClosed.emit('Refresh');
        
    }

  }
