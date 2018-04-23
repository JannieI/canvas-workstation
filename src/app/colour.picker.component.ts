import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector: 'colour-picker',
    templateUrl: './colour.picker.component.html',
    styleUrls: ['./colour.picker.component.css']
})
export class ColourPickerComponent implements OnInit {

    @Input() callingRoutine: string;
    @Input() selectedColor: string;

    colourPickerClosed: boolean = true;
    constructor(
      private globalFunctionService: GlobalFunctionService,
      private globalVariableService: GlobalVariableService,
    ) { }

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

    clickColor(color: any, p1: number, p2: number) {
        // User clicks a colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickColor', '@Start');

        this.selectedColor = color;
        // this.colourPickerClosed = !this.colourPickerClosed;
        console.log('xx colourPicker', this.callingRoutine, this.selectedColor, p1, p2)

        // Return, and let calling routine know
        this.globalVariableService.colourPickerClosed.next(
            {
                callingRoutine: this.callingRoutine,
                selectedColor: color
            }
        )
    }

    mouseOverColor(color: any) {
        // Hover over a colour
        this.globalFunctionService.printToConsole(this.constructor.name,'mouseOverColor', '@Start');

        this.selectedColor = color;

        console.log('xx colourPicker', color)
    }

    mouseOutMap() {
        // Mouse leaves color map
        this.globalFunctionService.printToConsole(this.constructor.name,'mouseOutMap', '@Start');

        this.selectedColor = 'transparent';
        console.log('xx colourPicker OutMap')
    }

  }
