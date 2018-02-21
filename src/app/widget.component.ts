/*
 * Dashboard
 */

// From Angular
import { AfterViewInit }              from '@angular/core';
import { Component }                  from '@angular/core';
import { ContentChildren }            from '@angular/core';
import { Directive }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { HostBinding }                from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { QueryList }                  from '@angular/core';
import { Renderer }                   from '@angular/core';
import { Renderer2 }                  from '@angular/core';
import { ViewChild }                  from '@angular/core';
import { ViewChildren }               from '@angular/core';

import { Observable} from 'rxjs'
// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { Widget }                     from './models'

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';
import { BoxPlotStyle } from 'vega-lite/build/src/compositemark/boxplot';

// Own Services

// Own Components


@Component({
    selector: 'widget',
    templateUrl: './widget.component.html',
    styleUrls: ['./widget.component.css']
})
export class WidgetComponent {
    @Input() widgets: Widget[];
    @Input() showDataQuality: boolean;
    @Input() showComments: boolean;

    @ViewChildren('widgetDOM')  widgetDOM: QueryList<ElementRef>;
    @ViewChildren('widgetContainerDOM')  widgetContainerDOM: QueryList<ElementRef>;

    editMode: boolean;
    endWidgetNumber: number;
    isBusyResizing: boolean = false;
    refreshGraphs: boolean = false;
    startX: number;
    startY: number;
    startWidgetNumber: number;
    selectedWidgetIDs: number[] = [];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,

    ) {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'constructor', '@Start');

    }
    ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.duplicateWidget.subscribe(i => {
            if (i) {
                this.duplicateWidget();
            }
        });

        this.globalVariableService.editMode.subscribe(i =>
            {
                this.editMode = i;
            }
        );

    }
    ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
    }

    ngAfterViewChecked() {
        //
        // TODO - switch on later, this fires ALL the time ...
        // this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewChecked', '@Start');

        if (!this.refreshGraphs) {
            this.refreshGraphs = true;
            this.refreshWidgets();
        }
    }

    clickWidgetContainer(index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetContainer', '@Start');

        console.log("widget clickWidgetContainer @start", this.widgets[0].datasourceID);

        if (!this.editMode) {
            this.globalVariableService.statusBarMessage.next(
             {
                message: 'Not in Edit Mode',
                uiArea: 'StatusBar',
                classfication: 'Warning',
                timeout: 3000,
                defaultMessage: ''
             }
            )
            return;
        }
        this.globalVariableService.statusBarMessage.next(null);


        this.widgets[index].isSelected = !this.widgets[index].isSelected;

        // If now selected, add to the global selected list - if not already there
        let pos: number = this.globalVariableService.selectedWidgetIDs.indexOf(this.widgets[index].id);
        if (this.widgets[index].isSelected) {
            if (pos < 0) {
                this.globalVariableService.selectedWidgetIDs.push(this.widgets[index].id);
            }
        } else {
            if (pos >= 0) {
                this.globalVariableService.selectedWidgetIDs.splice(pos,1);
            }
        }

    }

    clickWidget(index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidget', '@Start');

        console.log("widget clickWidget @start", this.widgets[0].datasourceID);

        if (!this.editMode) {
            return;
        }

    }

    refreshWidgets(start: number = -1, end: number = -1, arrID: number[] = []) {
        // Refreshes given range of W
        // start = start index, base 0.  end = last index.  Both are optional, which will
        // refresh all W.  arrID is an optional string of IDs, used to refresh specific ones
        // only.  So refreshWidgets() will refresh all, refreshWidgets(2) will refresh the W
        // from index 2 to the end, refreshWidgets(4,5) will refresh Ws in index position
        // 4 and 5.  refreshWidgets(1,-1,[1,8]) will refresh W in position 1 and 8.
        this.globalFunctionService.printToConsole(this.constructor.name,'refreshWidgets', '@Start');

        // console.log('xx refreshWidgets start len', this.widgets.length, this.widgetContainerDOM.length, this.widgets, this.widgetContainerDOM)

        this.startWidgetNumber = 0;
        // TODO - Bug: new W not in DOM ... !!!
        this.endWidgetNumber = this.widgetContainerDOM.length;
        if (end > this.widgetContainerDOM.length) {end = this.widgetContainerDOM.length};
        if (start > -1) {
            this.startWidgetNumber = start;
            if (end > start) {
                this.endWidgetNumber = end;
            } else {
                this.endWidgetNumber = start + 1;
            }
        }

        // console.log('xx str end', this.startWidgetNumber, this.endWidgetNumber)

        for (var i = this.startWidgetNumber; i < this.endWidgetNumber; i++) {

            // console.log('xx refreshWidgets loop i: ', i, this.widgets[i].id, arrID, arrID.indexOf(this.widgets[i].id), arrID.length)
            if ( (arrID.length > 0  && arrID.indexOf(this.widgets[i].id) >= 0)  ||
                arrID.length == 0 ) {
                // String of IF statements that caters for different visualGrammars
                if (this.widgets[i].visualGrammar == 'Vega-Lite') {

                    console.log('this.widgets[i].graphSpecification', this.widgets[i].graphSpecification)
                    // Use the spec inside the Widget, or the properties
                    let definition: any = null;
                    if (this.widgets[i].graphSpecification != ''  &&
                        this.widgets[i].graphSpecification != null) {
                            definition = this.widgets[i].graphSpecification;

                            // TODO - fix this, as datalib reads children as object object ...
                            definition = definition.replace(/@/g,'"');
                            // "data": {"url": "../assets/vega-datasets/cars.json"},

                            definition = {
                                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                                "description": "Shows the relationship between horsepower and the numbver of cylinders using tick marks.",
                                "data": {"url": "../assets/vega-datasets/cars.json"},
                                "mark": "tick",
                                "encoding": {
                                "x": {"field": "Horsepower", "type": "quantitative"},
                                "y": {"field": "Cylinders", "type": "ordinal"}
                                }
                            }

                            definition = {
                                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                                "description": "A bar chart showing the US population distribution of age groups and gender in 2000.",
                                "data": { "url": "../assets/vega-datasets/population.json"},
                                "transform": [
                                {"filter": "datum.year == 2000"},
                                {"calculate": "datum.sex == 2 ? 'Female' : 'Male'", "as": "gender"}
                                ],
                                "mark": "bar",
                                "encoding": {
                                "x": {
                                    "field": "age", "type": "ordinal",
                                    "scale": {"rangeStep": 17}
                                },
                                "y": {
                                    "aggregate": "sum", "field": "people", "type": "quantitative",
                                    "axis": {"title": "population"},
                                    "stack": null
                                },
                                "color": {
                                    "field": "gender", "type": "nominal",
                                    "scale": {"range": ["#e377c2","#1f77b4"]}
                                },
                                "opacity": {"value": 0.7}
                                }
                            }

                            definition = {
                                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                                "data": { "url": "../assets/vega-datasets/github.csv"},
                                "mark": "circle",
                                "encoding": {
                                "y": {
                                    "field": "time",
                                    "type": "ordinal",
                                    "timeUnit": "day"
                                },
                                "x": {
                                    "field": "time",
                                    "type": "ordinal",
                                    "timeUnit": "hours"
                                },
                                "size": {
                                    "field": "count",
                                    "type": "quantitative",
                                    "aggregate": "sum"
                                }
                                }
                            }

                            console.log('definition', definition)
                    } else {
                        definition = this.globalVariableService.createVegaLiteSpec(this.widgets[i]);
                    }
                    let specification = compile(definition).spec;
                    let view = new View(parse(specification));
                    view.renderer('svg')
                        .initialize( this.widgetDOM.toArray()[i].nativeElement)
                        .hover()
                        .run()
                        .finalize();
                    console.log('TEST refreshWidgets render done', specification)
                } else {
                    alert('The visualGrammar of widget ' + i.toString() + ' is not == Vega-Lite' )
                };
            };
        }
        console.log('TEST refreshWidgets end')
    }

    clickResizeDown(ev: MouseEvent, index: number) {
        // Mouse down event during resize, registers original x and y coordinates
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeDown', '@Start');

        if (!this.editMode) {
            return;
        }

        // Indicate that we are resizing - thus block the dragging action
        this.isBusyResizing = true;
        this.startX = ev.x;
        this.startY = ev.y;

    }

    clickResizeUp(ev: MouseEvent, 
        index: number, 
        resizeTop: boolean, 
        resizeRight: boolean,
        resizeBottom: boolean,
        resizeLeft: boolean) {
        // Mouse up click during resize event.  Change x and y coordinates according to the 
        // movement since the resize down event
        //   ev - mouse event
        //   index - index of the W to resize
        //   resizeTop, -Right, -Bottom, -Left - True to move the ... boundary.
        //     Note: 1. both the current and globalVar vars are changed
        //           2. Top and Left involves changing two aspects, ie Left and Width 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeUp', '@Start');

        if (!this.editMode) {
            return;
        }

        // Top moved: adjust the height & top
        if (resizeTop) {
            this.widgets[index].containerTop =
                this.widgets[index].containerTop - this.startY + ev.y;
            this.globalVariableService.currentWidgets[index].containerTop =
                this.widgets[index].containerTop;

            this.widgets[index].containerHeight =
                this.widgets[index].containerHeight - ev.y + this.startY;
            this.globalVariableService.currentWidgets[index].containerHeight =
                this.widgets[index].containerHeight;

            this.widgets[index].graphHeight =
                this.widgets[index].graphHeight - ev.y + this.startY;
            this.globalVariableService.currentWidgets[index].graphHeight =
                this.widgets[index].graphHeight;
        };

        // Right moved: adjust the width
        if (resizeRight) {
            this.widgets[index].containerWidth =
                this.widgets[index].containerWidth - this.startX + ev.x;
            this.globalVariableService.currentWidgets[index].containerWidth =
                this.widgets[index].containerWidth;

            this.widgets[index].graphWidth =
                this.widgets[index].graphWidth - this.startX + ev.x;
            this.globalVariableService.currentWidgets[index].graphWidth =
                this.widgets[index].graphWidth;
        };

        // Bottom moved: adjust the height
        if (resizeBottom) {
            this.widgets[index].containerHeight =
                this.widgets[index].containerHeight - this.startY + ev.y;
            this.globalVariableService.currentWidgets[index].containerHeight =
                this.widgets[index].containerHeight;

            this.widgets[index].graphHeight =
                this.widgets[index].graphHeight - this.startY + ev.y;
            this.globalVariableService.currentWidgets[index].graphHeight =
                this.widgets[index].graphHeight;
        };

        // Left moved: adjust the width & left
        if (resizeLeft) {
            this.widgets[index].containerLeft =
                this.widgets[index].containerLeft - this.startX + ev.x;
            this.globalVariableService.currentWidgets[index].containerLeft =
                this.widgets[index].containerLeft;

            this.widgets[index].containerWidth =
                this.widgets[index].containerWidth - ev.x + this.startX;
            this.globalVariableService.currentWidgets[index].containerWidth =
                this.widgets[index].containerWidth;

            this.widgets[index].graphWidth =
                this.widgets[index].graphWidth - ev.x + this.startX;
            this.globalVariableService.currentWidgets[index].graphWidth =
                this.widgets[index].graphWidth;
        };

        this.refreshWidgets(index)

        // console.log('clickResizeUp this.globalVariableService.widgets[index].value',
        //     index, this.globalVariableService.widgets.value[index])

        this.widgets[index].nrButtonsToShow =
            (this.widgets[index].containerWidth - 50) / 22;

    }

    clickWidgetContainerDragStart(ev: MouseEvent, index: number) {
        // Register start of W container event
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetContainerDragStart', '@Start');

        if (!this.editMode) {
            return;
        }

        // Is busy with resizing, ignore this
        if (this.isBusyResizing) {
            return;
        };

        this.startX = ev.x;
        this.startY = ev.y;
    }

    clickWidgetContainerDragEnd(ev: MouseEvent, index: number) {
        // Move the W container at the end of the drag event
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetContainerDragEnd', '@Start');

        if (!this.editMode) {
            return;
        }

        // Is busy with resizing, ignore this
        if (this.isBusyResizing) {

            // Done with resizing
            this.isBusyResizing = false;
            return;
        };

        // Reset current and globalVar values
        this.widgets[index].containerLeft =
            this.widgets[index].containerLeft - this.startX + ev.x;
        this.globalVariableService.currentWidgets[index].containerLeft =
            this.widgets[index].containerLeft;

        this.widgets[index].containerTop =
            this.widgets[index].containerTop - this.startY + ev.y;
        this.globalVariableService.currentWidgets[index].containerTop =
            this.widgets[index].containerTop;

    }

    clickAlignTop() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAlignTop', '@Start');

        if (this.globalVariableService.selectedWidgetIDs.length < 2) {return}

        let x: number = this.widgets[0].containerTop;

        for (var i = 1; i < this.globalVariableService.selectedWidgetIDs.length; i++) {
            this.widgets[i].containerTop = x;
        }
    }

    showWidgetForSlicer(id: number, datasourceID: number, datasetID: number) {
        // Returns True if a Widget is related to the selected Sl(s)
        // TODO - put back, but this fires ALL the time ...
        // this.globalFunctionService.printToConsole(this.constructor.name,'showWidgetForSlicer', '@Start');

        // Get list of selected Sl
        let result: boolean = false;
        this.globalVariableService.currentSlicers.forEach(sl => {
            if (sl.isSelected) {
                if (sl.datasourceID == datasourceID  &&  sl.datasetID == datasetID) {
                    result = true;
                };
            };
        });

        return result;
    }

    duplicateWidget() {
        // Duplicates all selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'duplicateWidget', '@Start');
     
        // console.log('xx duplicateWidget', this.globalVariableService.currentWidgets)
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.isSelected) {

                // TODO - improve this when using a DB!
                let newID: number = 1;
                let ds: number[] = [];
                this.globalVariableService.widgets.forEach(w => {
                    ds.push(w.id);
                });
                newID = Math.max(...ds) + 1;
                // console.log('xx newID', newID, ds)
                // Make a deep copy
                let localWidget= Object.assign({}, w);
                localWidget.id = newID;
                localWidget.isSelected = false;
                localWidget.containerLeft = localWidget.containerLeft + 20;
                localWidget.containerTop = localWidget.containerTop + 20;

                // Add to all and current W
                this.globalVariableService.widgets.push(localWidget);
                this.globalVariableService.currentWidgets.push(localWidget);

                // Refresh the Graph inside the Container
                this.refreshGraphs = false;
            };
        });
    }
}