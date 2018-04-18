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
import { Datasource }                 from './models';
import { Widget }                     from './models';
import { WidgetCheckpoint }           from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions
import { compile, transform }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';

const graphHeight: number = 260;
const graphWidth: number = 420;


@Component({
    selector: 'widget-editor',
    templateUrl: './widget.editor.component.html',
    styleUrls: ['./widget.editor.component.css']
  })
  export class WidgetEditorComponent implements OnInit {

    @Input() newWidget: boolean;
    @Input() showDatasourcePopup: boolean;
    @Input() selectedWidget: Widget;
    @Input() newWidgetContainerLeft: number;
    @Input() newWidgetContainerTop: number;

    @Output() formWidgetEditorClosed: EventEmitter<Widget> = new EventEmitter();
    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    clickedButtonAggregateNo: boolean = false;
    colField: string = 'Drag a field here ...';
    containerHasTitle: boolean = true;
    currentData: any = [];
    currentDatasources: Datasource[] = null;               // Current DS for the selected W
    dataFieldNames: string[] = [];
    dataFieldLengths: number[] = [];
    dataFieldTypes: string[] = [];
    draggedField: string = '';
    dragoverCol: boolean = false;
    dragoverRow: boolean = false;
    dragoverColor: boolean = false;
    filterPivotFields: string = '';
    graphColorField: string = 'Drag a field here ...';
    graphCols: string[];
    graphRows: string[];
    graphColor: string[];
    graphTypeFieldY: string[] =[];
    graphTypeFieldX: string[] =[];
    graphTypeFieldColor: string[] =[];
    hasClicked: boolean = false;
    localWidget: Widget;                            // W to modify, copied from selected
    opened: boolean = true;
    presentationMode: boolean;
    rowField: string = 'Drag a field here ...';
    selectedViz: string = 'Graph';
    showColFieldAdvanced: boolean = false;
    showColFieldAdvancedArea: boolean = false;
    showColourDeleteIcon: boolean = false;
    showColumnDeleteIcon: boolean = false;
    showRowFieldAdvanced: boolean = false;
    showRowFieldAdvancedArea: boolean = false;
    showRowDeleteIcon: boolean = false;
    showType: boolean = false;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        // ngOnInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        if (this.newWidget) {
            // Get DS
            this.currentDatasources = this.globalVariableService.currentDatasources.slice();

            // Create new W
            // this.localWidget = this.globalVariableService.widgetTemplate;
            // let cloned = source.map(x => Object.assign({}, x));
            this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
            this.localWidget.widgetType = 'Graph';
            if (this.newWidgetContainerLeft > 0) {
                this.localWidget.containerLeft = this.newWidgetContainerLeft;
            };
            if (this.newWidgetContainerTop > 0) {
                this.localWidget.containerTop = this.newWidgetContainerTop;
            };
        } else {

            this.localWidget = Object.assign({}, this.selectedWidget);

            // TODO - handle properly and close form
            if (this.localWidget.datasourceID == 0) {
                alert('No Widget was selected, or could not find it in glob vars')
            };

            // Get DS
            this.currentDatasources = this.globalVariableService.currentDatasources
                .filter(ds => ds.id == this.localWidget.datasourceID)

            // TODO - handle properly and close form
            if (this.currentDatasources.length != 1) {
                alert('Datasource not found in global currentDatasources')
            };

            // Add to axis
            if (this.localWidget.graphXfield != ''   &&   this.localWidget.graphXfield != null) {
                this.showColumnDeleteIcon = true;
                this.colField = this.localWidget.graphXfield;
                this.showColFieldAdvanced = true;

            } else {
                this.showColumnDeleteIcon = false;
                this.colField = '';
            };

            if (this.localWidget.graphYfield != ''   &&   this.localWidget.graphYfield != null) {
                this.showRowDeleteIcon = true;
                this.rowField = this.localWidget.graphYfield;
                this.showRowFieldAdvanced = true;
            } else {
                this.showRowDeleteIcon = false;
                this.rowField = '';
            };

            if (this.localWidget.graphColorField != ''   &&   this.localWidget.graphColorField != null) {
                this.showColourDeleteIcon = true;
                this.graphColorField = this.localWidget.graphColorField;
            } else {
                this.showColourDeleteIcon = false;
                this.graphColorField = '';
            };

            // Get local vars - easier for ngFor
            this.containerHasTitle = this.localWidget.containerHasTitle;
            this.dataFieldNames = this.currentDatasources[0].dataFields;
            this.dataFieldLengths = this.currentDatasources[0].dataFieldLengths;
            this.dataFieldTypes = this.currentDatasources[0].dataFieldTypes;

        }

        this.globalVariableService.presentationMode.subscribe(
            pres => this.presentationMode = pres
        );
    }

    ngAfterViewInit() {
        // ngAfterViewInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

        // Render if Editing an existing one
        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        if (!this.newWidget) {
            this.renderGraph(definition);
        }

    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        // this.globalVariableService.presentationMode.unsubscribe();
    }

    renderGraph(definition: any) {
        // Render the graph on the form
        this.globalFunctionService.printToConsole(this.constructor.name,'renderGraph', '@Start');

        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        let width: number = 470;
        let height: number = 300;
        // Reduce width of legend by length of selected field
        if (this.localWidget.graphColorField != ''  &&  this.localWidget.graphColorField != null) {
            let reduce: number = 30;

            // Find the length, then say 8px per character + colour blockie displayed
            // TODO - do this better !
            for (var i = 0; i < this.dataFieldNames.length; i++) {
                if (this.localWidget.graphColorField == this.dataFieldNames[i]) {
                    reduce = (8 * this.dataFieldLengths[i]) + 35;
                }
            };
            width = width - reduce;
        }
        // Note: trick to set .width and .height explicitly, thus W.graphWidth not used
        view.renderer('svg')
            .width(width)
            .height(height)
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();
            this.renderer.setElementStyle(this.dragWidget.nativeElement,
                'left', "200px");
    }

  	clickClose(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetEditorClosed.emit(null);
    }

    clickSave(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Update new/edit
        this.localWidget.containerHasTitle = this.containerHasTitle;

        if (this.newWidget) {

            if (this.localWidget.graphColorField != ''
                &&  this.localWidget.graphColorField != null) {
                this.localWidget.graphWidth = this.localWidget.containerWidth - 130;
            } else {
                this.localWidget.graphWidth = this.localWidget.containerWidth - 60;
            };
            
            // TODO - improve this when using a DB!
            let newID: number = 1;
            let wsIDs: number[]=[];
            for (var i = 0; i < this.globalVariableService.widgets.length; i++) {
                wsIDs.push(this.globalVariableService.widgets[i].id)
            };
            if (wsIDs.length > 0) {
                newID = Math.max(...wsIDs) + 1;
            };
            this.localWidget.id = newID;
 
            console.log('xx wIDs', wsIDs, newID)
            // Get Checkpoint info for ALL W, not only current one - AFTER ID collected
            // TODO - fix when using DB
            // TODO - this code is NOT DRY ~ getWidget() code in global var
            let tempChk: WidgetCheckpoint[] = this.globalVariableService.widgetCheckpoints
                .filter(wc => 
                    wc.dashboardID == this.localWidget.dashboardID
                    &&
                    wc.widgetID == this.localWidget.id
            );

            if (tempChk.length > 0) {
                this.localWidget.showCheckpoints = false;
                this.localWidget.checkpointIDs = [];
                this.localWidget.currentCheckpoint = 0;
                this.localWidget.lastCheckpoint = tempChk.length - 1;
                
                for (var x = 0; x < tempChk.length; x++) {
                    this.localWidget.checkpointIDs.push(tempChk[x].id);
                };

            } else {
                this.localWidget.showCheckpoints = false;
                this.localWidget.checkpointIDs = [];
                this.localWidget.currentCheckpoint = 0;
                this.localWidget.lastCheckpoint = -1;
            };

            // Update local and global vars
            this.localWidget.dashboardTabIDs.push(this.globalVariableService.
                currentDashboardInfo.value.currentDashboardTabID);

            this.globalVariableService.addWidget(this.localWidget).then(res => {

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Graph Added',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                // Update global W and DB
                this.formWidgetEditorClosed.emit(this.localWidget);

            });

        } else {
            if (this.selectedWidget.graphColorField != ''
                &&  this.selectedWidget.graphColorField != null) {
                    if (this.localWidget.graphColorField == ''  ||  this.localWidget.graphColorField == null) {
                        this.localWidget.graphWidth = this.selectedWidget.graphWidth + 70;
                    };
            };
            if (this.selectedWidget.graphColorField == ''
                ||  this.selectedWidget.graphColorField == null) {
                    if (this.localWidget.graphColorField != ''
                        &&  this.localWidget.graphColorField != null) {
                        this.localWidget.graphWidth = this.selectedWidget.graphWidth - 70;
                    };
            };
 
            // Update global W and DB
            this.globalVariableService.saveWidget(this.localWidget).then(res => {

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Graph Saved',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                this.formWidgetEditorClosed.emit(this.localWidget);
                
            })
            
        };
    }

    dragstartField(ev) {
        // Event trigger when start Dragging a Field in the list
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartField', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
    }

    dragoverColumn(ev, actionName: string) {
        // Event trigger when a field is dragged over Column element
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColumn', '@Start');

        ev.preventDefault();
    }

    dragoverRows(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverRows', '@Start');

        ev.preventDefault();
    }

    dragoverColors(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Color field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColors', '@Start');

        ev.preventDefault();
    }

    dropColumn(ev) {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColumn', '@Start');
        ev.preventDefault();

        // Show X icon
        this.showColumnDeleteIcon = true;

        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        this.colField = this.draggedField;
        this.localWidget.graphXfield = this.draggedField;
        this.localWidget.graphXaxisTitle = this.draggedField;

        let fieldType:string = this.getFieldType(this.draggedField);
        this.graphTypeFieldX = this.allowedGraphTypeField(fieldType);
        this.localWidget.graphXtype = this.defaultGraphTypeField(fieldType);

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.showColFieldAdvanced = true;
        this.renderGraph(definition);

    }

    dropRow(ev) {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropRow', '@Start');

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        // Show X icon
        this.showRowDeleteIcon = true;

        var data = ev.dataTransfer.getData("text");
        this.rowField = this.draggedField;
        this.localWidget.graphYfield = this.draggedField;
        this.localWidget.graphYaxisTitle = this.draggedField;

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(this.draggedField);
        this.graphTypeFieldY = this.allowedGraphTypeField(fieldType);
        this.localWidget.graphYtype = this.defaultGraphTypeField(fieldType);

        // TODO - REMOVE when this is done via forms !!!
        // if (this.localWidget.graphYtype == 'quantitative') {
        //     this.localWidget.graphYtype = 'ordinal';
        // };

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.showRowFieldAdvanced = true;
        this.renderGraph(definition);
    }

    dropColor(ev) {
        // Event trigger when the dragged Field is dropped the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColor', '@Start');

        // Show X icon
        this.showColourDeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.graphColorField = this.draggedField;
        this.localWidget.graphColorField = this.draggedField

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(this.draggedField);
        this.graphTypeFieldColor = this.allowedGraphTypeField(fieldType);
        this.localWidget.graphColorType = this.defaultGraphTypeField(fieldType);

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    clickClearColumnField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColumnField', '@Start');

        // Show X icon
        this.showColumnDeleteIcon = false;
        this.colField = '';
        this.localWidget.graphXfield = null;
        this.localWidget.graphXaxisTitle = null;
        this.localWidget.graphXaggregate = null;
        this.localWidget.graphXtimeUnit = null;
        this.localWidget.graphXtype = null;

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    clickClearRowField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearRowField', '@Start');

        // Show X icon
        this.showRowDeleteIcon = false;
        this.rowField = '';
        this.localWidget.graphYfield = null;
        this.localWidget.graphYaxisTitle = null;
        this.localWidget.graphYaggregate = null;
        this.localWidget.graphYtimeUnit = null;
        this.localWidget.graphYtype = null;

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    clickClearColourField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColourField', '@Start');

        // Show X icon
        this.showColourDeleteIcon = false;
        this.graphColorField = '';
        this.localWidget.graphColorField = null;
        this.localWidget.graphColorType = null;

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    dragenterColumn(ev, actionName: string) {
        // Event trigger when dragged field enters Column
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColumn', '@Start');

        ev.preventDefault();
        this.dragoverCol = true;
        this.dragoverRow = false;
        this.dragoverColor = false;
    }

    dragleaveColumn(ev, actionName: string) {
        // Event trigger when dragged field leave Column
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveColumn', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
    }

    dragenterRow(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterRow', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
        this.dragoverRow = true;
        this.dragoverColor = false;
    }

    dragoleaveRow(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoleaveRow', '@Start');

        ev.preventDefault();
        this.dragoverRow = false;
    }

    dragenterColors(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColors', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
        this.dragoverRow = false;
        this.dragoverColor = true;
    }

    dragleaveColors(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveColors', '@Start');

        ev.preventDefault();
        this.dragoverColor = false;
    }

    clickCloseAdvancedX(action) {
        // Closes the Advanced popup for the Xaxis
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCloseAdvancedX', '@Start');

        this.showColFieldAdvancedArea = false;
    }

    clickApplyAdvancedX(action) {
        // Apply the changes specified in the Advanced popup for the Xaxis, then close it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickApplyAdvancedX', '@Start');

        this.showColFieldAdvancedArea = false;
    }

    clickCloseAdvancedY(action) {
        // Closes the Advanced popup for the Yaxis
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCloseAdvancedY', '@Start');

        this.showRowFieldAdvancedArea = false;
    }

    clickApplyAdvancedY(action) {
        // Apply the changes specified in the Advanced popup for the Yaxis, then close it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickApplyAdvancedY', '@Start');

        this.showRowFieldAdvancedArea = false;

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    clickShowColFieldAdvanced(){
        // Shows the Advanced popup for Cols
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowColFieldAdvanced', '@Start');

        this.showColFieldAdvancedArea = true;
    }

    clickShowRowFieldAdvanced(){
        // Shows the Advanced popup for Rows
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowRowFieldAdvanced', '@Start');

        this.showRowFieldAdvancedArea = true;
    }

    clickDatasource(index: number, name: string) {
        // Show dropdown of DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasource', '@Start');

        // TODO - remove later if not used any longer
    }

    clickIcon(graph: string) {
        // Click a type of graph icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickIcon', '@Start');

        this.showType = false;

        this.localWidget.graphMark = graph;
        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);

    }

    clickDSrow(datasourceID: number, index: number) {
        // Set the selected datasourceID
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSrow', '@Start');

        let dsIndex: number = this.globalVariableService.currentDatasources
            .findIndex(ds => ds.id == datasourceID);

        // Load local arrays for ngFor
        if (dsIndex >= 0) {
            this.dataFieldNames = this.currentDatasources[dsIndex].dataFields;
            this.dataFieldLengths = this.currentDatasources[dsIndex].dataFieldLengths;
            this.dataFieldTypes = this.currentDatasources[dsIndex].dataFieldTypes;
        } else {
            this.dataFieldNames = [];
            this.dataFieldLengths = [];
            this.dataFieldTypes = [];
        };

        // Switch on the preview after the first row was clicked
        this.hasClicked = true;

        // Get latest dSet for the selected DS
        let ds: number[]=[];
        let dSetID: number = 0;

        for (var i = 0; i < this.globalVariableService.currentDatasets.length; i++) {
            if(this.globalVariableService.currentDatasets[i].datasourceID == datasourceID) {
                ds.push(this.globalVariableService.currentDatasets[i].id)
            }
        };
        if (ds.length > 0) {
            dSetID = Math.max(...ds);
        } else {
            // Make proper error handling
            alert('Error: no dataSet in glob vars for DSid = ' + datasourceID)
        };
console.log('xx this.globalVariableService.currentDatasets', this.globalVariableService.currentDatasets)
        // Load first few rows into preview
        this.currentData = this.globalVariableService.currentDatasets.filter(
            d => d.id == dSetID)[0].data.slice(0,5);

        // Fill in data info
        if (this.newWidget) {
            this.localWidget.datasourceID = datasourceID;
            this.localWidget.datasetID = dSetID;
            this.localWidget.graphData = this.globalVariableService.currentDatasets.filter(
                d => d.id == dSetID)[0].data;
        };

    }

    clickContinue(){
        // Continue to design / edit the W, and close the form for the data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickContinue', '@Start');

        this.showDatasourcePopup = false;
    }

    setGraphTypeFieldY(graphYtype: string) {
        // Set the Vega field type of the Y axis
        // TODO - fix event in HTML so that it is triggered here
        this.globalFunctionService.printToConsole(this.constructor.name,'setGraphTypeFieldY', '@Start');

        this.localWidget.graphYtype = graphYtype;
    }

    allowedGraphTypeField(fieldType: string): string[] {
        // Returns a string array of allowed Vega types depending on a given field type
        this.globalFunctionService.printToConsole(this.constructor.name,'allowedGraphTypeField', '@Start');

        if (fieldType == 'string') {
            return ['ordinal'];
        };
        if (fieldType == 'number') {
            return ['ordinal','quantitative'];
        };
    }

    defaultGraphTypeField(fieldType: string): string {
        // Returns the default Vega field type depending a given field types
        this.globalFunctionService.printToConsole(this.constructor.name,'defaultGraphTypeField', '@Start');

        if (fieldType == 'string') {
            return 'ordinal';
        };
        if (fieldType == 'number') {
            return 'quantitative';
        };
    }

    getFieldType(fieldName: string): string {
        // Returns the field type of a given field name
        this.globalFunctionService.printToConsole(this.constructor.name,'getFieldType', '@Start');

        for (var i = 0; i < this.dataFieldNames.length; i++) {
            if (this.dataFieldNames[i] == fieldName) {
                return this.dataFieldTypes[i]
            }
        };
    }

  }