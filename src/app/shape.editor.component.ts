/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Components
import { ColourPickerComponent }      from './colour.picker.component';

// Our Models
import { CSScolor }                   from './models';
import { DashboardTab }               from './models';
import { Widget }                     from './models';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector: 'shape-edit',
    templateUrl: './shape.editor.component.html',
    styleUrls: ['./shape.editor.component.css']
})
export class ShapeEditComponent implements OnInit {

    @Output() formShapeEditClosed: EventEmitter<Widget> = new EventEmitter();
    @Input() newWidget: boolean;
    @Input() selectedWidget: Widget;

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

    backgroundcolors: CSScolor[];
    bulletIndex: number = 0;                    // Index (position) in [w.Bullets]
    bulletSelectedTab: string;                  // Clicked on Bullets -> Tabname (sequence nr)
    bulletText: string = '';                    // Clicked on Bullets -> Bullet Text
    callingRoutine: string = '';
    colourPickerClosed: boolean = false;
    dashboardTabList: string[];
    hasAutoFocusCircle: boolean = false;
    hasAutoFocusEllipse: boolean = false;
    hasAutoFocusRectangle: boolean = false;
    hasAutoFocusText: boolean = false;
    hasAutoFocusArrow: boolean = false;
    hasAutoFocusArrowThin: boolean = false;
    hasAutoFocusImage: boolean = false;
    hasAutoFocusBullets: boolean = false;
    hasAutoFocusValue: boolean = false;
    hasAutoFocusBrackets: boolean = false;
    editBulletItem: boolean = false;
    localWidget: Widget;                            // W to modify, copied from selected
    selectedColour: string;
    selectedTabIndex: number;
    showArrow: boolean = false;
    showArrowThin: boolean = false;
    showBullets: boolean = false;
    showCircle: boolean = false;
    showEllipse: boolean = false;
    showImage: boolean = false;
    showRectangle: boolean = false;
    showText: boolean = false;
    showTypeDashboard: boolean = false;
    showValue: boolean = false;
    showBrackets: boolean = false;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ){}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Manage colour picker
        this.globalVariableService.colourPickerClosed.subscribe(clp => {

            if (this.localWidget != undefined  &&  clp != null) {

                if (clp.cancelled) {
                    this.colourPickerClosed = false;
                } else {

                    if (clp.callingRoutine == 'ShapeEditorTextColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeTextColour = clp.selectedColor;
                    };

                    if (clp.callingRoutine == 'ShapeEditorCircleLineColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                    };
                    if (clp.callingRoutine == 'ShapeEditorCircleFillColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeFill = clp.selectedColor;
                    };

                    if (clp.callingRoutine == 'ShapeEditorEllipseLineColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                    };
                    if (clp.callingRoutine == 'ShapeEditorEllipseFillColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeFill = clp.selectedColor;
                    };

                    if (clp.callingRoutine == 'ShapeEditorRectangleLineColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                    };
                    if (clp.callingRoutine == 'ShapeEditorRectangleFillColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeFill = clp.selectedColor;
                    };

                    if (clp.callingRoutine == 'ShapeEditorValueLineColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                    };

                    if (clp.callingRoutine == 'ShapeEditorBulletsColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeTextColour = clp.selectedColor;
                    };

                    if (clp.callingRoutine == 'ShapeEditorArrowLineColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                    };

                    if (clp.callingRoutine == 'ShapeEditorArrowFillColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeFill = clp.selectedColor;
                    };

                    if (clp.callingRoutine == 'ShapeEditorArrowThinColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                    };

                };
            };
        });

        // Get setup info
        this.backgroundcolors = this.globalVariableService.backgroundcolors.slice();

        // Create list of Tabs to show: first is 'None', rest is name (sequence nr),
        //   where sequence nr = index + 1 - to look easier for user, 1 = 1st tab, etc
        this.dashboardTabList = ['None'];
        for (var i = 0; i < this.globalVariableService.currentDashboardTabs.length; i++) {
            this.dashboardTabList.push(
                this.globalVariableService.currentDashboardTabs[i].name 
                    + ' (' + (i + 1).toString() + ')');
        };

        // Create new W
         if (this.newWidget) {

            this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.
                value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.
                value.currentDashboardTabID;

            // Standard settings
            this.localWidget.widgetType = 'Shape';
            this.localWidget.containerBackgroundcolor = 'transparent';
            this.localWidget.containerBorder = 'none';
            this.localWidget.containerBorderRadius = '';
            this.localWidget.containerHasTitle = false;
            this.localWidget.containerHeight = 220;
            this.localWidget.containerWidth = 200;
            this.localWidget.shapeBullet = [];
            this.localWidget.shapeBulletStyleType ='square';
            this.localWidget.shapeBulletsOrdered = false;
            this.localWidget.shapeCorner = 15;
            this.localWidget.shapeFill = 'gray';
            this.localWidget.shapeFontFamily = 'Arial, sans serif';
            this.localWidget.shapeIsBold = true;
            this.localWidget.shapeStroke = 'gray';
            this.localWidget.shapeStrokeWidth = '1';
            this.localWidget.shapeSvgHeight = 60;
            this.localWidget.shapeSvgWidth = 60;
            this.localWidget.shapeText = 'The brown fox is tired';
            this.localWidget.shapeTextAlign = 'Left';

        } else {

            // Deep copy
            this.localWidget = Object.assign({}, this.selectedWidget);

            // Refresh the form with the sub type
            this.selectShape(this.localWidget.widgetSubType);

            // Set AutoFocus
            // TODO - this only works for the first Shape opened - and I dont want to use
            // ngAfterViewInit or event emitters.  See this for possible solution:
            //    https://stackoverflow.com/questions/41873893/angular2-autofocus-input-element
            this.hasAutoFocusCircle = false;
            this.hasAutoFocusEllipse = false;
            this.hasAutoFocusRectangle = false;
            this.hasAutoFocusText = false;
            this.hasAutoFocusArrow = false;
            this.hasAutoFocusArrowThin = false;
            this.hasAutoFocusImage = false;
            this.hasAutoFocusBullets = false;
            this.selectedColour = this.localWidget.shapeTextColour;
            this.hasAutoFocusValue = false;
            this.hasAutoFocusBrackets = false;

            if (this.localWidget.widgetSubType == 'Circle') {
                this.hasAutoFocusCircle = true;
            };
            if (this.localWidget.widgetSubType == 'Ellipse') {
                this.hasAutoFocusEllipse = true;
            };
            if (this.localWidget.widgetSubType == 'Rectangle') {
                this.hasAutoFocusRectangle = true;
            };
            if (this.localWidget.widgetSubType == 'Text') {
                this.hasAutoFocusText = true;
            };
            if (this.localWidget.widgetSubType == 'Arrow') {
                this.hasAutoFocusArrow = true;
            };
            if (this.localWidget.widgetSubType == 'ArrowThin') {
                this.hasAutoFocusArrowThin = true;
            };
            if (this.localWidget.widgetSubType == 'Image') {
                this.hasAutoFocusImage = true;
            };
            if (this.localWidget.widgetSubType == 'Bullets') {
                this.hasAutoFocusBullets = true;
            };
            if (this.localWidget.widgetSubType == 'Value') {
                this.hasAutoFocusValue = true;
            };
            if (this.localWidget.widgetSubType == 'Brackets') {
                this.hasAutoFocusBrackets = true;
            };

        };

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formShapeEditClosed.emit(null);
    }

    clickTextStringClear() {
        // Clear the Text string
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTextStringClear', '@Start');

        this.localWidget.shapeText = '';
    }

    clickSelectShape(ev) {
        // The user selected a shape subtype
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectShape', '@Start');

        let selectedShape: string = ev.srcElement.value;

        // Set AutoFocus
        this.hasAutoFocusCircle = false;
        this.hasAutoFocusEllipse = false;
        this.hasAutoFocusRectangle = false;
        this.hasAutoFocusText = false;
        this.hasAutoFocusArrow = false;
        this.hasAutoFocusArrowThin = false;
        this.hasAutoFocusImage = false;
        this.hasAutoFocusBullets = false;
        this.hasAutoFocusValue = false;
        this.hasAutoFocusBrackets = false;

        if (selectedShape == 'Circle') {
            this.hasAutoFocusCircle = true;
        };
        if (selectedShape == 'Ellipse') {
            this.hasAutoFocusEllipse = true;
        };
        if (selectedShape == 'Rectangle') {
            this.hasAutoFocusRectangle = true;
        };
        if (selectedShape == 'Text') {
            this.hasAutoFocusText = true;
        };
        if (selectedShape == 'Arrow') {
            this.hasAutoFocusArrow = true;
        };
        if (selectedShape == 'ArrowThin') {
            this.hasAutoFocusArrowThin = true;
        };
        if (selectedShape == 'Image') {
            this.hasAutoFocusImage = true;
        };
        if (selectedShape == 'Bullets') {
            this.hasAutoFocusBullets = true;
        };
        if (selectedShape == 'Value') {
            this.hasAutoFocusValue = true;
        };
        if (selectedShape == 'Brackets') {
            this.hasAutoFocusBrackets = true;
        };

        // Enact selected shape
        this.selectShape(selectedShape);

    }

    selectShape(shapeType: string) {
        // Change form according to the selected a shape subtype
        this.globalFunctionService.printToConsole(this.constructor.name,'selectShape', '@Start');

        // Deselect all
        this.showCircle = false;
        this.showEllipse = false;
        this.showRectangle = false;
        this.showText = false;
        this.showArrow = false;
        this.showArrowThin = false;
        this.showImage = false;
        this.showBullets = false;
        this.showValue = false;
        this.showBrackets = false;

        // Reset defaults, making sure localWidget exists
        // if (this.localWidget) {
        //     this.localWidget.containerHasTitle = false;
        // };

        if (shapeType == 'Circle') {
            this.showCircle = true;
        };
        if (shapeType == 'Ellipse') {
            this.showEllipse = true;
        };
        if (shapeType == 'Rectangle') {
            this.showRectangle = true;
        };

        if (shapeType == 'Text') {
            this.showText = true;
            if (this.localWidget.shapeText == null) {
                this.localWidget.shapeText = 'The brown fox is tired';
            };
        };
        if (shapeType == 'Arrow') {
            this.showArrow = true;
        };
        if (shapeType == 'ArrowThin') {
            this.showArrowThin = true;
        };
        if (shapeType == 'Image') {
            this.showImage = true;
        };
        if (shapeType == 'Bullets') {
            this.showBullets = true;
        };
        if (shapeType == 'Value') {
            this.showValue = true;
            this.localWidget.containerHasTitle = true;
            // TODO - get this value from the DB ...
            this.localWidget.shapeText = 'R234m';
        };
        if (shapeType == 'Brackets') {
            this.showBrackets = true;
        };
        
    }

    clickBulletDelete(index: number, item: string) {
        // Remove item from bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletDelete', '@Start');

        this.localWidget.shapeBullet.splice(index,1);
        this.bulletText = '';
        this.editBulletItem = false;


    }

    clickBulletEdit(index: number, item: string) {
        // Edit item from bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletEdit', '@Start');

        // Remember inddex in [w.Bullets]
        this.bulletIndex = index;

        // Show text of bullet on form
        this.bulletText = this.localWidget.shapeBullet[index].text;
        
        // Take the id of the selected bullet, and get its position in [gvTabs]
        if (this.localWidget.shapeBullet[index].linkedTabID == null) {
            this.bulletSelectedTab = 'None';
        } else {
            let tID: number = this.localWidget.shapeBullet[index].linkedTabID;
            let gvIndex: number = this.globalVariableService.currentDashboardTabs.findIndex(t =>
                t.id == tID);

            // If this ID exists, show it with the correct sequence number (index + 1)
            if (gvIndex == -1) {
                this.bulletSelectedTab = 'None';
            } else {

                this.bulletSelectedTab = this.globalVariableService.currentDashboardTabs
                    [gvIndex].name + ' (' + (gvIndex + 1).toString() + ')';
            };
        };

        // Set editting
        this.editBulletItem = true;
    }

    clickBulletUpdate() {
        // Update item in the bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletUpdate', '@Start');

        // None selected
        if (this.bulletSelectedTab == 'None') {
            this.localWidget.shapeBullet[this.bulletIndex].linkedTabID = null;
        } else {
            // Get sequence nr = index + 1
            let openBracket: number = this.bulletSelectedTab.indexOf('(');
            let closeBracket: number = this.bulletSelectedTab.indexOf(')');
            let tabSequenceNr = +this.bulletSelectedTab.substring(openBracket + 1, closeBracket);
        
            // Store ID associated with that sequence nr
            if (tabSequenceNr < 0) {
                this.localWidget.shapeBullet[this.bulletIndex].linkedTabID = null;
            } else {
                this.localWidget.shapeBullet[this.bulletIndex].linkedTabID = 
                    this.globalVariableService.currentDashboardTabs[tabSequenceNr - 1].id;
            };

            // Store bullet text
            this.localWidget.shapeBullet[this.bulletIndex].text = this.bulletText;
        };

        // Out of editting
        this.bulletSelectedTab = 'None';
        this.bulletText = '';
        this.editBulletItem = false;

    }

    clickBulletAdd() {
        // Add item to bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletAdd', '@Start');

        // Remove dummy 'Text' string
        if (this.localWidget.shapeBullet.length == 1) {
            if (this.localWidget.shapeBullet[0].text == 'Text ...') {
                this.localWidget.shapeBullet = [];
            };
        };

        // None selected
        let selectedTabID: number;
        if (this.bulletSelectedTab == 'None'  ||  this.bulletSelectedTab == undefined) {
            selectedTabID = null;
        } else {
            // Get sequence nr
            let openBracket: number = this.bulletSelectedTab.indexOf('(');
            let closeBracket: number = this.bulletSelectedTab.indexOf(')');
            let tabSequenceNr = +this.bulletSelectedTab.substring(openBracket + 1, closeBracket);
            
            // Add to Bullets Array
            if (tabSequenceNr < 0) {
                selectedTabID = null;
            } else {
                selectedTabID = this.globalVariableService.currentDashboardTabs
                    [tabSequenceNr - 1].id;
            };
        };

        // Add to Bullets
        this.localWidget.shapeBullet.push(
            { 
                text: this.bulletText, 
                linkedTabID: selectedTabID, 
                color: '', 
                jumpedColor: '' 
            }
        );
    }

    clickSelectBulletsTab(ev: any) {
        // Add the TabID to the Bullets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBulletsTab', '@Start');

        // Get T info
        let selectedTabstring: string = ev.target.value;
        let openBracket: number = selectedTabstring.indexOf('(');
        let closeBracket: number = selectedTabstring.indexOf(')');
        this.selectedTabIndex = +selectedTabstring.substring(openBracket + 1, closeBracket);
        
        let selectedTabIndex: number = this.globalVariableService.currentDashboardTabs
            .findIndex(t => t.id == this.selectedTabIndex);

    }

    clickSave() {
        // Save the Shape, globally and to DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Special settings
        if (this.localWidget.widgetSubType == 'Circle') {
            this.localWidget.containerHeight = this.localWidget.containerWidth;
        };
        if (this.localWidget.widgetSubType == 'Ellipse') {
            this.localWidget.containerHeight = 100;
            this.localWidget.containerWidth = this.localWidget.containerHeight * 2;
        };
        if (this.localWidget.widgetSubType == 'Value') {
            this.localWidget.containerBorder = '1px solid gray';
            this.localWidget.containerBorderRadius = '5px';
            this.localWidget.containerHeight = 80;
            this.localWidget.titleBackgroundColor = 'transparent';
            // TODO - make this the field name
            this.localWidget.titleText = 'Value';
        };

        if (this.newWidget) {

            this.localWidget.dashboardTabIDs.push(
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID
            );

            this.globalVariableService.addWidget(this.localWidget).then(res => {

                this.localWidget.id = res.id;

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Shape Added',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                this.formShapeEditClosed.emit(this.localWidget);
            });

        } else {
            // Replace the W
            this.globalVariableService.widgetReplace(this.localWidget);

            // Update global W and DB
            this.globalVariableService.saveWidget(this.localWidget).then(res => {

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Shape Saved',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                this.formShapeEditClosed.emit(this.localWidget);
            });
        };

    }

    clickSelectBracketLineColorPicker() {
        // Open the Colour Picker for Text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBracketLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorBracketColor';
        this.colourPickerClosed = true;
    }

    clickSelectTextColorPicker() {
        // Open the Colour Picker for Text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTextColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeTextColour;
        this.callingRoutine = 'ShapeEditorTextColor';
        this.colourPickerClosed = true;
    }

    clickSelectTextColor(ev: any) {
        // Open the Colour Picker for Text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTextColor', '@Start');

        this.localWidget.shapeTextColour = ev.target.value;
    }

    clickSelectCircleLineColorPicker(ev: any) {
        // Open the Colour Picker for Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectCircleLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorCircleLineColor';
        this.colourPickerClosed = true;
    }

    clickSelectCircleLineColor(ev: any) {
        // Open the Colour Picker for Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectCircleLineColor', '@Start');

        this.localWidget.shapeStroke = ev.target.value;
    }

    clickSelectCircleFillColorPicker(ev: any) {
        // Open the Colour Picker for Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectCircleFillColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorCircleFillColor';
        this.colourPickerClosed = true;
    }

    clickSelectCircleFillColor(ev: any) {
        // Open the Colour Picker for Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectCircleFillColor', '@Start');

        this.localWidget.shapeFill = ev.target.value;
    }

    clickSelectEllipseLineColorPicker(ev: any) {
        // Open the Colour Picker for Ellipse Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectEllipseLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorEllipseLineColor';
        this.colourPickerClosed = true;
    }

    clickSelectEllipseLineColor(ev: any) {
        // Open the Colour Picker for Ellipse Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectEllipseLineColor', '@Start');

        this.localWidget.shapeStroke = ev.target.value;
    }

    clickSelectEllipseFillColorPicker(ev: any) {
        // Open the Colour Picker for Ellipse Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectEllipseFillColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorEllipseFillColor';
        this.colourPickerClosed = true;
    }

    clickSelectEllipseFillColor(ev: any) {
        // Open the Colour Picker for Ellipse Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectEllipseFillColor', '@Start');

        this.localWidget.shapeFill = ev.target.value;
    }

    clickSelectRectangleLineColorPicker(ev: any) {
        // Open the Colour Picker for Rectangle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectRectangleLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorRectangleLineColor';
        this.colourPickerClosed = true;
    }

    clickSelectRectangleLineColor(ev: any) {
        // Open the Colour Picker for Rectangle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectRectangleLineColor', '@Start');

        this.localWidget.shapeStroke = ev.target.value;
    }

    clickSelectRectangleFillColorPicker(ev: any) {
        // Open the Colour Picker for Rectangle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectRectangleFillColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorRectangleFillColor';
        this.colourPickerClosed = true;
    }

    clickSelectRectangleFillColor(ev: any) {
        // Open the Colour Picker for Rectangle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectRectangleFillColor', '@Start');

        this.localWidget.shapeFill = ev.target.value;
    }

    clickSelectValueLineColorPicker(ev: any) {
        // Open the Colour Picker for Value Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectValueLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorValueLineColor';
        this.colourPickerClosed = true;
    }

    clickSelectValueLineColor(ev: any) {
        // Open the Colour Picker for Value Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectValueLineColor', '@Start');

        this.localWidget.shapeStroke = ev.target.value;
    }

    clickSelectBulletsColorPicker() {
        // Open the Colour Picker for Bullets Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBulletsColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeTextColour;
        this.callingRoutine = 'ShapeEditorBulletsColor';
        this.colourPickerClosed = true;
    }

    clickSelectBulletsColor(ev: any) {
        // Open the Colour Picker for Bullets Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBulletsColor', '@Start');

        this.localWidget.shapeTextColour = ev.target.value;
    }

    clickSelectBulletsIncrease() {
        // Increase the space between bullet points
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBulletsIncrease', '@Start');

        this.localWidget.shapeBulletMarginBottom = this.localWidget.shapeBulletMarginBottom + 3;

    }

    clickSelectBulletsDecrease() {
        // Decrease the space between bullet points
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBulletsDecrease', '@Start');

        if (this.localWidget.shapeBulletMarginBottom >= 3) {
            this.localWidget.shapeBulletMarginBottom =
                this.localWidget.shapeBulletMarginBottom - 3;
        };
    }

    clickSelectArrowLineColorPicker(ev: any) {
        // Open the Colour Picker for Arrow Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorArrowLineColor';
        this.colourPickerClosed = true;
    }

    clickSelectArrowSize(ev: any) {
        // Open the Colour Picker for Arrow Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowSize', '@Start');

        this.localWidget.shapeSize = ev.target.value;
        this.localWidget.shapeSvgHeight = 60; //((this.localWidget.shapeSize - 1) * 22.5 ) + 40;
        this.localWidget.shapeSvgWidth = 60;  //((this.localWidget.shapeSize - 1) * 22.5 ) + 40;
    }

    clickSelectArrowFillColorPicker(ev: any) {
        // Open the Colour Picker for Arrow Fill Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowFillColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeFill;
        this.callingRoutine = 'ShapeEditorArrowFillColor';
        this.colourPickerClosed = true;
    }

    clickSelectArrowLineColor(ev: any) {
        // Open the Colour Picker for Arrow Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowLineColor', '@Start');

        this.localWidget.shapeStroke = ev.target.value;
    }

    clickSelectArrowFill(ev: any) {
        // Open the Colour Picker for Arrow Fille Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowFill', '@Start');

        this.localWidget.shapeFill = ev.target.value;
    }

    clickSelectArrowThinColorPicker(ev: any) {
        // Open the Colour Picker for Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowThinColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorArrowThinColor';
        this.colourPickerClosed = true;
    }

    clickSelectArrowThinColor(ev: any) {
        // Open the Colour Picker for Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowThinColor', '@Start');

        this.localWidget.shapeStroke = ev.target.value;
    }

}
