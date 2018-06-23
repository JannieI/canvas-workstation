// Service to provide global variables
import { BehaviorSubject }            from 'rxjs/BehaviorSubject';
import { Injectable }                 from '@angular/core';
import { HttpClient }                 from '@angular/common/http';
import { HttpErrorResponse }          from '@angular/common/http';
import { HttpParams }                 from "@angular/common/http";
import { HttpHeaders }                from "@angular/common/http";

import { tap }                        from 'rxjs/operators';

// Our Models
import { CanvasAction }               from './models';
import { CanvasAuditTrail }           from './models';
import { CanvasComment }              from './models';
import { CanvasGroup }                from './models';
import { CanvasMessage }              from './models';
import { CanvasSettings }             from './models';
import { CanvasTask }                 from './models';
import { CanvasUser}                  from './models';
import { Combination }                from './models';
import { CombinationDetail }          from './models';
import { CSScolor }                   from './models';
import { CurrentDashboardInfo }       from './models';
import { Dashboard }                  from './models';
import { DashboardPermission }        from './models';
import { DashboardRecent}             from './models';
import { DashboardSnapshot }          from './models';
import { DashboardSchedule }          from './models';
import { DashboardSubscription }      from './models';
import { DashboardTab }               from './models';
import { DashboardTag }               from './models';
import { DashboardTemplate }          from './models';
import { DashboardTheme }             from './models';
import { DataConnection }             from './models';
import { DatasourceTransformation }   from './models';
import { DataField }                  from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';
import { DataSchema }                 from './models';
import { Dataset }                    from './models';
import { DataTable }                  from './models';
import { Datasource }                 from './models';
import { DataQualityIssue}            from './models';
import { DataOwnership}               from './models';
import { DatasourcePermission}        from './models';
import { DatasourcePivot }            from './models';
import { Field }                      from './models';
import { FieldMetadata }              from './models';
import { PaletteButtonBar }           from './models';
import { PaletteButtonsSelected }     from './models';
import { StatusBarMessage }           from './models';
import { Transformation }             from './models';
import { TributaryServerType }        from './models';
import { Widget }                     from './models';
import { WidgetCheckpoint }           from './models';

// TODO - to remove
import { Token }                      from './models';
import { User }                       from './models';

// External
import * as dl                        from 'datalib';
import { Observable }                 from 'rxjs/Observable';

// Functions
import { nSQL } from "nano-sql";

// Vega template
const vlTemplate: dl.spec.TopLevelExtendedSpec =
    {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",

        // Properties for top-level specification (e.g., standalone single view specifications)
        "background": "",
        "padding": {"left": 5, "top": 5, "right": 5, "bottom": 5},
        "height": "100",
        "width": "100",
        "autosize": "fit",
        // "autosize": "",          NB - add these only if needed, blank causes no graph display
        // "config": "",            NB - add these only if needed, blank causes no graph display

        // Properties for any specifications
        "title":
            {
                "text": "",
                "anchor": "",
                "offset": "",
                "orient": "",
                "style": ""
            },
        "name": "",
        "transform": "",

        "description": "",
        "data": null,
        "mark":
            {
                "type": "",  //bar circle square tick line area point rule text
                "style": "",
                "clip": "",
                "color": "#4682b4"
            },
        "encoding":
            {
                "color":
                    {
                        "field": "",
                        "type": ""
                    },
                "x":
                    {
                        "aggregate": "",
                        "field": "",
                        "type": "ordinal",
                        "bin": "",
                        "timeUnit": "",
                        "axis":
                        {
                            "title": ""
                        },
                        "scale": "",
                        "legend": "",
                        "format": "",
                        "stack": "",
                        "sort": "",
                        "condition": ""
                    },
                "y":
                    {
                        "aggregate": "",
                        "field": "",
                        "type": "quantitative",
                        "bin": "",
                        "timeUnit": "",
                        "axis":
                            {
                                "title": ""
                            },
                        "scale": "",
                        "legend": "",
                        "format": "",
                        "stack": "",
                        "sort": "",
                        "condition": ""
                        }
            }
    };

// Widget template
const widgetTemplate: Widget =
    {
        "widgetType": "",
        "widgetSubType": "",
        "isLocked": false,
        "dashboardID": null,
        "dashboardTabID": null,
        "dashboardTabIDs": [],
        "id": null,
        "originalID": null,
        "name": "New Widget",
        "description": "New Widget from Template",
        "annotation": '',
        "annotationLastUserID": "",
        "annotationLastUpdated": "",
        "visualGrammar": "Vega-Lite",
        "version": 1,
        "isSelected": false,
        "isLiked": false,
        "nrDataQualityIssues": 0,
        "nrComments": 0,
        "showCheckpoints": false,
        "checkpointIDs": [],
        "currentCheckpoint": 0,
        "lastCheckpoint": -1,
        "hyperlinkDashboardID": null,
        "hyperlinkDashboardTabID": null,
        "datasourceID": null,
        "data": null,
        "dataFields": null,
        "dataFieldTypes": null,
        "dataFieldLengths": null,
        "datasetID": null,
        "dataParameters": [],
        "reportID": null,
        "reportName": "",
        "rowLimit": null,
        "addRestRow": false,
        "size": "",
        "containerBackgroundcolor": "transparent",
        "containerBorder": "1px solid gray",
        "containerBorderRadius": "6px",
        "containerBoxshadow": "none",
        "containerFontsize": 12,
        "containerHeight": 320,
        "containerLeft": 10,
        "containerHasTitle": false,
        "containerTop": 80,
        "containerWidth": 410,
        "containerZindex": 50,
        "titleText": "Title of new Widget",
        "titleBackgroundColor": "lightgray",
        "titleBorder": "",
        "titleColor": "black",
        "titleFontsize": 12,
        "titleFontWeight": "",
        "titleHeight": 24,
        "titleMargin": "0",
        "titlePadding": "0 0 0 5px",
        "titleTextAlign": "center",
        "titleWidth": 100,
        "graphType": "",
        "graphHeight": 240,
        "graphLeft": 1,
        "graphTop": 1,
        "graphWidth": 240,
        "graphGraphPadding": 1,
        "graphHasSignals": false,
        "graphFillColor": "",
        "graphHoverColor": "",
        "graphSpecification": "",
        "graphDescription": "",
        "graphXaggregate": "",
        "graphXtimeUnit": "",
        "graphXfield": "",
        "graphXtype": "",
        "graphXaxisTitle": "",
        "graphYaggregate": "",
        "graphYtimeUnit": "",
        "graphYfield": "",
        "graphYtype": "",
        "graphYaxisTitle": "",
        "graphTitle": "",
        "graphMark": "tick",
        "graphMarkColor": "#4682b4",
        "graphUrl": "",
        "graphColorField": "",
        "graphColorType": "",
        "graphData": "",
        "tableBackgroundColor" : "",
        "tableColor": "",
        "tableCols": 1,
        "fontSize": 12,
        "tableHeight": 1,
        "tableHideHeader": false,
        "tableLeft": 1,
        "tableLineHeight": 12,
        "tableRows": 1,
        "tableTop": 1,
        "tableWidth": 1,
        "slicerAddRest": false,
        "slicerAddRestValue": false,
        "slicerBins": null,
        "slicerColor": "gray",
        "slicerFieldName": "",
        "slicerNumberToShow": '',
        "slicerSelection": null,
        "slicerSortField": '',
        "slicerSortFieldOrder": '',
        "slicerType": "",
        "shapeBullet": [],
        "shapeBulletStyleType": "",
        "shapeBulletsOrdered": false,
        "shapeBulletMarginBottom": 3,
        "shapeCorner": 15,
        "shapeFill": "",
        "shapeFontSize": 24,
        "shapeFontFamily": "",
        "shapeImageUrl": "",
        "shapeIsBold": true,
        "shapeIsItalic": false,
        "shapeOpacity": 1,
        "shapeRotation": 0,
        "shapeSize": 1,
        "shapeStroke": "",
        "shapeStrokeWidth": "",
        "shapeSvgHeight": 30,
        "shapeSvgWidth": 30,
        "shapeText": "",
        "shapeTextAlign": 'Left',
        "shapeTextColour": "",
        "shapeValue": "",
        "refreshMode": "",
        "refreshFrequency": 1,
        "widgetRefreshedOn": "",
        "widgetRefreshedBy": "",
        "widgetCreatedOn": "",
        "widgetCreatedBy": "",
        "widgetUpdatedOn": "",
        "widgetUpdatedBy": ""
    }

// Dashboard template
const dashboardTemplate: Dashboard =
    {
        id: null,
        originalID: null,
        draftID: null,
        version: 0,
        state: 'Draft',
        code: '',
        name: '',
        description: '',
        accessType: 'Private',
        password: '',
        refreshMode: '',
        refreshTimer: 0,
        defaultTabID: 0,
        defaultExportFileType: '',
        url: '',
        qaRequired: false,
        isSample: false,
        backgroundColor: '',
        backgroundImage: '',
        templateDashboardID: 0,
        creator: '',
        dateCreated: '',
        editor: '',
        dateEdited: '',
        refresher: '',
        dateRefreshed: '',
        nrWidgets: 0,
        nrShapes: 0,
        nrRecords: 0,
        nrTimesOpened: 0,
        nrTimesChanged: 0,
        tabs: [],
        permissions: []
    };

const dashboardTabTemplate: DashboardTab =
    {
        id: null,
        originalID: null,
        dashboardID: 0,
        name: 'First',
        description: '',
        displayOrder: 0,
        backgroundColor: '',
        color: ''

    };


// Data
const finalFields =
[
    {
        fieldName: 'MonthTraded',
        dataType: 'string',
        localName: 'Date',
        filtered: '2 flters',
        transformed: ''
    },
    {
        fieldName: 'TradeType',
        dataType: 'string',
        localName: '',
        filtered: '',
        transformed: ''
    },
    {
        fieldName: 'Volume',
        dataType: 'number',
        localName: '',
        filtered: '1 flters',
        transformed: '2 transf'
    },
    {
        fieldName: 'Price',
        dataType: 'number',
        localName: '',
        filtered: '',
        transformed: '6 transf'
    },
    {
        fieldName: 'Value',
        dataType: 'Calculated: number',
        localName: '',
        filtered: '',
        transformed: '1 transf'
    }
];

const combinations: Combination[] =
[
    {
        combinationID: 1,
        dashboardID: 1,
        type: 'Union'
    }
];

const combinationDetails: CombinationDetail[] =
[
    {
        combinationDetailID: 1,
        combinationID: 2,
        lhDatasourceID: 3,
        lhFieldName: 'TradeType',
        rhDatasourceID: 4,
        rhFieldName: 'TradeType'
    }
];

const fields: Field[] =
[
    {
        id: 1,
        datasourceID: 12,
        name: 'DateTrade',
        type: 'Date',
        format: '',
        filter: '',
        calc: '',
        order: 'Asc 1'
    },
    {
        id: 2,
        datasourceID: 12,
        name: 'Share',
        type: 'Text',
        format: '',
        filter:  '',
        calc:  '',
        order: ''
    },
    {
        id: 3,
        datasourceID: 12,
        name: 'Volume',
        type: 'Number',
        format: 'Integer',
        filter: '',
        calc:  '',
        order: ''
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Value',
        type: 'Number',
        format: '2 decimals',
        filter: '> 1m',
        calc: 'Volume * 10',
        order: ''
    }
];

const fieldsMetadata: FieldMetadata[] =
[
    {
        id: 4,
        datasourceID: 12,
        name: 'DateTrade',
        type: 'Date',
        description: 'Date on which trade when through trading system',
        keyField: false,
        explainedBy: ''
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Share',
        type: 'String',
        description: 'Name of share (stock) that traded, ie Anglo American plc',
        keyField: true,
        explainedBy: 'Bar of new Listings per Month'
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Volume',
        type: 'Number',
        description: 'Number of instruments traded.  Single counted, excluding BR, YT trade types.',
        keyField: false,
        explainedBy: 'Pie of Trades by Broker'
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Value',
        type: 'Number',
        description: 'Value in Rand of the instruments traded, based on Volume and Price.',
        keyField: false,
        explainedBy: 'Custom Query: TradeAttribution'
    }
];

const transformationsFormat: Transformation[] =
[
    {
        id: 1,
        category: 'Column-level',
        name: 'FormatDate',
        description: '(columnName, new-date-format, old-date-format): if the columnName is blank, Tributary will try to convert all date fields.  The format can be YYYYMMDD, MMMMM, M/D/Y, etc.',
        nrParameters: 6,
        parameterPlaceholder: ['place1','place2','place3','place4','place5','place6'],
        parameterTitle: ['tit1','tit2','tit3','tit4','tit5','tit6'],
        parameterDefaultValue: ['txt1','txt2','txt3','txt4','txt5','txt6'],
        parameterHeading: ['head1','head2','head3','head4','head5','head6'],
        parameterType: ['','','','','','']

    },
    {
        id: 16,
        category: 'Column-level',
        name: 'DatePart',
        description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second',
        nrParameters: 1,
        parameterPlaceholder: ['place1'],
        parameterTitle: ['tit1'],
        parameterDefaultValue: ['txt1'],
        parameterHeading: ['head1'],
        parameterType: ['','','','','','']

    },
    {
        id: 20,
        category: 'Column-level',
        name: 'FormatNumber',
        description: '(columnName, formatString) where formatString is a valid string in Excel (VBA) format.  For example, ‘#0.00’, R#0,00’, ‘0000’',
        nrParameters: 1,
        parameterPlaceholder: ['place1'],
        parameterTitle: ['tit1'],
        parameterDefaultValue: ['txt1'],
        parameterHeading: ['head1'],
        parameterType: ['','','','','','']

    }
];



@Injectable()
export class GlobalVariableService {

    // Settings
    // TODO - get from DB, not Constants

    canvasSettings: CanvasSettings = {
        companyName: '',
        companyLogo: '',
        dashboardTemplate: '',
        maxTableLength: 500,
        widgetsMinZindex: 50,
        widgetsMaxZindex: 59,
        gridSize: 3,
        snapToGrid: true,
        printDefault: '',
        printSize: '',
        printLayout: '',
        notInEditModeMsg: 'Not in Edit Mode (see Edit menu Option)',
        noQueryRunningMessage: 'No Query',
        queryRunningMessage: 'Query running...'
    }

    vlTemplate: dl.spec.TopLevelExtendedSpec = vlTemplate;
    widgetTemplate: Widget = widgetTemplate;
    dashboardTemplate: Dashboard = dashboardTemplate;
    dashboardTabTemplate: DashboardTab = dashboardTabTemplate;
    serverTypes: TributaryServerType[] = 
    [
        {
            serverType: 'MySQL', 
            driverName: 'mysql',
            connector: 'tributary.connectors.sql:SqlConnector'
        },
        {
            serverType: 'PostgresSQL', 
            driverName: 'postgres',
            connector: 'tributary.connectors.sql:SqlConnector'
        },
        {
            serverType:'Microsoft SQL',
            driverName: 'mssql',
            connector: 'tributary.connectors.sql:SqlConnector'
        }
    ];

    // System-wide related variables, set at Installation - for later use
    // systemConfigurationID: number = -1;
    // backendName: string = 'Eazl';
    // backendUrl: string = '';                                    // RESTi url, set in SystemConfig
    // defaultDaysToKeepResultSet: number = 1;                     // Optional, set in SystemConfig
    // frontendName: string = 'Canvas';
    // maxRowsDataReturned: number = 1000000;                      // Optional, set in SystemConfig
    // maxRowsPerWidgetGraph: number = 1;                          // Optional, set in SystemConfig
    // systemTitle: string = 'Canvas';
    // averageWarningRuntime: number = 0;
    // defaultWidgetConfiguration: string = '';
    // dashboardIDStartup: number = null;
    // defaultReportFilters: string = '';
    // environment: string = '';
    // frontendColorScheme: string = '';

    // Permanent data - later to come from http
    backgroundcolors: CSScolor[] = [];
    canvasTasks: CanvasTask[] = [];
    canvasComments: CanvasComment[] = [];
    canvasAuditTrails: CanvasAuditTrail[] = [];
    canvasMessages: CanvasMessage[] = [];
    widgetCheckpoints: WidgetCheckpoint[] = [];
    currentWidgetCheckpoints: WidgetCheckpoint[] = [];
    filePath: string;

    dashboards: Dashboard[] = [];
    canvasUsers: CanvasUser[] = [];
    canvasGroups: CanvasGroup[] = [];
    dashboardTabs: DashboardTab[] = [];
    dashboardSchedules: DashboardSchedule[] = [];
    dashboardTags: DashboardTag[] = [];
    dashboardPermissions: DashboardPermission[] = [];
    dashboardSnapshots: DashboardSnapshot[] = [];
    dashboardSubscriptions: DashboardSubscription[] = [];
    dashboardThemes: DashboardTheme[] = [];
    dashboardTemplates: DashboardTemplate[] = [];
    widgets: Widget[] = [];

    datasources: Datasource[] = [];
    transformations: Transformation[] = [];
    dataQualityIssues: DataQualityIssue[] = [];
    dataOwnerships: DataOwnership[] = [];
    datasourcePermissions: DatasourcePermission[] = [];
    datasourcePivots: DatasourcePivot[] = [];
    transformationsFormat: Transformation[] = transformationsFormat;
    fields: Field[] = fields;
    fieldsMetadata: FieldMetadata[] = fieldsMetadata;
    datasets: any = [];                                 // List of dSets, NO data
    dataConnections: DataConnection[] = [];
    datasourceTransformations: DatasourceTransformation[] = [];
    dataTables: DataTable[] = [];
    dataFields: DataField[] = [];
    finalFields: any = finalFields;


    // Data for CURRENT Dashboard and Datasources: only some models are loaded
    currentCanvasGroups: CanvasGroup[] = [];
    currentDatasources: Datasource[] = [];
    currentTransformations: Transformation[] = [];
    currentDataQualityIssues: DataQualityIssue[] = [];
    currentDataOwnerships: DataOwnership[] = [];
    currentDatasourcePermissions: DatasourcePermission[] = [];
    currentDatasourcePivots: DatasourcePivot[] = [];
    currentDatasets: any = [];                          // Used in current D, with data
    currentDashboards: Dashboard[] = [];
    currentDashboardTabs: DashboardTab[] = [];
    currentWidgets: Widget[] = [];
    currentDashboardSchedules: DashboardSchedule[] = [];
    currentDashboardTags: DashboardTag[] = [];
    currentPaletteButtonBar: PaletteButtonBar[];
    currentDashboardPermissions: DashboardPermission[] = [];
    currentDashboardSnapshots: DashboardSnapshot[] = [];
    currentDashboardSubscriptions: DashboardSubscription[] = [];
    changedWidget = new BehaviorSubject<Widget>(null);    // W that must be changed

    // TODO - this is trigger a rename of the D on statusbar - must be better way
    currentDashboardName = new BehaviorSubject<string>('');
    currentDashboardInfo = new BehaviorSubject<CurrentDashboardInfo>(null);      // Null when not defined
    // widgetsToRefresh = new BehaviorSubject<number[]>([]);            // Array of Wids to refresh

    // Global vars that guide all interactions
    // ***************************************
    // Modes and Display
    editMode = new BehaviorSubject<boolean>(false);
    showGrid = new BehaviorSubject<boolean>(false);
    showPalette = new BehaviorSubject<boolean>(true);
    preferencePaletteHorisontal = new BehaviorSubject<boolean>(true);

    // First time user
    isFirstTimeDashboardOpen = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardSave = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardDiscard = new BehaviorSubject<boolean>(true);
    isFirstTimeWidgetLinked = new BehaviorSubject<boolean>(true);
    isFirstTimeDataCombination = new BehaviorSubject<boolean>(true);
    // Menu-related
    // showMainMenu = new BehaviorSubject<boolean>(true);
    // Opening forms
    openDashboardFormOnStartup: boolean = false;
    hasDatasources = new BehaviorSubject<boolean>(false);   // Used to set menu
    showModalLanding = new BehaviorSubject<boolean>(true);  // Shows Landing page
    selectedWidgetIDs: number[] = [];

    // Session
    firstAction: boolean = true;               // True if 1st action per D
    actions: CanvasAction[] = [];
    colourPickerClosed = new BehaviorSubject<
        {
            callingRoutine: string;
            selectedColor:string;
            cancelled: boolean
        }
    >(null);
    currentPaletteButtonsSelected= new BehaviorSubject<PaletteButtonsSelected[]>([]);
    currentUser: CanvasUser;
    currentUserID = new BehaviorSubject<string>('');
    dashboardsRecent: DashboardRecent[] = [];
    dashboardsRecentBehSubject = new BehaviorSubject<DashboardRecent[]>([]);  // Recently used Dashboards
    datasourceToEditID = new BehaviorSubject<number>(null);
    dsIDs: number[] = [];           // Dataset IDs
    getSource: string = 'Test';     // Where to read/write: File, Test (JSON Server), Eazl
    loggedIntoServer = new BehaviorSubject<boolean>(true);
    menuActionResize = new BehaviorSubject<boolean>(false);
    sessionDebugging: boolean = true;
    sessionLogging: boolean = false;
    templateInUse = new BehaviorSubject<boolean>(false);
    widgetGroup = new BehaviorSubject<number[]>([]);
    // userID: string = 'JannieI';  // TODO - unHardCode


    // StatusBar
    statusBarRunning = new BehaviorSubject<string>(this.canvasSettings.noQueryRunningMessage);
    statusBarCancelRefresh = new BehaviorSubject<string>('Cancel');
    statusBarMessage = new BehaviorSubject<StatusBarMessage>(null)

    dataGetFromSwitch = new BehaviorSubject<string>('File');
    // refreshDashboard = new BehaviorSubject<boolean>(false);      // True to refresh the D now

    // Current User
    // canvasUser = new BehaviorSubject<CanvasUser>(null);
    // isAuthenticatedOnEazl: boolean = false;        // True if authenticated

    // This session
    // showSystemConfigButtons: boolean = true;       // Menu option called = True: SystemConfiguration, False: System Info
    sessionDateTimeLoggedin: string = '';
    continueToTransformations: boolean = false;         // True after Edit DS -> Open Transformations form
    // sessionDashboardTabID: number = null;          // Tab ID to load when form opens, -1 = none
    // sessionLoadOnOpenDashboardID: number = null;   // Dashboard to load when form opens, 0 = none
    // sessionLoadOnOpenDashboardName: string = '';   // Dashboard to load when form opens, '' = none

    // At startup
    // startupDashboardID: number = 0;                             // Dashboard to load @start, 0 = none
    // startupDashboardTabID: number = 0;                          // Tab ID to load @start, -1 = none
    // startupMessageToShow: string = '';                          // Message to show at start

    // Environment
    // testEnvironmentName: string = '';                           // Spaces = in PROD

    // Dirtiness of system (local) data: True if dirty (all dirty at startup)
    isDirtyDashboards: boolean = true;
    isDirtyDashboardTabs: boolean = true;
    isDirtyDashboardsRecent: boolean = true;
    isDirtyWidgets: boolean = true;
    isDirtyShapes: boolean = true;
    isDirtySlicers: boolean = true;
    isDirtyDashboardSchedules: boolean = true;
    isDirtyDashboardTags: boolean = true;
    isDirtyDashboardPermissions: boolean = true;
    isDirtyDashboardSnapshots: boolean = true;
    isDirtyDashboardSubscription: boolean = true;
    isDirtyDashboardThemes: boolean = true;
    isDirtyDatasources: boolean = true;
    isDirtyTransformations: boolean = true;
    isDirtyDataQualityIssues: boolean = true;
    isDirtyDataOwnership: boolean = true;
    isDirtyDatasourcePermissions: boolean = true;
    isDirtyDatasourcePivots: boolean = true;
    isDirtyDatasets: boolean = true;
    isDirtyBackgroundColors: boolean = true;
    isDirtyCanvasTasks: boolean = true;
    isDirtyCanvasComments: boolean = true;
    isDirtyCanvasMessages: boolean = true;
    isDirtyCanvasSettings: boolean = true;
    isDirtyPaletteButtonBar: boolean = true;
    isDirtyUserPaletteButtonBar: boolean = true;
    isDirtyPaletteButtonsSelected: boolean = true;
    isDirtyWidgetCheckpoints: boolean = true;
    isDirtyCanvasGroups: boolean = true;
    isDirtyUsers: boolean = true;
    isDirtyCanvasAuditTrails: boolean = true;
    isDirtyDataFields: boolean = true;
    isDirtyDataTables: boolean = true;
    isDirtyDataConnections: boolean = true;
    isDirtyDatasourceTransformations: boolean = true;

    // Settings that can be set via UI for next time, from then on it will change
    // as the user uses them, and used the next time (a Widget is created)
    // lastContainerFontSize: SelectedItem =
    //     {
    //         id: 1,
    //         name: '1'
    //     };
    // lastColor: SelectedItemColor =
    //     {
    //         id: 'black',
    //         name: 'black',
    //         code: '#000000'
    //     };
    // lastBoxShadow: SelectedItem =new Promise<boolean>((resolve, reject) => {
    //     {
    //         id:1,
    //         name: ''
    //     };
    // lastBorder: SelectedItem =
    //     {
    //         id:1,
    //         name: '1px solid black'
    //     };
    // lastBackgroundColor: SelectedItemColor =
    //     {
    //         id: 'white',
    //         name: 'white',
    //         code: '#FFFFFF'
    //     };
    // lastWidgetHeight: number = 300;
    // lastWidgetWidth: number = 400;
    // lastWidgetLeft: number = 25;
    // lastWidgetTop: number = 80;


    constructor(
        private http: HttpClient,
    ) {
     }

     refreshCurrentDashboardInfo(dashboardID: number, dashboardTabID: number):
        Promise<boolean> {
        // Refreshes all info related to current D
        // dashboardTabID = -1 if unknown, so get first T
        // Returns True if all worked, False if something went wrong
        console.log('%c    Global-Variables refreshCurrentDashboardInfo D,T id = ',
        "color: black; background: lightgray; font-size: 10px", dashboardID, dashboardTabID)

        // Load the current Dashboard, and Optional template.  The dependants are stakced
        // in a Promise chain, to ensure we have all or nothing ...
        return new Promise<boolean>((resolve, reject) => {
            this.getCurrentDashboard(dashboardID).then( i => {

                // Load the DashboardTabs
                this.getCurrentDashboardTabs(dashboardID).then(j => {
                    if (dashboardTabID == -1) {
                        if (j.length > 0) {dashboardTabID = j[0].id}
                    };

                    // Set T-index
                    this.currentDashboardInfo.value.currentDashboardTabIndex =
                        this.currentDashboardTabs.findIndex(t => t.id == dashboardTabID);

                    // Load Permissions for D
                    this.getCurrentDashboardPermissions(dashboardID).then( l => {

                    // Load Checkpoints for D
                    this.getCurrentWidgetCheckpoints(dashboardID).then( l => {

                    // Load Datasets
                    this.getDataset().then(m => {

                        // Load Widgets
                        this.getCurrentWidgets(dashboardID, dashboardTabID).then(n => {

                            // Load current DS
                            this.getCurrentDatasources(dashboardID).then(k => {

                                // Get info for W
                                this.getWidgetsInfo().then(n => {

                                    // Add to recent
                                    this.amendDashboardRecent(dashboardID, dashboardTabID); //.then(n => {

                                    if (this.currentDatasources.length > 0) {
                                        this.hasDatasources.next(true);
                                    } else {
                                        this.hasDatasources.next(false);
                                    }
                                    resolve(true)
                                    // })
                                })
                            })
                        })
                    })
                })
                })
                })
            });
        });
    }

    refreshCurrentDatasourceInfo(datasourceID: number): Promise<boolean> {
        // Refreshes all info related to current DS, but NOT currentDatasources
        // Returns True if all worked, False if something went wrong
        console.log('%c    Global-Variables refreshCurrentDatasourceInfo D,T id = ',
        "color: black; background: lightgray; font-size: 10px", datasourceID)

        // Get lates dSet for give DSid
        // TODO - decide if lates / -1 is best choice here
        let ds: number[] = [];
        let dSetID: number = 1;
        for (var i = 0; i < this.datasets.length; i++) {
            if(this.datasets[i].datasourceID == datasourceID) {
                ds.push(this.datasets[i].id)
            }
        };
        if (ds.length > 0) {
            dSetID = Math.max(...ds);
        };

        // Load the current Dashboard, and Optional template.  The dependants are stakced
        // in a Promise chain, to ensure we have all or nothing ...

        return new Promise<boolean>((resolve, reject) => {
            // Load data
            this.getCurrentDataset(datasourceID, dSetID).then (j =>
            // Load Permissions for DS
            this.getCurrentDatasourcePermissions(datasourceID).then(k =>
            // Load Transformations
            this.getCurrentTransformations(datasourceID).then(l =>
            // Load Pivots
            this.getCurrentDatasourcePivots(datasourceID).then(m =>
            // Load dataQuality Issues
            this.getCurrentDataQualityIssues(datasourceID).then( o =>
                // Reset Global Vars
                {
                    resolve(true)
                }
        )))));
        });
    }

    refreshAllInfo(dashboardID: number, dashboardTabID: number) {
        // Refreshes all info related to current D
        console.log('%c    Global-Variables refreshAllInfo D,T id = ',
        "color: black; background: lightgray; font-size: 10px", dashboardID, dashboardTabID)

        console.log('refreshAllInfo FIX DS ids that are hardcoded ...')
        // Load Dashboard Themes
        this.getDashboardThemes();

		// Load the current Dashboard, and Optional template
        this.getCurrentDashboard(dashboardID);

		// Load the current DashboardTab
        this.getCurrentDashboardTabs(dashboardID)

        // Load Dashboard Schedules
        this.getCurrentDashboardSchedules(dashboardID);

        // Load Dashboard Tags
        this.getCurrentDashboardTags(dashboardID);

        // Load Dashboard Permissions
        this.getCurrentDashboardPermissions(dashboardID);

        // Load Dashboard Snapshots
        this.getCurrentDashboardSnapshots(dashboardID);

        // Load Dashboard Templates
        this.getDashboardTemplates();

        // Load Current Datasources
        this.getCurrentDatasources(dashboardID)

        // Load DatTransformationsasources
        this.getTransformations();

        // Load Current DatTransformationsasources
        this.getCurrentTransformations(1);

        // Load DataQualityIssues
        this.getDataQualityIssues();

        // Load Current DataQualityIssue
        this.getCurrentDataQualityIssues(1);

        // Load DatasourcePermissions
        this.getDatasourcePermissions();

        // Load Current DatasourcePermissions
        this.getCurrentDatasourcePermissions(1);

        // Load Current DatasourcePivots
        this.getCurrentDatasourcePivots(1);

    }

    getDashboards(params: string = ''): Promise<Dashboard[]> {
        // Description: Gets all D
        // Returns: this.dashboards array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c        Global-Variables getDashboards ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        if (params.substring(0 ,1) != '?') {
            params = '?' + params;
        };

        let url: string = 'dashboards' + params;
        this.filePath = './assets/data.dashboards.json';

        return new Promise<Dashboard[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboards.length == 0)  ||  (this.isDirtyDashboards) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboards = data;
                        this.isDirtyDashboards = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDashboards 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dashboards)
                        resolve(this.dashboards);
                    });
            } else {
                console.log('%c    Global-Variables getDashboards 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                resolve(this.dashboards);
            }
        });

    }

    copyDashboard(
        dashboardID: number,
        name: string = null,
        state: string = null
        ): Promise<Dashboard> {
        // Copies a given Dashboard, with all related info
        // - dashboardID = D to copy (= Original)
        // - name, state: optional values for the new copy
        // - To make a draft: originalD.state = Complete, state = Draft
        console.log('%c    Global-Variables copyDashboard D,T id = ',
        "color: black; background: lightgray; font-size: 10px", dashboardID)

        // Duplicate the D and all related info
        return new Promise<Dashboard>((resolve, reject) => {

            // Get D
            let dashboardIndex: number = this.dashboards.findIndex(d => d.id == dashboardID);
            if (dashboardIndex >= 0) {

                // Create new D, and fill in where possible
                let today = new Date();
                let newD = Object.assign({}, this.dashboards[dashboardIndex]);
                newD.id = null;
                newD.creator = this.currentUser.userID;
                newD.dateCreated = this.formatDate(today);
                newD.editor = null;
                newD.dateEdited = null;

                if (name != null) {
                    newD.name = name;
                };
                if (state != null) {
                    newD.state = state;
                };

                // Draft can only be edited by its creator
                if (state == 'Draft') {
                    newD.accessType = 'Private';
                };

                newD.draftID = null;
                if (this.dashboards[dashboardIndex].state == 'Complete'
                    && state == 'Draft') {
                    newD.originalID = this.dashboards[dashboardIndex].id;
                } else {
                    newD.originalID = null;
                };

                this.addDashboard(newD).then (addedD => {

                    let promiseArrayT = [];

                    // Save original ID
                    if (this.dashboards[dashboardIndex].state == 'Complete'
                        &&  state == 'Draft') {
                        let currentDashboardIndex: number = this.currentDashboards.
                            findIndex(d => d.id == dashboardID);
                        if (currentDashboardIndex >= 0) {
                            this.currentDashboards[currentDashboardIndex].draftID =
                                addedD.id;
                        };
                        this.dashboards[dashboardIndex].draftID = addedD.id;
                        this.saveDashboard(this.dashboards[dashboardIndex]);
                    };

                    // T
                    this.dashboardTabs.forEach(t => {
                        if (t.dashboardID == dashboardID) {
                            // Deep copy
                            let newT: DashboardTab = Object.assign({}, t);
                            newT.id = null;
                            newT.dashboardID = addedD.id;
                            newT.originalID = t.id;
                            promiseArrayT.push(this.addDashboardTab(newT));
                        };

                    });
                    this.allWithAsync(...promiseArrayT).then(resolvedData => {
                        // W
                        let promiseArrayW = [];
                        let dashboardTabsResult = JSON.parse(JSON.stringify(resolvedData));

                        dashboardTabsResult.forEach(t => {
                            if (t.dashboardID == addedD.id) {
                                console.warn('xx loop tabs', t, dashboardTabsResult)
                                this.widgets.forEach(w => {
                                    if (w.dashboardID == dashboardID
                                        &&
                                        w.dashboardTabIDs.indexOf(t.originalID) >= 0) {
                                        // Deep copy
                                        let newW: Widget = Object.assign({}, w);
                                        newW.id = null;
                                        newW.dashboardID = addedD.id;
                                        newW.dashboardTabID = t.id;
                                        newW.originalID = w.id;
                                        // TODO - fix for multi-Tabbed Ws
                                        newW.dashboardTabIDs = [t.id];
                                        console.warn('xx newW', newW)
                                        promiseArrayW.push(this.addWidget(newW));

                                    };
                                });
                            };
                        });
                        this.allWithAsync(...promiseArrayW).then(resolvedData => {
                            console.warn('xx after allSync W', resolvedData)

                            // Checkpoints
                            let promiseArrayChk = [];
                            let widgetResults = JSON.parse(JSON.stringify(resolvedData));
                            widgetResults.forEach(w => {
                                if (w.dashboardID == addedD.id) {

                                    this.widgetCheckpoints.forEach(chk => {
                                        if (chk.dashboardID == dashboardID
                                            && chk.widgetID == w.originalID) {
                                            // Deep copy
                                            let newChk: WidgetCheckpoint = Object.assign({}, chk);
                                            newChk.id = null;
                                            newChk.dashboardID = addedD.id;
                                            newChk.widgetID = w.id;
                                            newChk.originalID = chk.id;

                                            newChk.widgetSpec.dashboardID = addedD.id;
                                            newChk.widgetSpec.dashboardTabID = w.dashboardTabID;
                                            newChk.widgetSpec.widgetID = w.id;
                                            // TODO - fix for multi-Tabbed Ws
                                            newChk.widgetSpec.dashboardTabIDs = w.dashboardTabIDs;

                                            console.warn('xx newChk', newChk)
                                            promiseArrayChk.push(this.addWidgetCheckpoint(newChk));
                                        };
                                    });
                                };

                            });

                            this.allWithAsync(...promiseArrayChk).then(resolvedData => {

                                // Rebuild [checkpointIDs]
                                let promiseArrayWS = [];
                                let newCheckpointIDs: number[] = [];
                                let chkpntIndex: number;
                                let wID: number;
                                this.widgets.forEach(w => {
                                    if (w.dashboardID == addedD.id) {
                                        w.checkpointIDs.forEach(cids => {
                                            chkpntIndex = this.widgetCheckpoints.findIndex(
                                                wc => wc.originalID == cids
                                            );
                                            if (chkpntIndex >= 0) {
                                                newCheckpointIDs.push(
                                                    this.widgetCheckpoints[chkpntIndex].id
                                                );
                                            };
                                        });
                                        w.checkpointIDs = newCheckpointIDs;
                                        promiseArrayWS.push(this.saveWidget(w))
                                    };
                                });
                                this.allWithAsync(...promiseArrayWS).then(resolvedData => {

                                    // SOME Permissions, with these changes:
                                    // - canEdit ONLY for the creator
                                    // - canAddDatasource ONLY for the creator
                                    // - remove canDelete for all (cannot do this to a Draft)
                                    // - remove canGrantAccess for all
                                    let promiseArrayP = [];
                                    this.dashboardPermissions.forEach(p => {
                                        if (p.dashboardID == dashboardID) {

                                            // Deep copy
                                            let newP: DashboardPermission = Object.assign({}, p);
                                            newP.id = null;
                                            newP.dashboardID = addedD.id;
                                            if (newP.userID != this.currentUser.userID) {
                                                newP.canEditRight = false;
                                                newP.canAddDatasource = false;
                                            };
                                            newP.canDeleteRight = false;
                                            newP.canGrantAccess = false;

                                            console.warn('xx newP', newP)
                                            promiseArrayP.push(this.addDashboardPermission(newP));
                                        };

                                    });

                                    this.allWithAsync(...promiseArrayChk).then(resolvedData => {
                                        resolve(addedD);
                                    });
                                });
                            });
                        });
                    });
                });
            };
        });
    }

    letDashboard(dashboardID: number = null): Dashboard {
        // Returns the given D from the internal arrays
        console.log('%c    Global-Variables letDashboard ...',
        "color: black; background: lightgray; font-size: 10px", dashboardID);

        // Set to current if none provided
        if (dashboardID == null) {
            dashboardID = this.currentDashboardInfo.value.currentDashboardID;
        };

        // Get D
        let dashboardIndex: number = this.dashboards.findIndex(d => d.id == dashboardID);
        if (dashboardIndex >= 0) {
            return this.dashboards[dashboardIndex];
        } else {
            alert ('Dashboard ID ' + dashboardID.toString() + ' does not exist in the dashboards array - should be impossible');
            return null;
        };
    }

    discardDashboard(): number {
        // Discards a Draft Dashboard, which means all changes are deleted
        // Returns originalID (from which Draft D was copied)

        // The following are unmodified:
        // - the AuditTrails are kept against the Draft

        console.log('%c    Global-Variables discardDashboard ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // Set to current
        let draftID: number = this.currentDashboardInfo.value.currentDashboardID;
        let dashboard: Dashboard = this.letDashboard(draftID);
        let originalID: number = dashboard.originalID;
        let originalDashboard: Dashboard = this.letDashboard(originalID);
        let draftTabs: DashboardTab[] = this.dashboardTabs.filter(
            t => t.dashboardID == draftID
        );

        // Reset the draft ID
        originalDashboard.originalID = null;
        originalDashboard.draftID = null;
        this.saveDashboard(originalDashboard);

        // The following are moved (added to the original version), removing any links
        // to the Draft version:
        // - Actions
        this.actions.forEach(act => {
            draftTabs.forEach(t => {
                if (act.dashboardID == t.dashboardID
                    &&
                    act.dashboardTabID == t.id) {
                        act.dashboardID = originalID;
                        act.dashboardTabID = t.originalID;
                        this.actionUpsert(
                            act.id,
                            act.dashboardID,
                            act.dashboardTabID,
                            null,
                            act.objectType,
                            act.action,
                            act.description,
                            act.undoID,
                            act.redoID,
                            act.oldWidget,
                            act.newWidget
                        );
                };
            });
        });

        // - Tasks
        this.canvasTasks.forEach(tsk => {
            if (tsk.linkedDashboardID == draftID) {
                tsk.linkedDashboardID = originalID;
                this.saveCanvasTask(tsk);
            };
        });

        // - Messages
        this.canvasMessages.forEach(msg => {
            draftTabs.forEach(t => {
                if (msg.dashboardID == t.dashboardID
                    &&
                    msg.dashboardTabID == t.id) {
                        msg.dashboardID = originalID;
                        msg.dashboardTabID = t.originalID;
                        this.saveCanvasMessage(msg);
                };
            });
        });

        // - Comments (link to Dashboard and Widget)
        this.canvasComments.forEach(com => {
            if (com.dashboardID == draftID) {
                com.dashboardID = originalID;
                this.saveCanvasComment(com);
            };
        });

        // The following are simply deleted (and those applicable to the original remains
        // unchanged):
        // - Subscriptions
        this.dashboardSubscriptions.forEach(sub => {
            if (sub.dashboardID == draftID) {
                this.deleteDashboardSubscription(sub.id);
            };
        });

        // - Schedules
        this.dashboardSchedules.forEach(sch => {
            if (sch.dashboardID == draftID) {
                this.deleteDashboardSchedule(sch.id);
            };
        });

        // - entry in recent Dashboards for the Draft
        this.dashboardsRecent.forEach(rec => {
            if (rec.dashboardID == draftID) {
                this.deleteDashboardRecent(rec.id);
            };
        });

        // - flag for Favourite Dashboard
        // - flag for Startup Dashboard
        this.canvasUsers.forEach(u => {
            if (u.startupDashboardID == draftID) {
                u.startupDashboardID = 0;
            };
            u.favouriteDashboards.filter(f => f != draftID)
            // TODO - improve this to not update ALL users
            this.saveCanvasUser(u);
        });

        // - permissions
        this.dashboardPermissions.forEach(per => {
            if (per.dashboardID == draftID) {
                this.deleteDashboardPermission(per.id);
            };
        });

        // - Tags
        this.dashboardTags.forEach(tag => {
            if (tag.dashboardID == draftID) {
                this.deleteDashboardTag(tag.id);
            };
        });

        // - all snapshots (for the Draft) are deleted
        this.dashboardSnapshots.forEach(snp => {
            if (snp.dashboardID == draftID) {
                this.deleteDatasourcePermission(snp.id);
            };
        });

        // - template Dashboard
        this.dashboards.forEach(d => {
            if (d.templateDashboardID == draftID) {
                d.templateDashboardID == 0;
                this.saveDashboard(d);
            };
        });

        // - hyperlinked Dashboard
        this.widgets.forEach(w => {
            if (w.hyperlinkDashboardID == draftID) {
                w.hyperlinkDashboardID = 0;
                this.saveWidget(w);
            };
        });

        // Delete the Draft D content created as part of the Draft version:
        // Dashboard
        this.deleteDashboard(draftID);

        // - Tabs
        this.dashboardTabs.forEach(t => {
            if (t.dashboardID == draftID) {
                this.deleteDashboardTab(t.id);
            };
        });

        // - Widgets
        this.widgets.forEach(w => {
            if (w.dashboardID == draftID) {
                this.deleteWidget(w.id);
            };
        });

        // - Checkpoints
        this.widgetCheckpoints.forEach(chk => {
            if (chk.dashboardID == draftID) {
                this.deleteWidgetCheckpoint(chk.id);
            };
        });

        // Permissions
        this.dashboardPermissions.forEach(per => {
            if (per.dashboardID == draftID) {
                this.deleteDatasourcePermission(per.id);
            };
        });

        // Return
        return originalID;

    }

    saveDraftDashboard(deleteSnapshots: boolean): Promise<number> {
        // saves Draft Dashboard back to the original, keeping all changes
        // Returns original dashboardID (for the current Draft D)

        // The following are unmodified:
        // - the AuditTrails are kept against the Draft

        console.log('%c    Global-Variables saveDraftDashboard ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // Set to current
        let draftID = this.currentDashboardInfo.value.currentDashboardID;
        let draftDashboard = this.letDashboard(draftID);
        let originalID = draftDashboard.originalID;
        let originalDashboard = this.letDashboard(originalID);
        let draftTabs: DashboardTab[] = this.dashboardTabs.filter(
            t => t.dashboardID == draftID
        );
        console.warn('xx ids', draftID, originalID)

        // The following are moved (added to the original version), removing any links
        // to the Draft version:
        // - Actions
        this.actions.forEach(act => {
            draftTabs.forEach(t => {
                if (act.dashboardID == t.dashboardID
                    &&
                    act.dashboardTabID == t.id) {
                        act.dashboardID = originalID;
                        act.dashboardTabID = t.originalID;
                        this.actionUpsert(
                            act.id,
                            act.dashboardID,
                            act.dashboardTabID,
                            null,
                            act.objectType,
                            act.action,
                            act.description,
                            act.undoID,
                            act.redoID,
                            act.oldWidget,
                            act.newWidget
                        );
                };
            });
        });

        // - Tasks
        this.canvasTasks.forEach(tsk => {
            if (tsk.linkedDashboardID == draftID) {
                tsk.linkedDashboardID = originalID;
                this.saveCanvasTask(tsk);
            };
        });

        // - Messages
        this.canvasMessages.forEach(msg => {
            draftTabs.forEach(t => {
                if (msg.dashboardID == t.dashboardID
                    &&
                    msg.dashboardTabID == t.id) {
                        msg.dashboardID = originalID;
                        msg.dashboardTabID = t.originalID;
                        this.saveCanvasMessage(msg);
                };
            });
        });

        // - Comments (link to Dashboard and Widget)
        this.canvasComments.forEach(com => {
            if (com.dashboardID == draftID) {
                com.dashboardID = originalID;
                this.saveCanvasComment(com);
            };
        });

        // The following are added (if there are any records) to the original:
        // - Tags
        let newTag: string = '';
        this.dashboardTags.forEach(tag => {
            console.warn('xx ids', draftID, originalID)
            if (tag.dashboardID == draftID) {
                newTag = tag.tag;
                this.dashboardTags.forEach(ot =>{
                    if (ot.dashboardID == originalID  &&  ot.tag == tag.tag) {
                        newTag = '';
                    };
                })
                if (newTag == '') {
                    this.deleteDashboardTag(tag.id);
                } else {
                    let newDashboardTag: DashboardTag = {
                        id: null,
                        dashboardID: originalID,
                        tag: newTag
                    }
                    this.addDashboardTag(newDashboardTag);
                };

            };
        });

        // The following entities are simply deleted (and those entities applicable to
        // the original remains unchanged):
        // - Subscriptions
        this.dashboardSubscriptions.forEach(sub => {
            if (sub.dashboardID == draftID) {
                this.deleteDashboardSubscription(sub.id);
            };
        });

        // - Schedules
        this.dashboardSchedules.forEach(sch => {
            if (sch.dashboardID == draftID) {
                this.deleteDashboardSchedule(sch.id);
            };
        });

        // - entry in recent Dashboards for the Draft
        this.dashboardsRecent.forEach(rec => {
            if (rec.dashboardID == draftID) {
                this.deleteDashboardRecent(rec.id);
            };
        });

        // - flag for Favourite Dashboard
        // - flag for Startup Dashboard
        this.canvasUsers.forEach(u => {
            if (u.startupDashboardID == draftID) {
                u.startupDashboardID = 0;
            };
            u.favouriteDashboards.filter(f => f != draftID)
            // TODO - improve this to not update ALL users
            this.saveCanvasUser(u);
        });

        // - permissions
        this.dashboardPermissions.forEach(per => {
            if (per.dashboardID == draftID) {
                this.deleteDashboardPermission(per.id);
            };
        });

        // Permissions
        this.dashboardPermissions.forEach(per => {
            if (per.dashboardID == draftID) {
                this.deleteDatasourcePermission(per.id);
            };
        });

        // - all snapshots (for the Draft) are deleted, EXCEPT the initial one
        if (deleteSnapshots) {
            this.dashboardSnapshots.forEach(snp => {
                if (snp.dashboardID == draftID  &&  snp.snapshotType != 'StartEditMode') {
                    this.deleteDashboardSnapshot(snp.id);
                };
            });
        };

        // The following are converted seamlessly, and pointers to Draft become pointers
        // to the original:
        // - template Dashboard
        this.dashboards.forEach(d => {
            if (d.templateDashboardID == draftID) {
                d.templateDashboardID == originalID;
                this.saveDashboard(d);
            };
        });

        // - hyperlinked Dashboard
        this.widgets.forEach(w => {
            if (w.hyperlinkDashboardID == draftID) {
                w.hyperlinkDashboardID = originalID;
                this.saveWidget(w);
            };
        });

        // Change the D
        return new Promise<number>((resolve, reject) => {

            let promiseArray = [];

            // Remove existing entities from Original Version:
            // - Tabs, Widgets, Checkpoints
            this.dashboardTabs.forEach(t => {
                if (t.dashboardID == originalID) {
                    promiseArray.push(this.deleteDashboardTab(t.id));
                };
            });
            this.widgets.forEach(w => {
                if (w.dashboardID == originalID) {
                    promiseArray.push(this.deleteWidget(w.id));
                };
            });
            this.widgetCheckpoints.forEach(chk => {
                if (chk.dashboardID == originalID) {
                    promiseArray.push(this.deleteWidgetCheckpoint(chk.id));
                };
            });

            // Move properties and entities from Draft to Original version:
            // - Tabs, Widgets, Checkpoints
            this.dashboardTabs.forEach(t => {
                if (t.dashboardID == draftID) {
                    t.dashboardID = originalID;
                    t.originalID = null;
                    promiseArray.push(this.saveDashboardTab(t));
                };
            });

            this.widgets.forEach(w => {
                if (w.dashboardID == draftID) {
                    w.dashboardID = originalID;
                    w.originalID = null;
                    promiseArray.push(this.saveWidget(w));
                };
            });
            this.widgetCheckpoints.forEach(chk => {
                if (chk.dashboardID == draftID) {
                    chk.dashboardID = originalID;
                    chk.originalID = null;
                    promiseArray.push(this.saveWidgetCheckpoint(chk));
                };
            });

            // Remove Draft D
            this.deleteDashboard(draftID);

            // Perform all the promises
            this.allWithAsync(...promiseArray).then(resolvedData => {
                // Dashboard
                originalDashboard = this.dashboardMoveInfo(originalID, draftDashboard);
                originalDashboard.state = 'Complete';
                this.saveDashboard(originalDashboard).then(res => {
                    resolve(originalID);
                })
            });

        });

    }

    deleteDashboardInfo(dashboardID: number) {
        // Deletes D with all related Entities
        console.log('%c    Global-Variables deleteDashboardInfo ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID);

        // TODO - update all from DB ?
        // Remove where D used as template
        this.dashboards.forEach(d => {
            if (d.templateDashboardID == dashboardID) {
                d.templateDashboardID == 0;
                this.saveDashboard(d);
            };
        });
        this.currentDashboards.forEach(d => {
            if (d.templateDashboardID == dashboardID) {
                d.templateDashboardID == 0;
            };
        });

        // Remove where D was used for hyperlink
        this.widgets.forEach(w => {
            if (w.hyperlinkDashboardID == dashboardID) {
                w.hyperlinkDashboardID = 0;
                this.saveWidget(w);
            };
        });
        this.currentWidgets.forEach(w => {
            if (w.hyperlinkDashboardID == dashboardID) {
                w.hyperlinkDashboardID = 0;
            };
        });

        // Remove where D was used as fav, startup
        this.canvasUsers.forEach(u => {
            if (u.startupDashboardID == dashboardID) {
                u.startupDashboardID = 0;
            };
            u.favouriteDashboards.filter(f => f != dashboardID)
            // TODO - improve this to not update ALL users
            this.saveCanvasUser(u);
        });

        // Delete D from DB
        this.deleteDashboard(dashboardID);

        // Delete Ts
        this.dashboardTabs.forEach(t => {
            if (t.dashboardID == dashboardID) {
                this.deleteDashboardTab(t.id);
            };
        });

        // Remove Ws
        this.widgets.forEach(w => {
            if (w.dashboardID == dashboardID) {
                this.deleteWidget(w.id);
            };
        });

        // Remove Snapshots
        this.dashboardSnapshots.forEach(snp => {
            if (snp.dashboardID == dashboardID) {
                this.deleteDashboardSnapshot(snp.id);
            };
        });

        // Remove where D was used as hyperlink in Msg
        this.canvasMessages.forEach(mes => {
            if (mes.dashboardID == dashboardID) {
                mes.dashboardID = null;
                this.saveCanvasMessage(mes);
            };
        });

        // Remove where D was used as hyperlink in Com
        this.canvasComments.forEach(com => {
            if (com.dashboardID == dashboardID) {
                this.saveCanvasComment(com);
            };
        });

        // Delete where D was used as hyperlink in Schedule
        this.dashboardSchedules.forEach(sch => {
            if (sch.dashboardID == dashboardID) {
                this.deleteDashboardSchedule(sch.id);
            };
        });

        // Delete where D was used as hyperlink in Sub
        this.currentDashboardSubscriptions.forEach(sub =>  {
            if (sub.dashboardID == dashboardID) {
                this.deleteDashboardSubscription(sub.id);
            };
        });

        // Delete where D was used as hyperlink in Tags
        this.dashboardTags.forEach(t => {
            if (t.dashboardID == dashboardID) {
                this.deleteDashboardTag(t.id);
            };
        });

        // Delete where D was used as hyperlink in Perm
        this.dashboardPermissions.forEach(t => {
            if (t.dashboardID == dashboardID) {
                this.deleteDashboardPermission(t.id);
            };
        });

        // Delete where D was used in Chkpnt
        this.widgetCheckpoints.forEach(chk => {
            if (chk.dashboardID == dashboardID) {
                this.deleteWidgetCheckpoint(chk.id);
            };
        });

        // Delete where D was used as Recent
        this.dashboardsRecent.forEach(dR => {
            if (dR.dashboardID == dashboardID) {
                this.deleteDashboardRecent(dR.id);
            };
        });

    }

    clearDashboardInfo() {
        // Clears all related Entities of a D
        console.log('%c    Global-Variables clearDashboardInfo ...',
        "color: black; background: lightgray; font-size: 10px");

        // TODO - find a better way to keep all related items in sync, and list updated
        this.currentDashboards = [];
        this.currentDashboardTabs = [];
        this.currentWidgets = [];
        this.currentDashboardSnapshots = [];
        this.currentDashboardSchedules = [];
        this.currentDashboardSubscriptions = [];
        this.currentDashboardTags = [];
        this.currentDashboardPermissions = [];
        this.currentWidgetCheckpoints = [];
        this.currentDashboards = [];
        this.currentDatasets = [];

    }

    addDashboard(data: Dashboard): Promise<any> {
        // Description: Adds a new Dashboard
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDashboard ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'dashboards';
        this.filePath = './assets/data.dashboards.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {

                    // Clear all related info
                    this.clearDashboardInfo();

                    // Update Global vars to make sure they remain in sync
                    this.dashboards.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboards.push(JSON.parse(JSON.stringify(data)));

                    console.log('addDashboard ADDED', data, this.dashboards)

                    resolve(data);
                },
                err => {
                    console.log('Error addDashboard FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveDashboard(data: Dashboard): Promise<string> {
        // Description: Saves Dashboard
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveDashboard ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboards';
        this.filePath = './assets/data.dashboards.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.dashboards.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.dashboards[localIndex] = data;
                    };
                    localIndex = this.currentDashboards.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.currentDashboards[localIndex] = data;
                    };


                    console.log('saveDashboard SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDashboard FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboard(id: number): Promise<string> {
        // Description: Deletes a Dashboard
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDashboard ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'dashboards';
        this.filePath = './assets/data.dashboards.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.dashboards = this.dashboards.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboards = this.currentDashboards.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDashboard DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboard FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getCurrentDashboard(dashboardID: number): Promise<Dashboard[]> {
        // Description: Gets current D (and optional Template)
        // Params:
        //   dashboardID
        // Returns: this.currentDashboards array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentDashboards ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID);

        // Refresh from source at start, or if dirty
        if (
            (this.currentDashboards.length == 0
            ||  this.dashboards.length == 0)
            ||  (this.isDirtyDashboards)
            ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(data => {

                        // Load the current Dashboard, and Optional template
                        // let currentDashboards: Dashboard[] = [];
                        this.currentDashboards = this.dashboards.filter(
                            i => i.id == dashboardID
                        );

                        if (this.currentDashboards.length > 0) {
                            if (this.currentDashboards[0].templateDashboardID != 0
                                &&
                                this.currentDashboards[0].templateDashboardID != null) {
                                let templateDashboard: Dashboard[] = null;

                                templateDashboard = this.dashboards.filter(
                                    i => i.id == this.currentDashboards[0].templateDashboardID
                                );

                                if (templateDashboard == null) {
                                    alert('Dashboard template id does not exist in Dashboards Array')
                                } else {
                                    this.currentDashboards.push(templateDashboard[0]);
                                    this.templateInUse.next(true);
                                }
                            } else {
                                this.templateInUse.next(false);
                            };
                        }
                        // this.currentDashboards.next(currentDashboards);

                        console.log('%c    Global-Variables getCurrentDashboards 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID, this.currentDashboards)
                        resolve(this.currentDashboards);

                })
             })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {

                // Load the current Dashboard, and Optional template
                // let currentDashboards: Dashboard[] = [];
                this.currentDashboards = this.dashboards.filter(
                    i => i.id == dashboardID
                );

                if (this.currentDashboards.length == 0) {
                    alert('xx global var error in getCurrentDashboard - this.currentDashboards.length == 0')
                }
                if (this.currentDashboards[0].templateDashboardID != 0  &&  this.currentDashboards[0].templateDashboardID != null) {
                    let templateDashboard: Dashboard[] = null;

                    templateDashboard = this.dashboards.filter(
                        i => i.id == this.currentDashboards[0].templateDashboardID
                    );

                    if (templateDashboard == null) {
                        alert('Dashboard template id does not exist in Dashboards Array')
                    } else {
                        this.currentDashboards.push(templateDashboard[0]);
                        this.templateInUse.next(true);
                    }
                } else {
                    this.templateInUse.next(false);
                };

                console.log('%c    Global-Variables getCurrentDashboards 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID, this.currentDashboards)
                resolve(this.currentDashboards);
            });
        };

    }

    getDashboardTabs(): Promise<DashboardTab[]> {
        // Description: Gets all T
        // Returns: this.dashboardTabs array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDashboardTabs ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardTabs';
        this.filePath = './assets/data.dashboardTabs.json';

        return new Promise<DashboardTab[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardTabs.length == 0)  ||  (this.isDirtyDashboardTabs) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardTabs = data;
                        this.isDirtyDashboardTabs = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDashboardTabs 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dashboardTabs)
                        resolve(this.dashboardTabs);
                    });
            } else {
                console.log('%c    Global-Variables getDashboardTabs 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                resolve(this.dashboardTabs);
            }
        });

    }

    getCurrentDashboardTabs(dashboardID: number): Promise<DashboardTab[]> {
        // Description: Gets all T for current D
        // Params:
        //   dashboardID
        // Returns: this.currentDashboardTabs array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentDashboardTabs ...',
            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
            dashboardID);

            // Refresh from source at start, or if dirty
        if ( (this.dashboardTabs.length == 0)  ||  (this.isDirtyDashboardTabs) ) {
            return new Promise<DashboardTab[]>((resolve, reject) => {
                this.getDashboardTabs()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardTabs = data;
                        this.currentDashboardTabs = this.currentDashboardTabs.sort( (obj1,obj2) => {
                            if (obj1.displayOrder > obj2.displayOrder) {
                                return 1;
                            };
                            if (obj1.displayOrder < obj2.displayOrder) {
                                return -1;
                            };
                            return 0;
                        });

                        console.log('%c    Global-Variables getCurrentDashboardTabs 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID, this.currentDashboardTabs)
                        resolve(this.currentDashboardTabs);

                })
             })
        } else {
            return new Promise<DashboardTab[]>((resolve, reject) => {
                let returnData: DashboardTab[];
                returnData = this.dashboardTabs.filter(
                        i => i.dashboardID == dashboardID
                );
                this.currentDashboardTabs = this.currentDashboardTabs.sort( (obj1,obj2) => {
                    if (obj1.displayOrder > obj2.displayOrder) {
                        return 1;
                    };
                    if (obj1.displayOrder < obj2.displayOrder) {
                        return -1;
                    };
                    return 0;
                });

                this.currentDashboardTabs = returnData;
                console.log('%c    Global-Variables getCurrentDashboardTabs 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID, this.currentDashboardTabs)
                resolve(this.currentDashboardTabs);
            });
        };

    }

    addDashboardTab(data: DashboardTab): Promise<any> {
        // Description: Adds a new DashboardTab
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDashboardTab ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'dashboardTabs';
        this.filePath = './assets/data.dashboardTabs.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {

                    // Update Global vars to make sure they remain in sync
                    this.dashboardTabs.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboardTabs.push(JSON.parse(JSON.stringify(data)));

                    console.log('addDashboardTab ADDED', data, this.dashboardTabs)

                    resolve(data);
                },
                err => {
                    console.log('Error addDashboardTab FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveDashboardTab(data: DashboardTab): Promise<string> {
        // Description: Saves DashboardTab
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveDashboardTab ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardTabs';
        this.filePath = './assets/data.dashboardTabs.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.currentDashboardTabs.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.currentDashboardTabs[localIndex] = data;
                    };
                    localIndex = this.dashboardTabs.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.dashboardTabs[localIndex] = data;
                    };


                    console.log('saveDashboardTab SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDashboardTab FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboardTab(id: number): Promise<string> {
        // Description: Deletes a DashboardTab
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDashboardTab ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'dashboardTabs';
        this.filePath = './assets/data.dashboardTabs.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    // Reset the displayOrder of the Rest
                    let dashboardTabIndex: number = this.dashboardTabs.findIndex(t =>
                        t.id == id
                    );
                    let dashboardTabDisplayOrder: number = this.dashboardTabs.length + 1;
                    if (dashboardTabIndex >= 0) {
                        dashboardTabDisplayOrder = this.dashboardTabs[dashboardTabIndex]
                            .displayOrder;
                    };

                    // Update local Arrays
                    this.dashboardTabs = this.dashboardTabs.filter(
                        t => t.id != id
                    );
                    this.currentDashboardTabs = this.currentDashboardTabs.filter(
                        t => t.id != id
                    );

                    // Update displayOrder for the rest
                    let promiseArray = [];
                    
                    this.currentDashboardTabs.forEach(t => {
                        console.warn('xx del t', dashboardTabDisplayOrder, t)
                        if (t.displayOrder > dashboardTabDisplayOrder) {
                            t.displayOrder = t.displayOrder - 1;
                        };
                        promiseArray.push(this.saveDashboardTab(t));
                    });

                    this.allWithAsync(...promiseArray)
                        .then(res => {

                        console.log('deleteDashboardTab DELETED id: ', id)
                        resolve('Deleted');
                    });
                },
                err => {
                    console.log('Error deleteDashboardTab FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getDashboardSamples(): Promise<Dashboard[]> {
        // Description: Gets all Sample D
        // Returns: an array extracted from [D], unless:
        //   If D not cached or if dirty, get from File
        console.log('%c    Global-Variables getDashboardSamples ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // Refresh from source at start, or if dirty
        if ( (this.dashboards.length == 0)  ||  (this.isDirtyDashboards) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(data => {
                        data = data.filter(
                            i => (i.isSample)
                        );
                        console.log('%c    Global-Variables getDashboardSamples 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data)
                        resolve(data);

                })
            })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {
                let data: Dashboard[] = this.dashboards.filter(
                    i => (i.isSample)
                )
                console.log('%c    Global-Variables getDashboardSamples 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data)
                resolve(data);
            });
        };

    }

    getDashboardsRecent(userID: string): Promise<DashboardRecent[]>  {
        // Description: Gets an array of recently used D (not the Ds itself)
        // Returns: return array from source, not cached
        // Note:  data is ALWAYS synced to 3 different places:
        // - DB
        // - this.dashboardsRecent (array in Global Vars)
        // - dashboardsRecentBehSubject (.next)
        console.log('%c    Global-Variables getDashboardsRecent ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardsRecent';
        this.filePath = './assets/data.dashboardsRecent.json';

        return new Promise<DashboardRecent[]>((resolve, reject) => {

            // Refresh from source at start
            this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
            this.get(url).then(res => {

                // TODO - http must be sorted => include in Options ...
                let temp: DashboardRecent[] = res.filter(
                    i => i.userID == userID
                );

                // Add State and Name, at Runtime
                for (var x = 0; x < temp.length; x++) {
                    temp[x].stateAtRunTime = 'Deleted';
                    for (var y = 0; y < this.dashboards.length; y++) {
                        if (this.dashboards[y].id ==
                            temp[x].dashboardID) {
                                temp[x].stateAtRunTime = this.dashboards[y].state;
                                temp[x].nameAtRunTime = this.dashboards[y].name;
                            };
                        };
                    };

                // Sort DESC
                // TODO - in DB, ensure dateTime stamp is used, as IDs may not work
                temp = temp.sort( (obj1,obj2) => {
                    if (obj1.accessed > obj2.accessed) {
                        return -1;
                    };
                    if (obj1.accessed < obj2.accessed) {
                        return 1;
                    };
                    return 0;
                });

                // Remove Deleted ones
                temp = temp.filter(t => t.stateAtRunTime != 'Deleted');

                this.dashboardsRecent = temp;
                this.dashboardsRecentBehSubject.next(temp);
                this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                this.isDirtyDashboardsRecent = false;
                console.log('%c    Global-Variables dashboardsRecent 1',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", temp)
                resolve(temp);
            });
        });
    }

    dashboardIndexInRecentList(dashboardID: number): number {
        // Returns index of first D in the Recent list. Else -1
        console.log('%c    Global-Variables dashboardIndexInRecentList ...',
        "color: black; background: lightgray; font-size: 10px");

        // Determine index in Recent list
        let index: number = this.dashboardsRecent.findIndex(dR =>
            dR.dashboardID == dashboardID
        );
        return index;
    }

    dashboardTabIndexInRecentList(dashboardID: number, dashboardTabID: number): number {
        // Returns index of first D, T in the Recent list.  Else -1
        console.log('%c    Global-Variables dashboardTabIndexInRecentList ...',
        "color: black; background: lightgray; font-size: 10px");

        // Determine index in Recent list
        let index: number = this.dashboardsRecent.findIndex(dR =>
            dR.dashboardID == dashboardID
            &&
            dR.dashboardTabID == dashboardTabID
        );
        return index;
    }

    amendDashboardRecent(
        dashboardID: number,
        dashboardTabID: number): Promise<any>  {
        // Compares given IDs against the Recent list:
        // - if D not there, call ADD
        // - if D there but T change, call SAVE
        // - if D & T there, do nothing
        console.log('%c    Global-Variables amendDashboardRecent ...',
        "color: black; background: lightgray; font-size: 10px", dashboardID, dashboardTabID);

        // TODO - fix this timing issue, as I have no idea why this is happening here
        // this.sleep(2000);

        let indexD: number = this.dashboardIndexInRecentList(dashboardID);
        let indexTab: number = this.dashboardTabIndexInRecentList(dashboardID, dashboardTabID);
        let today = new Date();

        // D not in Recent List, so Add
        if (indexD == -1) {

            let newRecent: DashboardRecent = {
                id: null,
                userID: this.currentUser.userID,
                dashboardID: dashboardID,
                dashboardTabID: dashboardTabID,
                editMode: this.editMode.value,
                accessed: this.formatDate(today),
                stateAtRunTime: 'Draft',
                nameAtRunTime: ''
            };
            return new Promise<any>((resolve, reject) => {
                this.addDashboardRecent(newRecent).then(dR =>
                    resolve(dR)
                )
            });
        } else {

            // D + T in Recent List, so amend
            let recentD: DashboardRecent = this.dashboardsRecent[indexD];

            // Change Tab
            if (indexTab == -1) {
                recentD.dashboardTabID = dashboardTabID;
            };

            // Reset editMode, accessed
            recentD.editMode = this.editMode.value;
            recentD.accessed = this.formatDate(today);

            return new Promise<any>((resolve, reject) => {
                this.saveDashboardRecent(recentD).then(res =>
                    resolve(recentD)
                )
            });
        };

    }

    addDashboardRecent(data: DashboardRecent): Promise<any> {
        // Adds a D to the Recent list, and update:
        // - this.dashboardsRecent
        // - this.dashboardsRecentBehSubject.next()
        console.log('%c    Global-Variables addDashboardRecent ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardsRecent';
        this.filePath = './assets/data.dashboardsRecent.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3001/' + url, data, {headers})
            .subscribe(
                res => {

                    let temp: DashboardRecent = JSON.parse(JSON.stringify(res));

                    // Add State and Name, at Runtime
                    for (var i = 0; i < this.dashboards.length; i++) {
                        if (this.dashboards[i].id ==
                            temp.dashboardID) {
                                temp.stateAtRunTime = this.dashboards[i].state;
                                temp.nameAtRunTime = this.dashboards[i].name;
                        };
                    };

                    // Update Global vars to make sure they remain in sync
                    this.dashboardsRecent = [temp].concat(this.dashboardsRecent);

                    this.dashboardsRecentBehSubject.next(this.dashboardsRecent);

                    console.log('dashboardsRecent ADDED', res, this.dashboardsRecent)
                    resolve(temp);
                },
                err => {
                    console.log('Error dashboardsRecent FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveDashboardRecent(data: DashboardRecent): Promise<string> {
        // Description: Saves DashboardRecent
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveDashboardRecent ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardsRecent';
        this.filePath = './assets/data.dashboardsRecent.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3001/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.dashboardsRecent.findIndex(u =>
                        u.id == data.id
                    );
                    this.dashboardsRecent[localIndex] = data;

                    // Change order - last accessed one must be at top
                    let temp: DashboardRecent[] = [ this.dashboardsRecent[localIndex] ].concat(
                        this.dashboardsRecent.filter(dR => dR.id != data.id)
                    );
                    this.dashboardsRecent = temp;
                    this.dashboardsRecentBehSubject.next(this.dashboardsRecent);

                    console.log('saveDashboardRecent SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDashboardRecent FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboardRecent(id: number): Promise<string> {
        // Description: Deletes a Recent Dashboard, and updates:
        // - this.dashboardsRecent
        // - this.dashboardsRecentBehSubject.next()
        // Returns 'Deleted' or error message
        console.log('%c    Global-Variables deleteDashboardRecent ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'dashboardsRecent';
        this.filePath = './assets/data.dashboardsRecent.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3001/' + url + '/' + id, {headers})
            .subscribe(
                res => {

                    this.dashboardsRecent = this.dashboardsRecent.filter(
                        rec => rec.id != id
                    );

                    this.dashboardsRecentBehSubject.next(this.dashboardsRecent);

                    console.log('deleteDashboardRecent DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardRecent FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getDataConnections(): Promise<DataConnection[]> {
        // Description: Gets DataConnections, WITHOUT data
        // Returns: this.dataConnection
        console.log('%c    Global-Variables getDataConnections ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dataConnections';
        this.filePath = './asConnections/data.dataConnections.json';

        return new Promise<DataConnection[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dataConnections.length == 0)  ||  (this.isDirtyDataConnections) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dataConnections = data;
                        this.isDirtyDataConnections = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDataConnection 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dataConnections)
                        resolve(this.dataConnections);
                    });
            } else {
                console.log('%c    Global-Variables getDataConnection 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dataConnections)
                resolve(this.dataConnections);
            }
        });

    }

    addDataConnection(data: DataConnection): Promise<any> {
        // Description: Adds a new DataConnection
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDataConnection ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'DataConnections';
        this.filePath = './assets/data.DataConnections.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3001/' + url, data, {headers})
            .subscribe(
                data => {

                    // Update Global vars to make sure they remain in sync
                    this.dataConnections.push(JSON.parse(JSON.stringify(data)));

                    console.log('addDataConnection ADDED', data, this.dataConnections)

                    resolve(data);
                },
                err => {
                    console.log('Error addDataConnection FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveDataConnection(data: DataConnection): Promise<string> {
        // Description: Saves DataConnection
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveDataConnection ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'DataConnections';
        this.filePath = './assets/data.DataConnections.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3001/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.dataConnections.findIndex(d =>
                        d.id == data.id
                    );
                    this.dataConnections[localIndex] = data;

                    console.log('saveDataConnection SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDataConnection FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDataConnection(id: number): Promise<string> {
        // Description: Deletes a DataConnections
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDataConnection ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'DataConnections';
        this.filePath = './assets/data.DataConnections.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3001/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.dataConnections = this.dataConnections.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDataConnection DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDataConnection FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getDatasourceTransformations(): Promise<DatasourceTransformation[]> {
        // Description: Gets DatasourceTransformations
        // Returns: this.DatasourceTransformation
        console.log('%c    Global-Variables getDatasourceTransformations ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'datasourceTransformations';
        this.filePath = './asConnections/data.datasourceTransformations.json';

        return new Promise<DatasourceTransformation[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourceTransformations.length == 0)  ||  (this.isDirtyDatasourceTransformations) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasourceTransformations = data;
                        this.isDirtyDatasourceTransformations = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDatasourceTransformation 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.datasourceTransformations)
                        resolve(this.datasourceTransformations);
                    });
            } else {
                console.log('%c    Global-Variables getDatasourceTransformation 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.datasourceTransformations)
                resolve(this.datasourceTransformations);
            }
        });

    }

    addDatasourceTransformation(data: DatasourceTransformation): Promise<any> {
        // Description: Adds a new DatasourceTransformation
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDatasourceTransformation ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'datasourceTransformations';
        this.filePath = './assets/data.datasourceTransformations.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {

                    // Update Global vars to make sure they remain in sync
                    this.datasourceTransformations.push(JSON.parse(JSON.stringify(data)));

                    console.log('addDatasourceTransformation ADDED', data, this.datasourceTransformations)

                    resolve(data);
                },
                err => {
                    console.log('Error addDatasourceTransformation FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveDatasourceTransformation(data: DatasourceTransformation): Promise<string> {
        // Description: Saves DatasourceTransformation
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveDatasourceTransformation ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'datasourceTransformations';
        this.filePath = './assets/data.datasourceTransformations.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.datasourceTransformations.findIndex(d =>
                        d.id == data.id
                    );
                    this.datasourceTransformations[localIndex] = data;

                    console.log('saveDatasourceTransformation SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDatasourceTransformation FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDatasourceTransformation(id: number): Promise<string> {
        // Description: Deletes a DatasourceTransformations
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDatasourceTransformation ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'datasourceTransformations';
        this.filePath = './assets/data.datasourceTransformations.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.datasourceTransformations = this.datasourceTransformations.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDatasourceTransformation DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDatasourceTransformation FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getDataTable(): Promise<DataTable[]> {
        // Description: Gets DataTables, WITHOUT data
        // Returns: this.dataTable
        console.log('%c    Global-Variables getDataTable ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dataTables';
        this.filePath = './asTables/data.dataTables.json';

        return new Promise<DataTable[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dataTables.length == 0)  ||  (this.isDirtyDataTables) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dataTables = data;
                        this.isDirtyDataTables = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDataTable 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dataTables)
                        resolve(this.dataTables);
                    });
            } else {
                console.log('%c    Global-Variables getDataTable 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dataTables)
                resolve(this.dataTables);
            }
        });

    }

    getDataField(): Promise<DataField[]> {
        // Description: Gets DataFields, WITHOUT data
        // Returns: this.dataField
        console.log('%c    Global-Variables getDataField ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dataFields';
        this.filePath = './asFields/data.dataFields.json';

        return new Promise<DataField[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dataFields.length == 0)  ||  (this.isDirtyDataFields) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dataFields = data;
                        this.isDirtyDataFields = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDataField 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dataFields)
                        resolve(this.dataFields);
                    });
            } else {
                console.log('%c    Global-Variables getDataField 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dataFields)
                resolve(this.dataFields);
            }
        });

    }

    getDataset(): Promise<Dataset[]> {
        // Description: Gets Datasets, WITHOUT data
        // Returns: this.dataset
        console.log('%c    Global-Variables getDataset ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'datasets';
        this.filePath = './assets/data.datasets.json';

        return new Promise<Dataset[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasets.length == 0)  ||  (this.isDirtyDatasets) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasets = data;
                        this.isDirtyDatasets = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDataset 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.datasets)
                        resolve(this.datasets);
                    });
            } else {
                console.log('%c    Global-Variables getDataset 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.datasets)
                resolve(this.datasets);
            }
        });

    }

    getCurrentDataset(datasourceID: number, datasetID: number): Promise<Dataset> {
        // Description: Gets a Dataset, and inserts it once into this.currentDatasets
        // Returns: dataset
        console.log('%c    Global-Variables getCurrentDataset ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dataset';
        this.filePath = './assets/data.datasets.json';

        // Get list of dSet-ids to make array work easier
        let dsCurrIDs: number[] = [];       // currentDataset IDs
        let dsSourceLocation: string = '';
        let folderName: string = '';
        let fileName: string = '';
        this.currentDatasets.forEach(d => dsCurrIDs.push(d.id));
        let datasetIndex: number = null;

        // this.datasets.forEach(ds => {
        //     if (ds.id == datasetID) {
        //         dsSourceLocation = ds.sourceLocation;
        //         url = ds.url;
        //         if (ds.folderName == ''  ||  ds.folderName == null) {
        //             ds.folderName = '../assets/';
        //         };
        //         if (ds.fileName == ''  ||  ds.fileName == null) {
        //             ds.fileName = 'data.dataset' + ds.id.toString() + '.json';
        //         };
        //         folderName = ds.folderName;
        //         fileName = ds.fileName;
        //         this.filePath = ds.folderName + ds.fileName;
        //     }
        // });
        for (var i = 0; i < this.datasets.length; i++) {
            if (this.datasets[i].id == datasetID) {
                datasetIndex = i;
                dsSourceLocation = this.datasets[i].sourceLocation;
                url = this.datasets[i].url;
                if (this.datasets[i].folderName == ''  ||  this.datasets[i].folderName == null) {
                    this.datasets[i].folderName = '../assets/';
                };
                if (this.datasets[i].fileName == ''  ||  this.datasets[i].fileName == null) {
                    this.datasets[i].fileName = 'data.dataset' + this.datasets[i].id.toString() + '.json';
                };
                folderName = this.datasets[i].folderName;
                fileName = this.datasets[i].fileName;
                this.filePath = this.datasets[i].folderName + this.datasets[i].fileName;
            }
        };

        return new Promise<any>((resolve, reject) => {

            // Data already in dataset
            if (dsSourceLocation == '') {

                if (datasetIndex != null) {
                    // Add to Currentatasets (contains all data) - once
                    if (dsCurrIDs.indexOf(datasetID) < 0) {
                        this.currentDatasets.push(this.datasets[datasetIndex]);
                    };
                } else {
                    console.log('Error in getCurrentDataset - datasetIndex == null')
                };
            };

            // Get data from the correct place
            if (dsSourceLocation == 'localDB') {

                this.getLocal('Dataset')
                .then(data => {
                    let newdSet: Dataset = data;

                    // // Add to datasets (contains all data) - once
                    // if (dSetIDs.indexOf(datasetID) < 0) {
                    //     this.datasets.push(newdSet);
                    // };

                    // Add to Currentatasets (contains all data) - once
                    if (dsCurrIDs.indexOf(datasetID) < 0) {
                        this.currentDatasets.push(newdSet);
                    };

                    console.log('%c    Global-Variables getCurrentDataset 1 from ',
                    "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dsSourceLocation, datasourceID,
                        datasetID, newdSet, 'currentDatasets', this.currentDatasets)
                    resolve(newdSet);
                });
            };

            if (dsSourceLocation == 'file') {
                // TODO - fix this via real http
                let dataurl: string = this.filePath;
                this.get(dataurl)
                    .then(dataFile => {

                        let newdSet: Dataset = {
                            id: datasetID,
                            datasourceID: datasourceID,
                            url: url,
                            sourceLocation: 'file',
                            folderName: folderName,
                            fileName: fileName,
                            data: dataFile,
                            dataRaw: dataFile
                        };

                        // // Add to datasets (contains all data) - once
                        // if (dSetIDs.indexOf(datasetID) < 0) {
                        //     this.datasets.push(newdSet);
                        // };

                        // Add to Currentatasets (contains all data) - once
                        if (dsCurrIDs.indexOf(datasetID) < 0) {
                            this.currentDatasets.push(newdSet);
                        };

                        console.log('%c    Global-Variables getCurrentDataset 1 from ',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dsSourceLocation, datasourceID,
                            datasetID, newdSet, 'currentDatasets', this.currentDatasets)
                        resolve(newdSet);
                    }
                );
            };

            if (dsSourceLocation == 'HTTP') {

                this.get(url)
                    .then(dataFile => {

                        let newdSet: Dataset = {
                            id: datasetID,
                            datasourceID: datasourceID,
                            url: url,
                            sourceLocation: 'HTTP',
                            folderName: folderName,
                            fileName: fileName,
                            data: dataFile.data,
                            dataRaw: dataFile.data
                        };

                        // // Add to datasets (contains all data) - once
                        // if (dSetIDs.indexOf(datasetID) < 0) {
                        //     this.datasets.push(newdSet);
                        // };

                        // Add to Currentatasets (contains all data) - once
                        if (dsCurrIDs.indexOf(datasetID) < 0) {
                            this.currentDatasets.push(newdSet);
                        };

                        console.log('%c    Global-Variables getCurrentDataset 1 from ',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dsSourceLocation, datasourceID,
                            datasetID, newdSet, 'currentDatasets', this.currentDatasets)
                        resolve(newdSet);
                    }
                );
            };
        });
    }

    addDataset(data: Dataset): Promise<any> {
        // Description: Adds a new Dataset
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDataset ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        // let url: string = data.url;
        // this.filePath = data.folderName + data.fileName;
        let url: string = 'datasets';
        this.filePath = './assets/data.datasets.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {

                    // Update Global vars to make sure they remain in sync
                    this.datasets.push(JSON.parse(JSON.stringify(data)));
                    this.currentDatasets.push(JSON.parse(JSON.stringify(data)));

                    console.log('addDataset ADDED', res, this.datasets, this.currentDatasets)

                    resolve(res);
                },
                err => {
                    console.log('Error addDataset FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getData(id: number): Promise<any[]> {
        // Description: Gets Datasets, WITHOUT data
        // Returns: this.dataset
        console.log('%c    Global-Variables getData ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'data/' + id.toString();
        this.filePath = './assets/data.datasets.json';

        return new Promise<Dataset[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            // if ( (this.datasets.length == 0)  ||  (this.isDirtyDatasets) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(res => {
                        // TODO - load here, or in calling routing
                        // this.datasets[xxx from id].rawData & .data = data;
                        // this.isDirtyDatasets = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getData',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", res)
                        resolve(res.data);
                    });
            // } else {
            //     console.log('%c    Global-Variables getData 2', this.datasets)
            //     resolve(this.datasets);
            // }
        });

    }

    addData(data: any): Promise<any> {
        // Description: Adds DATA used in a new Dataset
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addData  ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        // let url: string = data.url;
        // this.filePath = data.folderName + data.fileName;
        let url: string = 'data';
        this.filePath = './assets/data.dataset' + data.id + '.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {

                    console.log('addData ADDED', res, this.datasets, this.currentDatasets)

                    resolve(res);
                },
                err => {
                    console.log('Error addData FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    filterSlicer(dataSet: Dataset): Dataset {
        // Filter a given Dataset on .dataRaw by applying all applicable Sl, and put result
        // into .data
        // Note: Objects and arrays are passed by reference. Primitive values like number,
        // string, boolean are passed by value.  Thus, original object (dSet) is modified here.
        console.log('%c    Global-Variables filterSlicer ...',
        "color: black; background: lightgray; font-size: 10px");

        this.currentWidgets.forEach(w => {
            console.warn('xx strt graphData', w.graphUrl, w.graphData);
        });

        // Get all Sl for the given dSet
        // TODO: cater (carefully) for case where sl.datasetID == -1, ie what if DS has
        // two dSets with different values ...
        let relatedSlicers: Widget[] = this.currentWidgets.filter(w =>
            w.datasourceID == dataSet.datasourceID
            &&  w.datasetID == dataSet.id
            &&  w.widgetType == 'Slicer'
        );

        // Reset the filtered data
        dataSet.data = dataSet.dataRaw;

        // Loop on related Sl and filter data
        relatedSlicers.forEach(w => {
            console.log('sl-filter 0', w.slicerType)

            // Type = List
            if (w.slicerType == 'List') {

                // Build array of selection values
                let selectedValues: string[] = [];
                let allSelectedValues: string[] = [];

                w.slicerSelection.forEach(f => {
                    if (f.isSelected) {
                        selectedValues.push(f.fieldValue);
                    };
                    allSelectedValues.push(f.fieldValue);
                });

                // Apply selected once, empty means all
                let tempData: any = [];
                    dataSet.data.forEach(d => {
                        if (selectedValues.indexOf(d[w.slicerFieldName]) >= 0) {
                            tempData.push(d);
                        };
                        if ( (w.slicerAddRest  &&  w.slicerAddRestValue)
                            &&
                            allSelectedValues.indexOf(d[w.slicerFieldName]) < 0) {
                                tempData.push(d);
                        };
                    });

                    // Replace the filtered data, used by the graph
                dataSet.data = tempData;

            };

            // Type = Bins
            if (w.slicerType == 'Bins') {

                // Build array of selection values
                let rangeValues: {fromValue: number; toValue:number}[] = [];

                w.slicerBins.forEach(bn => {
                    if (bn.isSelected) {
                        rangeValues.push(
                            {fromValue: bn.fromValue, toValue: bn.toValue}
                        )
                    };
                });

                // Loop on Bins, and add filtered ones
                let filterBinData: any = [];

                rangeValues.forEach(rv => {
                    dataSet.data.forEach(d => {
                        if (+d[w.slicerFieldName] >= rv.fromValue
                            &&
                            +d[w.slicerFieldName] <= rv.toValue) {
                                filterBinData.push(d);
                        };
                    });
                });

                // Replace the filtered data, used by the graph
                dataSet.data = filterBinData;

            };
        });

        // Filter data in [W] related to this dSet
        // TODO - cater later for cases for we use graphUrl
        this.currentWidgets.forEach(w => {
            if (w.datasourceID == dataSet.datasourceID
                &&   w.datasetID == dataSet.id
                && w.widgetType != 'Slicer') {
                    w.graphUrl = "";
                    w.graphData = dataSet.data;
            };
        });

        console.warn('xx filt Sl', this.currentWidgets, dataSet)
        return dataSet;
    }

    getDashboardSchedules(): Promise<DashboardSchedule[]> {
        // Description: Gets all Sch
        // Returns: this.dashboardSchedules array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDashboardSchedules ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardSchedules';
        this.filePath = './assets/data.dashboardSchedules.json';

        return new Promise<DashboardSchedule[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardSchedules.length == 0)  ||  (this.isDirtyDashboardSchedules) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        console.log('getDashboardSchedules data', data)
                        this.dashboardSchedules = data;
                        this.isDirtyDashboardSchedules = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDashboardSchedules 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                        resolve(this.dashboardSchedules);
                    });
            } else {
                console.log('%c    Global-Variables getDashboardSchedules 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                resolve(this.dashboardSchedules);
            }
        });

    }

    getCurrentDashboardSchedules(dashboardID: number): Promise<DashboardSchedule[]> {
        // Description: Gets all Sch for current D
        // Params:
        //   dashboardID
        // Returns: this.currentDashboardSchedules array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentDashboardSchedules ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // Refresh from source at start, or if dirty
        if ( (this.dashboardSchedules.length == 0)  ||  (this.isDirtyDashboardSchedules) ) {
            return new Promise<DashboardSchedule[]>((resolve, reject) => {
                this.getDashboardSchedules()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardSchedules = data;
                        console.log('%c    Global-Variables getCurrentDashboardSchedules 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            dashboardID, data)
                        resolve(this.currentDashboardSchedules);
                })
             })
        } else {
            return new Promise<DashboardSchedule[]>((resolve, reject) => {
                let returnData: DashboardSchedule[];
                returnData = this.dashboardSchedules.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardSchedules = returnData;
                console.log('%c    Global-Variables getCurrentDashboardSchedules 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                    dashboardID, returnData)
                resolve(this.currentDashboardSchedules);
            });
        };
    }

    addDashboardSchedule(data: DashboardSchedule): Promise<any> {
        // Description: Adds a new DashboardSchedule
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDashboardSchedule ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'dashboardSchedules';
        this.filePath = './assets/data.dashboardSchedules.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {

                    // Update Global vars to make sure they remain in sync
                    this.dashboardSchedules.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboardSchedules.push(JSON.parse(JSON.stringify(data)));

                    console.log('addDashboardSchedule ADDED', data,
                        this.currentDashboardSchedules, this.dashboardSchedules)

                    resolve(data);
                },
                err => {
                    console.log('Error addDashboardSchedule FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveDashboardSchedule(data: DashboardSchedule): Promise<string> {
        // Description: Saves DashboardSchedule
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveDashboardSchedule ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardSchedules';
        this.filePath = './assets/data.dashboardSchedules.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.dashboardSchedules.findIndex(d =>
                        d.id == data.id
                    );
                    this.dashboardSchedules[localIndex] = data;

                    console.log('saveDashboardSchedule SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDashboardSchedule FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboardSchedule(id: number): Promise<string> {
        // Description: Deletes a DashboardSchedules
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDashboardSchedule ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'dashboardSchedules';
        this.filePath = './assets/data.dashboardSchedules.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.dashboardSchedules = this.dashboardSchedules.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardSchedules = this.currentDashboardSchedules.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDashboardSchedule DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardSchedule FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getDashboardTags(): Promise<DashboardTag[]> {
        // Description: Gets all Sch
        // Returns: this.dashboardTagsget array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDashboardTags ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardTags';
        this.filePath = './assets/data.dashboardTags.json';

        return new Promise<DashboardTag[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardTags.length == 0)  ||  (this.isDirtyDashboardTags) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardTags = data;
                        this.isDirtyDashboardTags = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDashboardTags 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                        resolve(this.dashboardTags);
                    });
            } else {
                console.log('%c    Global-Variables getDashboardTags 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                resolve(this.dashboardTags);
            }
        });

    }

    getCurrentDashboardTags(dashboardID: number): Promise<DashboardTag[]> {
        // Description: Gets all Tags for current D
        // Params:
        //   dashboardID
        // Returns: this.currentDashboardTags array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentDashboardTags ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // Refresh frogetm source at start, or if dirty
        if ( (this.dashboardTags.length == 0)  ||  (this.isDirtyDashboardTags) ) {
            return new Promise<DashboardTag[]>((resolve, reject) => {
                this.getDashboardTags()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardTags = data;
                        console.log('%c    Global-Variables getCurrentDashboardTags 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            dashboardID, data)
                        resolve(this.currentDashboardTags);
                })
             })
        } else {
            return new Promise<DashboardTag[]>((resolve, reject) => {
                let returnData: DashboardTag[];
                returnData = this.dashboardTags.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardTags = returnData;
                console.log('%c    Global-Variables getCurrentDashboardTags 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID)
                resolve(this.currentDashboardTags);
            });
        };
    }

    addDashboardTag(data: DashboardTag): Promise<any> {
        // Description: Adds a new DashboardTag
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDashboardTag ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'dashboardTags';
        this.filePath = './assets/data.dashboardTags.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {

                    // Update Global vars to make sure they remain in sync
                    this.dashboardTags.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboardTags.push(JSON.parse(JSON.stringify(data)));

                    console.log('addDashboardTag ADDED', data, this.dashboardTags)

                    resolve(data);
                },
                err => {
                    console.log('Error addDashboardTag FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboardTag(id: number): Promise<string> {
        // Description: Deletes a DashboardTag
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDashboardTag ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'dashboardTags';
        this.filePath = './assets/data.dashboardTags.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.dashboardTags = this.dashboardTags.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardTags = this.currentDashboardTags.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDashboardTag DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardTag FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getDashboardPermissions(): Promise<DashboardPermission[]> {
        // Description: Gets all P
        // Returns: this.dashboardPermissions array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDashboardPermissions ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardPermissions';
        this.filePath = './assets/data.dashboardPermissions.json';

        return new Promise<DashboardPermission[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardPermissions.length == 0)  ||  (this.isDirtyDashboardPermissions) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardPermissions = data;
                        this.isDirtyDashboardPermissions = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDashboardPermissions 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                        resolve(this.dashboardPermissions);
                    });
            } else {
                console.log('%c    Global-Variables getDashboardPermissions 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                resolve(this.dashboardPermissions);
            }
        });

    }

    getCurrentDashboardPermissions(dashboardID: number): Promise<DashboardPermission[]> {
        // Description: Gets all Sch for current D
        // Params:
        //   dashboardID
        // Returns: this.currentDashboardPermissions array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentDashboardPermissions ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // Refresh from source at start, or if dirty
        if ( (this.dashboardPermissions.length == 0)  ||  (this.isDirtyDashboardPermissions) ) {
            return new Promise<DashboardPermission[]>((resolve, reject) => {
                this.getDashboardPermissions()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardPermissions =data;
                        console.log('%c    Global-Variables getCurrentDashboardPermissions 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            dashboardID, data)
                        resolve(this.currentDashboardPermissions);
                })
             })
        } else {
            return new Promise<DashboardPermission[]>((resolve, reject) => {
                let returnData: DashboardPermission[];
                returnData = this.dashboardPermissions.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardPermissions =returnData;
                console.log('%c    Global-Variables getCurrentDashboardPermissions 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID)
                resolve(this.currentDashboardPermissions);
            });
        };
    }

    addDashboardPermission(data: DashboardPermission): Promise<any> {
        // Description: Adds a new DashboardPermission
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDashboardPermission ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'dashboardPermissions';
        this.filePath = './assets/data.dashboardPermissions.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {

                    // Update Global vars to make sure they remain in sync
                    this.dashboardPermissions.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboardPermissions.push(JSON.parse(JSON.stringify(data)));

                    console.log('addDashboardPermission ADDED', data,
                        this.currentDashboardPermissions, this.dashboardPermissions)

                    resolve(data);
                },
                err => {
                    console.log('Error addDashboardPermission FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveDashboardPermission(data: DashboardPermission): Promise<string> {
        // Description: Saves DashboardPermission
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveDashboardPermission ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardPermissions';
        this.filePath = './assets/data.dashboardPermissions.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.dashboardPermissions.findIndex(d =>
                        d.id == data.id
                    );
                    this.dashboardPermissions[localIndex] = data;

                    console.log('saveDashboardPermission SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDashboardPermission FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboardPermission(id: number): Promise<string> {
        // Description: Deletes a DashboardPermissions
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDashboardPermission ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'dashboardPermissions';
        this.filePath = './assets/data.dashboardPermissions.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.dashboardPermissions = this.dashboardPermissions.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardPermissions = this.currentDashboardPermissions.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDashboardPermission DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardPermission FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getCanvasGroups(): Promise<CanvasGroup[]> {
        // Description: Gets all G
        // Returns: this.canvasGroups array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCanvasGroups ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'canvasGroups';
        this.filePath = './assets/data.canvasGroups.json';

        return new Promise<CanvasGroup[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasGroups.length == 0)  ||  (this.isDirtyCanvasGroups) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasGroups = data;
                        this.isDirtyCanvasGroups = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getCanvasGroups 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                        resolve(this.canvasGroups);
                    });
            } else {
                console.log('%c    Global-Variables getCanvasGroups 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                resolve(this.canvasGroups);
            }
        });

    }

    getDashboardSnapshots(): Promise<DashboardSnapshot[]> {
        // Description: Gets all Sn
        // Returns: this.dashboardSnapshots array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDashboardSnapshots ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardSnapshots';
        this.filePath = './assets/data.dashboardSnapshots.json';

        return new Promise<DashboardSnapshot[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardSnapshots.length == 0)  ||  (this.isDirtyDashboardSnapshots) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                this.get(url)
                    .then(data => {
                        this.dashboardSnapshots = data;
                        this.isDirtyDashboardSnapshots = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDashboardSnapshots 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dashboardSnapshots)
                        resolve(this.dashboardSnapshots);
                    });
            } else {
                console.log('%c    Global-Variables getDashboardSnapshots 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                resolve(this.dashboardSnapshots);
            }
        });

    }

    getCurrentDashboardSnapshots(dashboardID: number): Promise<DashboardSnapshot[]> {
        // Description: Gets all Sn for current D
        // Params:
        //   dashboardID
        // Returns: this.getDashboardSnapshots array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentDashboardSnapshots ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // Refresh from source at start, or if dirty
        if ( (this.dashboardSnapshots.length == 0)  ||  (this.isDirtyDashboardSnapshots) ) {
            return new Promise<DashboardSnapshot[]>((resolve, reject) => {
                this.getDashboardSnapshots()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardSnapshots = data;
                        console.log('%c    Global-Variables getCurrentDashboardSnapshots 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            dashboardID, data)
                        resolve(this.currentDashboardSnapshots);
                })
             })
        } else {
            return new Promise<DashboardSnapshot[]>((resolve, reject) => {
                let returnData: DashboardSnapshot[];
                returnData = this.dashboardSnapshots.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardSnapshots = returnData;
                console.log('%c    Global-Variables getCurrentDashboardSnapshots 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID)
                resolve(this.currentDashboardSnapshots);
            });
        };
    }

    newDashboardSnapshot(
        snapshotName: string,
        snapshotComment: string,
        snapshotType: string): Promise<any>  {
        // Description: Adds a new DashboardSnapshot
        // Returns: Added Data or error message
        console.log('%c    Global-Variables newDashboardSnapshot ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        return new Promise<any>((resolve, reject) => {

            // Create new record
            let newSn: DashboardSnapshot = {
                id: null,
                dashboardID: this.currentDashboardInfo.value.
                currentDashboardID,
                name: snapshotName,
                snapshotType: snapshotType,
                comment: snapshotComment,
                dashboards: this.currentDashboards.slice(),
                dashboardTabs: this.currentDashboardTabs.slice(),
                widgets: this.currentWidgets.slice(),
                datasets: this.currentDatasets.slice(),
                datasources: this.currentDatasources.slice(),
                widgetCheckpoints: this.currentWidgetCheckpoints.slice()
            };

            // Add to DB
            this.addDashboardSnapshot(newSn).then(res => {
                resolve(res);
            });
        });
    }

    addDashboardSnapshot(data: DashboardSnapshot): Promise<any> {
        // Description: Adds a new DashboardSnapshot
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDashboardSnapshot ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'dashboardSnapshots';
        this.filePath = './assets/data.dashboardSnapshots.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {

                    // Update Global vars to make sure they remain in sync
                    this.dashboardSnapshots.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboardSnapshots.push(JSON.parse(JSON.stringify(data)));

                    console.log('addDashboardSnapshot ADDED', data,
                        this.currentDashboardSnapshots, this.dashboardSnapshots)

                    resolve(data);
                },
                err => {
                    console.log('Error addDashboardSnapshot FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboardSnapshot(id: number): Promise<string> {
        // Description: Deletes a DashboardSnapshots
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDashboardSnapshot ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'dashboardSnapshots';
        this.filePath = './assets/data.dashboardSnapshots.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.dashboardSnapshots = this.dashboardSnapshots.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardSnapshots = this.currentDashboardSnapshots.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDashboardSnapshot DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardSnapshot FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getDashboardThemes(): Promise<DashboardTheme[]> {
        // Description: Gets all Th
        // Returns: this.dashboardThemes array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDashboardThemes ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardThemes';
        this.filePath = './assets/data.dashboardThemes.json';

        return new Promise<DashboardTheme[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardThemes.length == 0)  ||  (this.isDirtyDashboardThemes) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardThemes = data;
                        this.isDirtyDashboardThemes = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDashboardThemes 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dashboardThemes)
                        resolve(this.dashboardThemes);
                    });
            } else {
                console.log('%c    Global-Variables getDashboardThemes 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                resolve(this.dashboardThemes);
            }
        });

    }

    getDashboardTemplates(): Promise<Dashboard[]> {
        // Description: Gets all Tpl
        // Returns: recent [D] array, unless:
        //   If not cached or if dirty, get from File
        // Refresh from source at start, or if dirty
        console.log('%c    Global-Variables getDashboardTemplates ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        if ( this.dashboards == []  ||  (this.isDirtyDashboards) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(data => {
                        let arrTemplateIDs: number[] = [];
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].templateDashboardID != 0  &&
                                data[i].templateDashboardID != null) {
                                arrTemplateIDs.push(data[i].templateDashboardID)
                            }
                        }
                        let returnData: Dashboard[] = [];
                        if (arrTemplateIDs.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                if (arrTemplateIDs.indexOf(data[i].id) != -1) {
                                    returnData.push(data[i]);
                                }
                            }
                        }
                        console.log('%c    Global-Variables getDashboardTemplates 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", returnData)
                        resolve(returnData);
                    });
            });
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {
                let arrTemplateIDs: number[] = [];
                for (var i = 0; i < this.dashboards.length; i++) {
                    if (this.dashboards[i].templateDashboardID != 0  &&
                        this.dashboards[i].templateDashboardID != null) {
                        arrTemplateIDs.push(this.dashboards[i].templateDashboardID)
                    }
                }
                let returnData: Dashboard[] = [];
                if (arrTemplateIDs.length > 0) {
                    for (var i = 0; i < this.dashboards.length; i++) {
                        if (arrTemplateIDs.indexOf(this.dashboards[i].id) != -1) {
                            returnData.push(this.dashboards[i]);
                        }
                    }
                }
                console.log('%c    Global-Variables getDashboardTemplates 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", returnData)
                resolve(returnData);

            });
        };

    }

    getDatasources(): Promise<Datasource[]> {
        // Description: Gets all DS
        // Returns: this.datasources array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDatasources ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'datasources';
        this.filePath = './assets/data.datasources.json';

        return new Promise<Datasource[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasources.length == 0)  ||  (this.isDirtyDatasources) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasources = data;
                        this.isDirtyDatasources = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        // this.datasources.forEach(ds => {
                            // console.warn('xx ds bug', ds)
                            // TODO - remove this, currently datalib reads array as string 'a,b,c'
                            // let f: string = ds.dataFields.toString();
                            // let fN: string[] = f.split(',');
                            // ds.dataFields = fN;
                            // let t: string = ds.dataFieldTypes.toString();
                            // let fT: string[] = t.split(',');
                            // ds.dataFieldTypes = fT;
                            // let l: string[] = ds.dataFieldLengths.toString().split(',');
                            // let fL: number[] = [];
                            // for (var i = 0; i < l.length; i++) {
                            //     fL.push(+l[i]);
                            // };
                            // ds.dataFieldLengths = fL;
                        // });


                        console.log('%c    Global-Variables getDatasources 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.datasources)
                        resolve(this.datasources);
                    });
            } else {
                console.log('%c    Global-Variables getDatasources 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                resolve(this.datasources);
            }
        });

    }

    getCurrentDatasources(dashboardID: number): Promise<Datasource[]> {
        // Description: Gets DS for current D
        // Params: dashboardID = current D
        // Returns: this.datasources array, unless:
        //   If not cached or if dirty, get from File
        // NB: assume this.currentWidgets exists !!
        console.log('%c    Global-Variables getCurrentDatasources ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'datasources';
        this.filePath = './assets/data.datasources.json';

        return new Promise<Datasource[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            // TODO - What if databoards empty or diry - is that okay?
            if ( (this.datasources.length == 0)  ||  (this.isDirtyDatasources) ) {
                this.getDatasources()
                    .then(ds =>
                        {
                            let datasourceIDs: number[] = [];
                            let dashboardWidgets: Widget[] = this.widgets.filter(w =>
                                w.dashboardID == dashboardID
                            );

                            for (var i = 0; i < dashboardWidgets.length; i++) {
                                if (datasourceIDs.indexOf(dashboardWidgets[i].datasourceID) < 0) {

                                    if (dashboardWidgets[i].datasourceID != null) {
                                        datasourceIDs.push(dashboardWidgets[i].datasourceID)
                                    };
                                }
                            };
                            let returnData: Datasource[] = [];
                            for (var i = 0; i < ds.length; i++) {
                                if (datasourceIDs.indexOf(ds[i].id) >= 0) {
                                    if (ds[i] != null) {
                                        returnData.push(ds[i]);
                                    };
                                };
                            };

                            this.isDirtyDatasources = false;
                            this.currentDatasources = returnData;
                            this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                            console.log('%c    Global-Variables getCurrentDatasources 1',
                            "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                                dashboardID, this.currentDatasources);
                            resolve(this.currentDatasources);
                        }
                    )
            } else {
                let datasourceIDs: number[] = [];
                let dashboardWidgets: Widget[] = this.widgets.filter(w =>
                    w.dashboardID == dashboardID
                );

                for (var i = 0; i < dashboardWidgets.length; i++) {
                    if (datasourceIDs.indexOf(dashboardWidgets[i].datasourceID) < 0) {
                        if (dashboardWidgets[i].datasourceID != null) {
                            datasourceIDs.push(dashboardWidgets[i].datasourceID)
                        };
                    };
                };
                let returnData: Datasource[] = [];
                for (var i = 0; i < this.datasources.length; i++) {
                    if (datasourceIDs.indexOf(this.datasources[i].id) >= 0) {
                        returnData.push(this.datasources[i]);
                    };
                };

                this.isDirtyDatasources = false;
                this.currentDatasources = returnData;
                this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                console.log('%c    Global-Variables getCurrentDatasources 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID,
                    this.currentDatasources);
                resolve(this.currentDatasources);
            }
        });
    }

    addDatasource(data: Datasource): Promise<any> {
        // Description: Adds a new Datasource, if it does not exist
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDatasource ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'datasources';
        this.filePath = './assets/data.datasources.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {

                    // Update Global vars to make sure they remain in sync
                    let newDS: Datasource = JSON.parse(JSON.stringify(res))
                    if (this.datasources.filter(i => i.id == newDS.id).length == 0) {
                        this.datasources.push(newDS);
                    };
                    if (this.currentDatasources.filter(i => i.id == newDS.id).length == 0) {
                        this.currentDatasources.push(newDS);
                    };

                    // Inform that we now at a DS
                    this.hasDatasources.next(true);

                    console.log('addDatasource ADDED', res,
                        this.currentDatasources, this.datasources)

                    resolve(res);
                },
                err => {
                    console.log('Error addDatasource FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    addCurrentDatasource(datasourceID: number){
        // Add DS to Current DS array for a given DS-id
        console.log('%c    Global-Variables addCurrentDatasource ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // Get the data, if so requested
        let localDatasource: Datasource;
        let localDataset: Dataset;
        let globalCurrentDSIndex: number = this.currentDatasources
            .findIndex(dS => dS.id == datasourceID
        );
        let globalDSIndex: number = this.datasources.findIndex(ds =>
            ds.id == datasourceID
        );

        return new Promise<any>((resolve, reject) => {

            // DS exists in gv datasources, but not in currentDatasources
            if (globalDSIndex >= 0  &&  globalCurrentDSIndex < 0) {
                
                // Add DS to currentDS
                localDatasource = this.datasources[globalDSIndex];
                this.currentDatasources.push(localDatasource);
                this.hasDatasources.next(true);

                let globalCurrentDsetIndex: number = this.currentDatasets
                    .findIndex(dS => dS.id == datasourceID
                );
                let globalDsetIndex: number = this.datasets.findIndex(dS =>
                    dS.datasourceID == datasourceID
                );

                // Dset exists in gv datasets, but not in currentDatasets
                if (globalDsetIndex >= 0  &&  globalCurrentDsetIndex < 0) {
                    localDataset = this.datasets[globalDsetIndex];
                    
                    // Get latest dSet-ID
                    let ds: number[]=[];
                    let dSetID: number = -1;

                    for (var i = 0; i < this.datasets.length; i++) {
                        if(this.datasets[i].datasourceID == datasourceID) {
                            ds.push(this.datasets[i].id)
                        }
                    };
                    if (ds.length > 0) {
                        dSetID = Math.max(...ds);
                    };

                    // Get data for Dset
                    this.getCurrentDataset(localDataset.id, dSetID).then(res => {

                        // Add data to dataset
                        localDataset.dataRaw = res.dataRaw;
                        localDataset.data = res.data;

                        this.currentDatasets.push(localDataset);

                        resolve(res);

                    });
                };
            };
        });
        
    }

    saveDatasource(data: Datasource): Promise<string> {
        // Description: Saves Datasource
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveDatasource ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'Datasources';
        this.filePath = './assets/data.Datasources.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.currentDatasources.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.currentDatasources[localIndex] = data;
                    };
                    localIndex = this.datasources.findIndex(d =>
                        d.id == data.id
                    );
                    if (localIndex >= 0) {
                        this.datasources[localIndex] = data;
                    };


                    console.log('saveDatasource SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDatasource FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDatasource(id: number): Promise<string> {
        // Description: Deletes a Datasources
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDatasource ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'datasources';
        this.filePath = './assets/data.datasources.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.datasources = this.datasources.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDatasources = this.currentDatasources.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDatasource DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDatasource FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    // TODO - is this still needed?
    deleteCurrentDatasource(id: number) {
        // Delete current DS
        console.log('%c    Global-Variables deleteCurrentDatasource',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id, this.currentDatasources)

        let index: number = -1;
        for (var i = 0; i < this.currentDatasources.length; i++) {
            if (this.currentDatasources[i].id == id) {
                index = i;
            };
        };
        if (index != -1) {
            this.currentDatasources.splice(index,1)
        };

        console.log('%c    Global-Variables deleteCurrentDatasource end',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.currentDatasources)

    }

    getTransformations(): Promise<Transformation[]> {
        // Description: Gets all Tr
        // Returns: this.transformations array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getTransformations ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'transformations';
        this.filePath = './assets/data.transformations.json';

        return new Promise<Transformation[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.transformations.length == 0)  ||  (this.isDirtyTransformations) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.transformations = data;
                        this.isDirtyTransformations = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getTransformations 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",  data)
                        resolve(this.transformations);
                    });
            } else {
                console.log('%c    Global-Variables getTransformations 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px")
                resolve(this.transformations);
            }
        });

    }

    getCurrentTransformations(datasourceID: number): Promise<Transformation[]> {
        // Description: Gets Tr for current DS
        // Returns: this.currentTransformations.value array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentTransformations ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'transformations';
        this.filePath = './assets/data.transformations.json';

        if ( (this.currentTransformations.length == 0)  ||  (this.isDirtyTransformations) ) {
            return new Promise<Transformation[]>((resolve, reject) => {
                this.getTransformations()
                    .then(data => {
                        // data = data.filter(
                        //     i => i.datasourceID == datasourceID
                        // );
                        this.currentTransformations = data;
                        console.log('%c    Global-Variables getTransformations 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", datasourceID, data)
                        resolve(this.currentTransformations);
                })
             })
        } else {
            return new Promise<Transformation[]>((resolve, reject) => {
                let returnData: Transformation[];
                returnData = this.transformations;
                // returnData = this.transformations.filter(
                //     i => i.datasourceID == datasourceID
                // );
                this.currentTransformations = returnData;
                console.log('%c    Global-Variables getTransformations 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", datasourceID, returnData)
                resolve(this.currentTransformations);
            });
        };
    }

    getDataQualityIssues(): Promise<DataQualityIssue[]> {
        // Description: Gets all dQual
        // Returns: this.dataQualityIssues array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDataQualityIssues ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dataQualityIssues';
        this.filePath = './assets/data.dataQualityIssues.json';

        return new Promise<DataQualityIssue[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dataQualityIssues.length == 0)  ||  (this.isDirtyDataQualityIssues) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dataQualityIssues = data;
                        this.isDirtyDataQualityIssues = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDataQualityIssues 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dataQualityIssues)
                        resolve(this.dataQualityIssues);
                    });
            } else {
                console.log('%c    Global-Variables getDataQualityIssues 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dataQualityIssues)
                resolve(this.dataQualityIssues);
            }
        });
    }

    getCurrentDataQualityIssues(datasourceID: number): Promise<DataQualityIssue[]> {
        // Description: Gets dQual for current DS
        // Returns: this.dataQualityIssues.value array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentDataQualityIssues ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dataQualityIssues';
        this.filePath = './assets/data.dataQualityIssues.json';

        if ( (this.currentDataQualityIssues.length == 0)  ||  (this.isDirtyDataQualityIssues) ) {
            return new Promise<DataQualityIssue[]>((resolve, reject) => {
                this.getDataQualityIssues()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDataQualityIssues = data;
                        console.log('%c    Global-Variables getDataQualityIssuess 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            datasourceID, data)
                        resolve(this.currentDataQualityIssues);
                })
             })
        } else {
            return new Promise<DataQualityIssue[]>((resolve, reject) => {
                let returnData: DataQualityIssue[];
                returnData = this.dataQualityIssues.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDataQualityIssues = returnData;
                console.log('%c    Global-Variables getDataQualityIssuess 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", datasourceID, returnData)
                resolve(this.currentDataQualityIssues);
            });
        };
    }

    addDataQualityIssue(data: DataQualityIssue): Promise<any> {
        // Description: Adds a new QualityIssue, if it does not exist
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDataQualityIssue ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'dataQualityIssues';
        this.filePath = './assets/data.dataQualityIssues.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {

                    // Update Global vars to make sure they remain in sync
                    let newDS: DataQualityIssue = JSON.parse(JSON.stringify(res))
                    if (this.dataQualityIssues.filter(i => i.id == newDS.id).length == 0) {
                        this.dataQualityIssues.push(newDS);
                    };
                    if (this.currentDataQualityIssues.filter(i => i.id == newDS.id).length == 0) {
                        this.currentDataQualityIssues.push(newDS);
                    };

                    console.log('addDataQualityIssue ADDED', res,
                        this.currentDataQualityIssues, this.dataQualityIssues)

                    resolve(res);
                },
                err => {
                    console.log('Error addDataQualityIssue FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveDataQualityIssue(data: DataQualityIssue): Promise<string> {
        // Description: Saves DataQualityIssue
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveDataQualityIssue ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dataQualityIssues';
        this.filePath = './assets/data.dataQualityIssues.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.dataQualityIssues.findIndex(d =>
                        d.id == data.id
                    );
                    this.dataQualityIssues[localIndex] = data;

                    console.log('saveDataQualityIssue SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDataQualityIssue FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDataQualityIssue(id: number): Promise<string> {
        // Description: Deletes a DataQualityIssues
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDataQualityIssue ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'dataQualityIssues';
        this.filePath = './assets/data.dataQualityIssues.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.dataQualityIssues = this.dataQualityIssues.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDataQualityIssues = this.currentDataQualityIssues.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDataQualityIssue DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDataQualityIssue FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }
    
    getDataOwnerships(): Promise<DataOwnership[]> {
        // Description: Gets all dQual
        // Returns: this.DataOwnerships array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDataOwnerships ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dataOwnerships';
        this.filePath = './assets/data.dataOwnerships.json';

        return new Promise<DataOwnership[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dataOwnerships.length == 0)  ||  (this.isDirtyDataOwnership) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dataOwnerships = data;
                        this.isDirtyDataOwnership = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDataOwnerships 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dataOwnerships)
                        resolve(this.dataOwnerships);
                    });
            } else {
                console.log('%c    Global-Variables getDataOwnerships 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dataOwnerships)
                resolve(this.dataOwnerships);
            }
        });
    }

    getCurrentDataOwnerships(datasourceID: number): Promise<DataOwnership[]> {
        // Description: Gets dQual for current DS
        // Returns: this.dataOwnerships.value array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentDataOwnerships ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dataOwnerships';
        this.filePath = './assets/data.dataOwnerships.json';

        if ( (this.currentDataOwnerships.length == 0)  ||  (this.isDirtyDataOwnership) ) {
            return new Promise<DataOwnership[]>((resolve, reject) => {
                this.getDataOwnerships()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDataOwnerships = data;
                        console.log('%c    Global-Variables getDataOwnershipss 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            datasourceID, data)
                        resolve(this.currentDataOwnerships);
                })
             })
        } else {
            return new Promise<DataOwnership[]>((resolve, reject) => {
                let returnData: DataOwnership[];
                returnData = this.dataOwnerships.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDataOwnerships = returnData;
                console.log('%c    Global-Variables getDataOwnershipss 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", datasourceID, returnData)
                resolve(this.currentDataOwnerships);
            });
        };
    }

    addDataOwnership(data: DataOwnership): Promise<any> {
        // Description: Adds a new Ownership, if it does not exist
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDataOwnership ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'dataOwnerships';
        this.filePath = './assets/data.dataOwnerships.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {

                    // Update Global vars to make sure they remain in sync
                    let newDS: DataOwnership = JSON.parse(JSON.stringify(res))
                    if (this.dataOwnerships.filter(i => i.id == newDS.id).length == 0) {
                        this.dataOwnerships.push(newDS);
                    };
                    if (this.currentDataOwnerships.filter(i => i.id == newDS.id).length == 0) {
                        this.currentDataOwnerships.push(newDS);
                    };

                    console.log('addDataOwnership ADDED', res,
                        this.currentDataOwnerships, this.dataOwnerships)

                    resolve(res);
                },
                err => {
                    console.log('Error addDataOwnership FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveDataOwnership(data: DataOwnership): Promise<string> {
        // Description: Saves DataOwnership
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveDataOwnership ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dataOwnerships';
        this.filePath = './assets/data.dataOwnerships.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.dataOwnerships.findIndex(d =>
                        d.id == data.id
                    );
                    this.dataOwnerships[localIndex] = data;

                    console.log('saveDataOwnership SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDataOwnership FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDataOwnership(id: number): Promise<string> {
        // Description: Deletes a DataOwnerships
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDataOwnership ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'dataOwnerships';
        this.filePath = './assets/data.dataOwnerships.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.dataOwnerships = this.dataOwnerships.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDataOwnerships = this.currentDataOwnerships.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDataOwnership DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDataOwnership FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getDatasourcePermissions(): Promise<DatasourcePermission[]> {
        // Description: Gets all DS-P
        // Returns: this.datasourcePermissions array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDatasourcePermissions ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'datasourcePermissions';
        this.filePath = './assets/data.datasourcePermissions.json';

        return new Promise<DatasourcePermission[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourcePermissions.length == 0)  ||  (this.isDirtyDatasourcePermissions) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasourcePermissions = data;
                        this.isDirtyDatasourcePermissions = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDatasourcePermissions 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.datasourcePermissions)
                        resolve(this.datasourcePermissions);
                    });
            } else {
                console.log('%c    Global-Variables getDatasourcePermissions 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.datasourcePermissions)
                resolve(this.datasourcePermissions);
            }
        });
    }

    getCurrentDatasourcePermissions(datasourceID: number): Promise<DatasourcePermission[]> {
        // Description: Gets DS-P for current DS
        // Returns: this.datasourcePermissions.value array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentDatasourcePermissions ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'datasourcePermissions';
        this.filePath = './assets/data..datasourcePermissions.json';

        if ( (this.currentDatasourcePermissions.length == 0)  ||  (this.isDirtyDatasourcePermissions) ) {
            return new Promise<DatasourcePermission[]>((resolve, reject) => {
                this.getDatasourcePermissions()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDatasourcePermissions = data;
                        console.log('%c    Global-Variables getDatasourcePermissions 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", datasourceID, data)
                        resolve(this.currentDatasourcePermissions);
                })
             })
        } else {
            return new Promise<DatasourcePermission[]>((resolve, reject) => {
                let returnData: DatasourcePermission[];
                returnData = this.datasourcePermissions.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDatasourcePermissions = returnData;
                console.log('%c    Global-Variables getDatasourcePermissions 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", datasourceID)
                resolve(this.currentDatasourcePermissions);
            });
        };

    }

    deleteDatasourcePermission(id: number) {
        // Remove a record from the global and current DatasourcePermissions
        console.log('%c    Global-Variables deleteDatasourcePermission ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        console.warn('xx GV Perms pre', this.datasourcePermissions, this.currentDatasourcePermissions)

        this.datasourcePermissions = this.datasourcePermissions.filter(
            dsp => dsp.id != id
        );
        this.currentDatasourcePermissions = this.currentDatasourcePermissions.filter(
            dsp => dsp.id != id
        );

        console.warn('xx GV Perms', this.datasourcePermissions, this.currentDatasourcePermissions)
    }

    getDatasourcePivots(): Promise<DatasourcePivot[]> {
        // Description: Gets all DS-P
        // Returns: this.datasourcePivots array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDatasourcePivots ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'datasourcePivots';
        this.filePath = './assets/data.datasourcePivots.json';

        return new Promise<DatasourcePivot[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourcePivots.length == 0)  ||  (this.isDirtyDatasourcePivots) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasourcePivots = data;
                        this.isDirtyDatasourcePivots = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDatasourcePivots 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.datasourcePivots)
                        resolve(this.datasourcePivots);
                    });
            } else {
                console.log('%c    Global-Variables getDatasourcePivots 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.datasourcePivots)
                resolve(this.datasourcePivots);
            }
        });
    }

    getCurrentDatasourcePivots(datasourceID: number): Promise<DatasourcePivot[]> {
        // Description: Gets DS-P for current DS
        // Returns: this.datasourcePivots.value array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentDatasourcePivots ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'datasourcePivots';
        this.filePath = './assets/data..datasourcePivots.json';

        if ( (this.currentDatasourcePivots.length == 0)  ||  (this.isDirtyDatasourcePivots) ) {
            return new Promise<DatasourcePivot[]>((resolve, reject) => {
                this.getDatasourcePivots()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDatasourcePivots = data;
                        console.log('%c    Global-Variables getDatasourcePivots 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", datasourceID, data)
                        resolve(this.currentDatasourcePivots);
                })
             })
        } else {
            return new Promise<DatasourcePivot[]>((resolve, reject) => {
                let returnData: DatasourcePivot[];
                returnData = this.datasourcePivots.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDatasourcePivots = returnData;
                console.log('%c    Global-Variables getDatasourcePivots 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", datasourceID, returnData)
                resolve(this.currentDatasourcePivots);
            });
        };

    }

    getSystemSettings(): Promise<CanvasSettings> {
        // Description: Gets system settings
        // Returns: this.canvasSettings object, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getSystemSettings ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'canvasSettings';
        this.filePath = './assets/data.canvasSettings.json';

        return new Promise<CanvasSettings>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyCanvasSettings) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasSettings = data;

                        // Load global Vars
                        // TODO - create glob vars when needed, or delete totally
                        this.canvasSettings.companyName = data.companyName;
                        this.canvasSettings.companyLogo = data.companyLogo;
                        this.canvasSettings.dashboardTemplate = data.dashboardTemplate;
                        this.canvasSettings.maxTableLength = +data.maxTableLength;
                        this.canvasSettings.widgetsMinZindex = +data.widgetsMinZindex;
                        this.canvasSettings.widgetsMaxZindex = +data.widgetsMaxZindex;
                        this.canvasSettings.gridSize = +data.gridSize;
                        this.canvasSettings.snapToGrid = data.snapToGrid;
                        this.canvasSettings.printDefault = data.printDefault;
                        this.canvasSettings.printSize = data.printSize;
                        this.canvasSettings.printLayout = data.printLayout;
                        this.canvasSettings.notInEditModeMsg = data.notInEditModeMsg;
                        this.canvasSettings.noQueryRunningMessage = data.noQueryRunningMessage;
                        this.canvasSettings.queryRunningMessage = data.queryRunningMessage;

                        // Sanitize
                        if (this.canvasSettings.gridSize > 100
                            || this.canvasSettings.gridSize == null
                            || this.canvasSettings.gridSize == undefined) {
                            this.canvasSettings.gridSize = 100;
                        };

                        this.isDirtyCanvasSettings = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getSystemSettings 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasSettings)
                        resolve(this.canvasSettings);
                    });
            } else {
                console.log('%c    Global-Variables getSystemSettings 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasSettings)
                resolve(this.canvasSettings);
            }
        });

    }

    saveSystemSettings(data: CanvasSettings): Promise<string> {
        // Description: Saves system settings
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveSystemSettings ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'canvasSettings';
        this.filePath = './assets/data.canvasSettings.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {

                    this.canvasSettings = JSON.parse(JSON.stringify(res));
                    console.log('saveSystemSettings SAVED')
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveSystemSettings FAILED');;
                    resolve(err.Message.toString());
                }
            )
        });
    }

    getDashboardSubscriptions(): Promise<DashboardSubscription[]> {
        // Description: Gets dashboardSubscriptions
        // Returns: this.dashboardSubscriptions object, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDashboardSubscription ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardSubscriptions';
        this.filePath = './assets/data.dashboardSubscriptions.json';

        return new Promise<DashboardSubscription[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyDashboardSubscription) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardSubscriptions = data;

                        this.isDirtyDashboardSubscription = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDashboardSubscription 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dashboardSubscriptions)
                        resolve(this.dashboardSubscriptions);
                    });
            } else {
                console.log('%c    Global-Variables getDashboardSubscription 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.dashboardSubscriptions)
                resolve(this.dashboardSubscriptions);
            }
        });

    }

    getCurrentDashboardSubscriptions(dashboardID: number): Promise<DashboardSubscription[]> {
        // Description: Gets currentDashboardSubscription
        // Returns: this.currentDashboardSubscription object, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getDashboardSubscription ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardSubscriptions';
        this.filePath = './assets/data.dashboardSubscriptions.json';

        return new Promise<DashboardSubscription[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyDashboardSubscription) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.getDashboardSubscriptions()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );

                        this.currentDashboardSubscriptions = data;

                        this.isDirtyDashboardSubscription = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getDashboardSubscription 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.currentDashboardSubscriptions)
                        resolve(this.currentDashboardSubscriptions);
                    });
            } else {
                console.log('%c    Global-Variables getDashboardSubscription 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.currentDashboardSubscriptions)
                resolve(this.currentDashboardSubscriptions);
            }
        });

    }

    saveDashboardSubscription(data: DashboardSubscription): Promise<string> {
        // Description: Saves DashboardSubscription
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveDashboardSubscription ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'dashboardSubscriptions';
        this.filePath = './assets/data.dashboardSubscriptions.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.dashboardSubscriptions.findIndex(d =>
                        d.id == data.id
                    );
                    this.dashboardSubscriptions[localIndex] = data;

                    console.log('saveDashboardSubscription SAVED', res)
                        resolve('Saved');
                },
                err => {
                    console.log('Error saveDashboardSubscription FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    addDashboardSubscription(data: DashboardSubscription): Promise<any> {
        // Description: Adds a new DashboardSubscription
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addDashboardSubscription ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'dashboardSubscriptions';
        this.filePath = './assets/data.dashboardSubscriptions.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {
                    this.dashboardSubscriptions.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboardSubscriptions.push(JSON.parse(JSON.stringify(data)));
                    console.log('addDashboardSubscription ADDED', data)
                    resolve(data);
                },
                err => {
                    console.log('Error addDashboardSubscription FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboardSubscription(id: number): Promise<string> {
        // Description: Deletes a DashboardSubscription
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteDashboardSubscription ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'dashboardSubscriptions';
        this.filePath = './assets/data.dashboardSubscriptions.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.dashboardSubscriptions = this.dashboardSubscriptions.
                        filter(sub => sub.id != id);
                    this.currentDashboardSubscriptions = this.currentDashboardSubscriptions.
                        filter(sub => sub.id != id);
                    console.log('deleteDashboardSubscription DELETED', id, data, this.dashboardSubscriptions, this.currentDashboardSubscriptions)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardSubscription FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getPaletteButtonBar(): Promise<PaletteButtonBar[]> {
        // Description: Gets currentgetPaletteButtonBar
        // Returns: this.currentgetPaletteButtonBar object, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getPaletteButtonBar ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'paletteButtonBars';
        this.filePath = './assets/data.paletteButtonBars.json';

        return new Promise<PaletteButtonBar[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyPaletteButtonBar) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.currentPaletteButtonBar = data;

                        this.isDirtyPaletteButtonBar = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getPaletteButtonBar 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.currentPaletteButtonBar)
                        resolve(this.currentPaletteButtonBar);
                    });
            } else {
                console.log('%c    Global-Variables getPaletteButtonBar 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.currentPaletteButtonBar)
                resolve(this.currentPaletteButtonBar);
            }
        });

    }

    savePaletteButtonBar(data: PaletteButtonBar): Promise<string> {
        // Description: Saves PaletteButtonBar
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables savePaletteButtonBar ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'paletteButtonBars';
        this.filePath = './assets/data.paletteButtonBars.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3001/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.currentPaletteButtonBar.findIndex(d =>
                        d.id == data.id
                    );
                    this.currentPaletteButtonBar[localIndex] = data;

                    console.log('savePaletteButtonBar SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error savePaletteButtonBar FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getPaletteButtonsSelected(): Promise<PaletteButtonsSelected[]> {
        // Description: Gets currentgetPaletteButtonsSelected
        // Returns: this.currentgetPaletteButtonsSelected object, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getPaletteButtonsSelected ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'paletteButtonsSelecteds';
        this.filePath = './assets/data.paletteButtonsSelecteds.json';

        return new Promise<PaletteButtonsSelected[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyPaletteButtonsSelected) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.currentPaletteButtonsSelected.next(data);

                        this.isDirtyPaletteButtonsSelected = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        console.log('%c    Global-Variables getPaletteButtonsSelected 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                            this.currentPaletteButtonsSelected.value);
                        resolve(this.currentPaletteButtonsSelected.value);
                    });
            } else {
                console.log('%c    Global-Variables getPaletteButtonsSelected 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",
                    this.currentPaletteButtonsSelected.value);

                resolve(this.currentPaletteButtonsSelected.value);
            }
        });

    }

    savePaletteButtonsSelected(data: PaletteButtonsSelected): Promise<string> {
        // Description: Saves PaletteButtonsSelected
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables savePaletteButtonsSelected ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'paletteButtonsSelecteds';
        this.filePath = './assets/data.paletteButtonsSelecteds.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3001/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.currentPaletteButtonsSelected.value.findIndex(d =>
                        d.id == data.id
                    );
                    this.currentPaletteButtonsSelected.value[localIndex] = data;

                    console.log('savePaletteButtonsSelected SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error savePaletteButtonsSelected FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deletePaletteButtonsSelected(id: number): Promise<string> {
        // Description: Deletes a PaletteButtonsSelected
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deletePaletteButtonsSelected ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'paletteButtonsSelecteds';
        this.filePath = './assets/data.paletteButtonsSelecteds.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3001/' + url + '/' + id, {headers})
            .subscribe(
                res => {

                    // This is a different case: currentPaletteButtonsSelected is an
                    // Observable, and will be refreshed with a .next by the calling
                    // routine
                    let dID: number = -1;
                    for (var i = 0; i < this.currentPaletteButtonsSelected.value.length; i++) {

                        if (this.currentPaletteButtonsSelected.value[i].id == id) {
                            dID = i;
                            break;
                        };
                    };
                    if (dID >=0) {
                        this.currentPaletteButtonsSelected.value.splice(dID, 1);
                    };

                    // Inform subscribers
                    this.currentPaletteButtonsSelected.next(
                        this.currentPaletteButtonsSelected.value
                    );

        console.log('deletePaletteButtonsSelected DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deletePaletteButtonsSelected FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    addPaletteButtonsSelected(data: PaletteButtonsSelected): Promise<any> {
        // Description: Adds a new PaletteButtonsSelected
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addPaletteButtonsSelected ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'paletteButtonsSelecteds';
        this.filePath = './assets/data.paletteButtonsSelecteds.json';


        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3001/' + url, data, {headers})
                .subscribe(
                    res => {

                        // Update Global vars to make sure they remain in sync
                        this.currentPaletteButtonsSelected.value.push(JSON.parse(JSON.stringify(res)));

                        // Inform subscribers
                        this.currentPaletteButtonsSelected.next(
                            this.currentPaletteButtonsSelected.value
                        );

                        console.log('addWidget ADDED', data, this.widgets)

                        resolve(data);
                    },
                    err => {
                        console.log('Error addDashboardSubscription FAILED', err);;
                        resolve(err.Message);
                    }
                )
        });
    }

    getWidgets(): Promise<Widget[]> {
        // Description: Gets all W
        // Returns: this.widgets array, unless:
        //   If not cached or if dirty, get from File

        console.log('%c    Global-Variables getWidgets ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.widgets.length);

        let url: string = 'widgets';
        this.filePath = './assets/data.widgets.json';

        return new Promise<Widget[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.widgets.length == 0)  ||  (this.isDirtyWidgets) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {

                        this.widgets = data;

                        // TODO - fix hardcoding, issue with datalib jsonTree
                        this.widgets.forEach(w => {

                            // TODO - with DB, get summarised fields like NrComments, NrDataQual, etc

                            // Get Checkpoint info for ALL W, not only current one
                            // TODO - fix when using DB
                            let tempChk: WidgetCheckpoint[] = this.widgetCheckpoints
                                .filter(wc =>
                                    wc.dashboardID == w.dashboardID
                                    &&
                                    wc.widgetID == w.id
                            );

                            if (tempChk.length > 0) {
                                w.showCheckpoints = false;
                                w.checkpointIDs = [];
                                w.currentCheckpoint = 0;
                                w.lastCheckpoint = tempChk.length - 1;

                                for (var x = 0; x < tempChk.length; x++) {
                                    w.checkpointIDs.push(tempChk[x].id);
                                };

                            } else {
                                w.showCheckpoints = false;
                                w.checkpointIDs = [];
                                w.currentCheckpoint = 0;
                                w.lastCheckpoint = -1;
                            };

                            // Get bullets
                            // // TODO - fix when using DB
                            // if (w.widgetType == 'Shape') {
                            //     let b: string = w.shapeBullets.toString();
                            //     w.shapeBullets = b.split(',');
                            // };

                            // TODO - this does NOT work in datalib: if the first dashboardTabIDs
                            // = "a,b,c", then all works.  Else, it gives a big number 1046785...
                            // irrespective ...
                            if (w.dashboardTabIDs != null) {
                                // re = regEx
                                var re = /t/gi;
                                let d: string = w.dashboardTabIDs.toString();
                                d = d.replace(re, '');
                                let dA: string[] = d.split(',');
                                w.dashboardTabIDs = [];
                                dA.forEach(da => w.dashboardTabIDs.push(+da));
                            }

                            // TODO - fix when using DB
                            // Update slicerSelection
                            // if (w.slicerSelection != null) {
                            //     let s: string = w.slicerSelection.toString();
                            //     let sF: string[] = s.split(',');
                            //     let sO: {isSelected: boolean; fieldValue: string}[] = [];
                            //     let i: number = 0;
                            //     let oSel: boolean;
                            //     let oFld: string;
                            //     w.slicerSelection = [];
                            //     sF.forEach(s => {
                            //         i = i + 1;
                            //         if (i == 1) {
                            //             oSel = (s == 'true');
                            //         } else {
                            //             oFld = s;
                            //             i = 0;
                            //             let o: {isSelected: boolean; fieldValue: string} =
                            //                 {isSelected: oSel, fieldValue: oFld};
                            //             w.slicerSelection.push(o);
                            //         }
                            //     })
                            // };

                            // TODO - fix when using DB
                            // Update slicerBins
                            if (w.slicerBins != null) {
                                let s: string = w.slicerBins.toString();
                                let sF: string[] = s.split(',');
                                let sO: {
                                    isSelected: boolean; name: string; fromValue: number; toValue: number
                                }[] = [];
                                let i: number = 0;
                                let oSel: boolean;
                                let oName: string;
                                let oFrom: number;
                                let oTo: number;
                                w.slicerBins = [];
                                sF.forEach(s => {
                                    i = i + 1;
                                    if (i == 1) {
                                        oSel = (s == 'true');
                                    };
                                    if (i == 2) {
                                        oName = s;
                                    };
                                    if (i == 3) {
                                        oFrom = +s;
                                    };
                                    if (i == 4) {
                                        oTo  = +s;
                                        i = 0;
                                        let o: {isSelected: boolean; name: string; fromValue: number; toValue: number} =
                                            {isSelected: oSel, name: oName, fromValue: oFrom, toValue: oTo};

                                        w.slicerBins.push(o);
                                    }
                                })
                            };
                        });

                        this.isDirtyWidgets = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getWidgets 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.widgets)
                        resolve(this.widgets);
                    });
            } else {
                console.log('%c    Global-Variables getWidgets 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.widgets)
                resolve(this.widgets);
            }
        });

    }

    getCurrentWidgets(dashboardID: number, dashboardTabID: number): Promise<Widget[]> {
        // Description: Gets all W for current D
        // Params:
        //   dashboardID
        //   dashboardTabID (0 => all Tabs)
        // Returns: arrays of current W, Sl, Sh, Tbl; unless:
        //   If not cached or if dirty, get from File
        // Usage: getWidgets(1, -1)  =>  Returns W for DashboardID = 1
        console.log('%c    Global-Variables getCurrentWidgets ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // Refresh from source at start, or if dirty
        if ( (this.widgets.length == 0)  ||  (this.isDirtyWidgets) ) {
            return new Promise<Widget[]>((resolve, reject) => {
                this.getWidgets()
                    .then(data => {

                        // Filter the widgets
                        // TODO - use i.dashboardTabIDs.indexOf(dashboardTabID) >= 0 once datalib
                        // reads arrays correctly.  That should be the only change ...
                        data = data.filter(
                            i => (i.dashboardID == dashboardID)
                                 &&
                                 (i.dashboardTabIDs.indexOf(dashboardTabID) >= 0)
                        );
                        this.currentWidgets = data;

                        console.log('%c    Global-Variables getCurrentWidgets 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.currentWidgets)
                        resolve(this.currentWidgets);
                })
             })
        } else {
            return new Promise<Widget[]>((resolve, reject) => {

                // Filter all Tabs belonging to this D
                let data: Widget[];
                data = this.widgets.filter(
                    i => (i.dashboardID == dashboardID)
                    &&
                    (i.dashboardTabIDs.indexOf(dashboardTabID) >= 0)
                )

                this.currentWidgets = data;
                console.log('%c    Global-Variables getCurrentWidgets 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID,
                    dashboardTabID,  this.currentWidgets, this.widgets)
                resolve(this.currentWidgets);

            });
        };

    }

    addWidget(data: Widget): Promise<any> {
        // Description: Adds a new Widget
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addWidget ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'widgets';
        this.filePath = './assets/data.widgets.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3005/' + url, data, {headers})
            .subscribe(
                data => {

                    // Update Global vars to make sure they remain in sync
                    this.widgets.push(JSON.parse(JSON.stringify(data)));
                    this.currentWidgets.push(JSON.parse(JSON.stringify(data)));

                    console.log('addWidget ADDED', data, this.widgets)

                    resolve(data);
                },
                err => {
                    console.log('Error addWidget FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteWidget(id: number): Promise<string> {
        // Description: Deletes a Widgets
        // Returns: 'Deleted' or error message
        // NOTE: this permananently deletes a W, from arrays and DB.
        console.log('%c    Global-Variables deleteWidget ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'widgets';
        this.filePath = './assets/data.widgets.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3005/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.widgets = this.widgets.filter(
                        w => w.id != id
                    );
                    this.currentWidgets = this.currentWidgets.filter(
                        w => w.id != id
                    );

                    // Delete where D was used in Chkpnt
                    this.widgetCheckpoints.forEach(chk => {
                        if (chk.widgetID == id) {
                            this.deleteWidgetCheckpoint(chk.id);
                        };
                    });

                    console.log('deleteWidget DELETED id: ', id, this.widgetCheckpoints, this.currentWidgetCheckpoints)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteWidget FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveWidget(data: Widget): Promise<string> {
        // Description: Saves Widget
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveWidget ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'widgets';
        this.filePath = './assets/data.widgets.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3005/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {
                    // Update widgets and currentWidgets
                    this.widgetReplace(data);

                    //     // TODO - do this better in a DB
                    //     if (this.currentWidgetCheckpoints.length > 0) {
                    //         this.currentWidgetCheckpoints.forEach(chk => {
                    //             if (chk.widgetID == data.id) {
                    //                 chk.parentWidgetIsDeleted = true;
                    //             };
                    //         });
                    //     };
                    //     if (this.widgetCheckpoints.length > 0) {
                    //         this.widgetCheckpoints.forEach(chk => {
                    //             if (chk.widgetID == data.id) {
                    //                 chk.parentWidgetIsDeleted = true;
                    //                 this.saveWidgetCheckpoint(chk);
                    //             };
                    //         });
                    //     };
                    // };

                    // TODO - remove the commented code once all good
                    // Mark Checkpoints to indicate parentW is dead
                    // if (data.isTrashed) {

                    //     // TODO - do this better in a DB
                    //     if (this.currentWidgetCheckpoints.length > 0) {
                    //         this.currentWidgetCheckpoints.forEach(chk => {
                    //             if (chk.widgetID == data.id) {
                    //                 chk.parentWidgetIsDeleted = true;
                    //             };
                    //         });
                    //     };
                    //     if (this.widgetCheckpoints.length > 0) {
                    //         this.widgetCheckpoints.forEach(chk => {
                    //             if (chk.widgetID == data.id) {
                    //                 chk.parentWidgetIsDeleted = true;
                    //                 this.saveWidgetCheckpoint(chk);
                    //             };
                    //         });
                    //     };
                    // };

                    console.log('saveWidget SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveWidget FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getWidgetsInfo(): Promise<boolean> {
        // Description: Gets data and other info for [W]
        // Returns: this.datasets, currentDataset array
        // NB: this assumes [W] and [datasets] are available !!
        console.log('%c    Global-Variables getWidgetsInfo ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // Empty the necessary
        let dsCurrIDs: number[] = [];       // Current Dataset IDs
        let promiseArray = [];

        // Get list of dSet-ids to make array work easier
        this.currentDatasets.forEach(d => dsCurrIDs.push(d.id));

        return new Promise(async (resolve, reject) => {

            // Construct array with correct datasetIDs
            this.currentWidgets.forEach(w => {

                // Only get data from Graphs and Text boxes
                // if ( (w.widgetType == 'Graph'  ||  w.widgetType == 'Shape')  &&
                //     (w.datasourceID >= 0) ) {
                if (w.datasourceID != null  &&  w.datasetID != null) {

                    // Build array of promises, each getting data for 1 widget if not store already
                    if (dsCurrIDs.indexOf(w.datasetID) < 0) {

                        // Get the latest datasetID (when -1 is stored on W)
                        if (w.datasetID == -1) {
                            let ds: number[]=[];

                            for (var i = 0; i < this.datasets.length; i++) {
                                if(this.datasets[i].datasourceID == w.datasourceID) {
                                    ds.push(this.datasets[i].id)
                                }
                            };
                            if (ds.length > 0) {
                                w.datasetID = Math.max(...ds);
                            };
                        };

                        // Remember, AFTER latest was found
                        dsCurrIDs.push(w.datasetID);

                        promiseArray.push(this.getCurrentDataset(w.datasourceID, w.datasetID));
                    };
                }
            });

            // // Return if nothing to be done, means all data already good
            // if (promiseArray.length = 0) {
            //     // TODO - better error handling
            //     console.log('                        is EMPTy, so Nothing to resolve');
            //     resolve(true)
            // };

            // Get all the dataset to local vars
            this.allWithAsync(...promiseArray)
                .then(resolvedData => {

                    // Filter currentDatasets by Sl linked to DS
                    this.currentDatasets.forEach(cd => {
                        // TODO - improve
                        // this.filterSlicer(cd);
                    })

                    // Add data to widget
                    // TODO - url = this.filePath for localDB ...
                    // this.currentWidgets.forEach(w => {
                    //     w.graphUrl = "";
                    //     let ds: Dataset[] = this.currentDatasets.filter(
                    //         i => i.id == w.datasetID
                    //     );
                    //     if (ds.length > 0) {
                    //         w.graphData = ds[0].data;
                    //     } else {
                    //         w.graphData = null;
                    //     }

                    // });

                    console.log('%c    Global-Variables getWidgetsInfo 1 True',
                    "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
                    resolve(true);
                },
                rejectionReason => console.log('reason:', rejectionReason) // reason: rejected!
            );
        });
    }

    allWithAsync = (...listOfPromises) => {
        // Resolve all promises in array
        console.log('%c    Global-Variables allWithAsync ...',
        "color: black; background: lightgray; font-size: 10px");

        return new Promise(async (resolve, reject) => {
            let results = []
            if (listOfPromises.length == 0) {
                resolve(true);
            } else {
                for (let promise of listOfPromises.map(Promise.resolve, Promise)) {
                    results.push(await promise.then(async resolvedData => await resolvedData, reject))
                    if (results.length === listOfPromises.length) resolve(results)
                }
            };
        })
    }

    getBackgroundColors(): Promise<CSScolor[]> {
        // Description: Gets all Background colors
        // Returns: this.backgroundcolors array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getBackgroundColors ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'canvasBackgroundcolors';
        this.filePath = './assets/settings.backgroundcolors.json';

        return new Promise<CSScolor[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.backgroundcolors.length == 0)  ||  (this.isDirtyBackgroundColors) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.backgroundcolors = data;

                        this.isDirtyBackgroundColors = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getBackgroundColors 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.backgroundcolors)
                        resolve(this.backgroundcolors);
                    });
            } else {
                console.log('%c    Global-Variables getBackgroundColors 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.backgroundcolors)
                resolve(this.backgroundcolors);
            }
        });

    }

    getCanvasTasks(): Promise<CanvasTask[]> {
        // Description: Gets all Canvas Activities
        // Returns: this.canvasTasks array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCanvasTasks ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasTasks.length);

        let url: string = 'canvasTasks';
        this.filePath = './assets/settings.canvasTasks.json';

        return new Promise<CanvasTask[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasTasks.length == 0)  ||  (this.isDirtyCanvasTasks) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasTasks = data;

                        this.isDirtyCanvasTasks = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getCanvasTasks 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasTasks)
                        resolve(this.canvasTasks);
                    });
            } else {
                console.log('%c    Global-Variables getCanvasTasks 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasTasks)
                resolve(this.canvasTasks);
            }
        });

    }

    addCanvasTask(data: CanvasTask): Promise<any> {
        // Description: Adds a new canvasTask
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addCanvasTask ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'canvasTasks';
        this.filePath = './assets/data.CanvasTasks.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {

                    // Update Global vars to make sure they remain in sync
                    this.canvasTasks.push(JSON.parse(JSON.stringify(res)));

                    console.log('addCanvasTask ADDED', res, this.canvasTasks, this.canvasTasks)

                    resolve(res);
                },
                err => {
                    console.log('Error addCanvasTask FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveCanvasTask(data: CanvasTask): Promise<string> {
        // Description: Saves CanvasTask
        // Returns: 'Saved' or error Task
        console.log('%c    Global-Variables saveCanvasTask ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'canvasTasks';
        this.filePath = './assets/data.canvasTasks.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.canvasTasks.findIndex(msg =>
                        msg.id == data.id
                    );
                    this.canvasTasks[localIndex] = data;

                    console.log('saveCanvasTask SAVED', data)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveCanvasTask FAILED', err);;
                    resolve(err.Task);
                }
            )
        });
    }

    getCanvasComments(): Promise<CanvasComment[]> {
        // Description: Gets all Canvas Comments
        // Returns: this.canvasComments array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCanvasComments ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasComments.length);

        let url: string = 'canvasComments';
        this.filePath = './assets/settings.canvasComments.json';

        return new Promise<CanvasComment[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasComments.length == 0)  ||  (this.isDirtyCanvasComments) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasComments = data;

                        this.isDirtyCanvasComments = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getCanvasComments 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasComments)
                        resolve(this.canvasComments);
                    });
            } else {
                console.log('%c    Global-Variables getCanvasComments 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasComments)
                resolve(this.canvasComments);
            }
        });

    }

    addCanvasComment(data: CanvasComment): Promise<any> {
        // Description: Adds a new canvasComment
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addCanvasComment ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'canvasComments';
        this.filePath = './assets/data.CanvasComments.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {

                    // Update NrComments field if a W is linked
                    if (data.widgetID != null) {
                        this.widgets.forEach(w => {
                            if (w.id == data.widgetID) {
                                w.nrComments = w.nrComments + 1;
                            };
                        });
                    };

                    // Update Global vars to make sure they remain in sync
                    this.canvasComments.push(JSON.parse(JSON.stringify(res)));

                    console.log('addCanvasComment ADDED', res, this.canvasComments, this.canvasComments)

                    resolve(res);
                },
                err => {
                    console.log('Error addCanvasComment FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveCanvasComment(data: CanvasComment): Promise<string> {
        // Description: Saves CanvasComment
        // Returns: 'Saved' or error Comment
        console.log('%c    Global-Variables saveCanvasComment ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'canvasComments';
        this.filePath = './assets/data.canvasComments.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.canvasComments.findIndex(msg =>
                        msg.id == data.id
                    );
                    this.canvasComments[localIndex] = data;

                    console.log('saveCanvasComment SAVED', data)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveCanvasComment FAILED', err);;
                    resolve(err.Comment);
                }
            )
        });
    }

    deleteCanvasComment(id: number, widgetID: number = null): Promise<string> {
        // Description: Deletes a canvasComments
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteCanvasComment ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'canvasComments';
        this.filePath = './assets/data.CanvasComments.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                res => {

                    // Update NrComments field if a W is linked
                    if (widgetID != null) {
                        this.widgets.forEach(w => {
                            if (w.id == widgetID) {
                                w.nrComments = w.nrComments - 1;
                            };
                        });
                    };

                    this.canvasComments = this.canvasComments.filter(
                        com => com.id != id
                    );

                    console.log('deleteCanvasComment DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteCanvasComment FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getCanvasMessages(): Promise<CanvasMessage[]> {
        // Description: Gets all Canvas Messages
        // Returns: this.canvasMessages array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCanvasMessages ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasMessages.length);

        let url: string = 'canvasMessages';
        this.filePath = './assets/settings.canvasMessages.json';

        return new Promise<CanvasMessage[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasMessages.length == 0)  ||  (this.isDirtyCanvasMessages) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(res => {
                        this.canvasMessages = res;

                        this.isDirtyCanvasMessages = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getCanvasMessages 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasMessages)
                        resolve(this.canvasMessages);
                    });
            } else {
                console.log('%c    Global-Variables getCanvasMessages 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasMessages)
                resolve(this.canvasMessages);
            }
        });

    }

    addCanvasMessage(data: CanvasMessage): Promise<any> {
        // Description: Adds a new CanvasMessage
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addCanvasMessage ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'canvasMessages';
        this.filePath = './assets/data.canvasMessages.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {

                    // Update Global vars to make sure they remain in sync
                    this.canvasMessages.push(JSON.parse(JSON.stringify(res)));

                    console.log('addCanvasMessage ADDED', this.canvasMessages)

                    resolve(res);
                },
                err => {
                    console.log('Error addCanvasMessage FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveCanvasMessage(data: CanvasMessage): Promise<string> {
        // Description: Saves CanvasMessage
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveCanvasMessage ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'canvasMessages';
        this.filePath = './assets/data.canvasMessages.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.canvasMessages.findIndex(msg =>
                        msg.id == data.id
                    );
                    this.canvasMessages[localIndex] = data;

                    console.log('saveCanvasMessage SAVED', data)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveCanvasMessage FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    updateCanvasMessagesAsRead(userID: string) {
        // Marks all messages for this userID as read - typically done when Messages form
        // is closed, or at logout.
        console.log('%c    Global-Variables addCanvasMessage ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // TODO - this must be done via the DB: for now, only glob-var array
        let today = new Date();
        this.canvasMessages.forEach(msg => {
            msg.recipients.forEach(rec => {
                if (rec.userID == userID) {
                    rec.readOn = this.formatDate(today);
                };
            });
        });
    }

    deleteCanvasMessage(id: number): Promise<string> {
        // Description: Deletes a canvasMessages
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteCanvasMessage ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'canvasMessages';
        this.filePath = './assets/data.CanvasMessages.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.canvasMessages = this.canvasMessages.filter(
                        msg => msg.id != id
                    );

                    console.log('deleteCanvasMessage DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteCanvasMessage FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getWidgetCheckpoints(): Promise<WidgetCheckpoint[]> {
        // Description: Gets all Canvas Messages
        // Returns: this.widgetCheckpoints array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getWidgetCheckpoints ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.widgetCheckpoints.length);

        let url: string = 'widgetCheckpoints';
        this.filePath = './assets/settings.widgetCheckpoints.json';

        return new Promise<WidgetCheckpoint[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.widgetCheckpoints.length == 0)  ||  (this.isDirtyWidgetCheckpoints) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.widgetCheckpoints = data.filter(d => (!d.parentWidgetIsDeleted) );

                        this.isDirtyWidgetCheckpoints = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getWidgetCheckpoints 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.widgetCheckpoints)
                        resolve(this.widgetCheckpoints);
                    });
            } else {
                console.log('%c    Global-Variables getWidgetCheckpoints 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.widgetCheckpoints)
                resolve(this.widgetCheckpoints);
            }
        });

    }

    getCurrentWidgetCheckpoints(dashboardID: number): Promise<WidgetCheckpoint[]> {
        // Description: Gets all Checkpoints for current D
        // Returns: this.currentWidgetCheckpoints array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCurrentWidgetCheckpoints ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // Refresh from source at start, or if dirty
        if ( (this.widgetCheckpoints.length == 0)  ||  (this.isDirtyWidgetCheckpoints) ) {
            return new Promise<WidgetCheckpoint[]>((resolve, reject) => {
                this.getWidgetCheckpoints()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentWidgetCheckpoints = data;
                        console.log('%c    Global-Variables getCurrentWidgetCheckpoints 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID, data)
                        resolve(this.currentWidgetCheckpoints);

                })
             })
        } else {
            return new Promise<WidgetCheckpoint[]>((resolve, reject) => {
                let returnData: WidgetCheckpoint[];
                returnData = this.widgetCheckpoints.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentWidgetCheckpoints = returnData;
                console.log('%c    Global-Variables getCurrentWidgetCheckpoints 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", dashboardID, returnData)
                resolve(this.currentWidgetCheckpoints);
            });
        };

    }

    addWidgetCheckpoint(data: WidgetCheckpoint): Promise<any> {
        // Description: Adds a new WidgetCheckpoint
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addWidgetCheckpoint ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'widgetCheckpoints';
        this.filePath = './assets/data.widgetCheckpoints.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {

                    // Update Global vars to make sure they remain in sync
                    this.widgetCheckpoints.push(JSON.parse(JSON.stringify(data)));
                    this.currentWidgetCheckpoints.push(JSON.parse(JSON.stringify(data)));

                    console.log('addWidgetCheckpoint ADDED', data, this.currentWidgetCheckpoints, this.widgetCheckpoints)

                    resolve(data);
                },
                err => {
                    console.log('Error addWidgetCheckpoint FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteWidgetCheckpoint(id: number): Promise<string> {
        // Description: Deletes a WidgetCheckpoints
        // Returns: 'Deleted' or error message
        console.log('%c    Global-Variables deleteWidgetCheckpoint ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", id);

        let url: string = 'widgetCheckpoints';
        this.filePath = './assets/data.widgetCheckpoints.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    // Update vars
                    this.widgetCheckpoints = this.widgetCheckpoints.filter(
                        chk => chk.id != id
                    );
                    this.currentWidgetCheckpoints = this.currentWidgetCheckpoints.filter(
                        chk => chk.id != id
                    );

                    console.log('deleteWidgetCheckpoint DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteWidgetCheckpoint FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveWidgetCheckpoint(data: WidgetCheckpoint): Promise<string> {
        // Description: Saves Widget Checkpoint
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveWidgetCheckpoint ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data);

        let url: string = 'widgetCheckpoints';
        this.filePath = './assets/data.widgetCheckpoints.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.widgetCheckpoints.findIndex(d =>
                        d.id == data.id
                    );
                    this.widgetCheckpoints[localIndex] = data;

                    console.log('saveWidgetCheckpoint SAVED')
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveWidgetCheckpoint FAILED');;
                    resolve(err.Message.toString());
                }
            )
        });
    }

    getTree<T>(url: string, options?: any, dashboardID?: number, datasourceID?: number): Promise<any> {
        // Generic GET data, later to be replaced with http
        console.log('%c    Global-Variables get ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        return new Promise((resolve, reject) => {
            // Get from source - files for now ...
            var tree = dl.json(this.filePath, {data: 'data'})
                    console.log('currentData', tree);
                    // TODO - fix reading [] with dl !!!
                    resolve(tree);
            }
        );
    }

    getCanvasUsers(): Promise<CanvasUser[]> {
        // Description: Gets all Canvas Users
        // Returns: this.users array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCanvasUsers ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'canvasUsers';
        this.filePath = './assets/data.canvasUsers.json';

        return new Promise<CanvasUser[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasUsers.length == 0)  ||  (this.isDirtyUsers) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasUsers = data;
                        this.isDirtyUsers = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getCanvasUsers 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasUsers)
                        resolve(this.canvasUsers);
                    });
            } else {
                console.log('%c    Global-Variables getCanvasUsers 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasUsers)
                resolve(this.canvasUsers);
            }
        });

    }

    validateUser(userID: string): Promise<boolean> {
        // Checks if userID exists.  If not, return false.
        // If so, set currentUser object and return true
        console.log('%c    Global-Variables validateUser ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        // TODO - do in more safe way with DB, Auth0, etc
        return new Promise<boolean>((resolve, reject) => {
            this.getCanvasUsers().then(usr => {
                let foundIndex: number = this.canvasUsers.findIndex(u => u.userID == userID);
                if (foundIndex < 0) {
                    console.warn('xx Invalid userid', userID)
                    resolve(false);
                } else {
                    resolve(true);
                    console.warn('xx Valid userid', userID)
                };
            });
        });
    }

    saveCanvasUser(data: CanvasUser): Promise<string> {
        // Description: Saves CanvasUser
        // Returns: 'Saved' or error message
        console.log('%c    Global-Variables saveCanvasUser ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        let url: string = 'canvasUsers';
        this.filePath = './assets/data.canvasUsers.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {

                    // Replace local
                    let localIndex: number = this.canvasUsers.findIndex(u =>
                        u.id == data.id
                    );
                    this.canvasUsers[localIndex] = data;

                    console.log('saveCanvasUser SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveCanvasUser FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getCanvasAuditTrails(): Promise<CanvasAuditTrail[]> {
        // Description: Gets all Canvas AuditTrails
        // Returns: this.canvasAuditTrails array, unless:
        //   If not cached or if dirty, get from File
        console.log('%c    Global-Variables getCanvasAuditTrails ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasAuditTrails.length);

        let url: string = 'canvasAuditTrails';
        this.filePath = './assets/settings.canvasAuditTrails.json';

        return new Promise<CanvasAuditTrail[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasAuditTrails.length == 0)  ||  (this.isDirtyCanvasAuditTrails) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasAuditTrails = data;

                        this.isDirtyCanvasAuditTrails = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('%c    Global-Variables getCanvasAuditTrails 1',
                        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasAuditTrails)
                        resolve(this.canvasAuditTrails);
                    });
            } else {
                console.log('%c    Global-Variables getCanvasAuditTrails 2',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", this.canvasAuditTrails)
                resolve(this.canvasAuditTrails);
            }
        });

    }

    addCanvasAuditTrail(data: CanvasAuditTrail): Promise<any> {
        // Description: Adds a new canvasAuditTrail
        // Returns: Added Data or error message
        console.log('%c    Global-Variables addCanvasAuditTrail ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", data.id);

        let url: string = 'canvasAuditTrails';
        this.filePath = './assets/data.CanvasAuditTrails.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3002/' + url, data, {headers})
            .subscribe(
                res => {

                    // Update Global vars to make sure they remain in sync
                    this.canvasAuditTrails.push(JSON.parse(JSON.stringify(res)));

                    console.log('addCanvasAuditTrail ADDED', res, this.canvasAuditTrails, this.canvasAuditTrails)

                    resolve(res);
                },
                err => {
                    console.log('Error addCanvasAuditTrail FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    get<T>(url: string, options?: any, dashboardID?: number, datasourceID?: number): Promise<any> {
        // Generic GET data, later to be replaced with http
        console.log('%c    Global-Variables get (url, filePath) ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", url, this.filePath);

        // TODO - cleaner switch to http?
        // if (this.filePath == './assets/data.widgets.json') {
        if (this.getSource = 'Test') {
            const params = new HttpParams()
                .set('orderBy', '"dashboardTabID"')
                .set('limitToFirst', "1");
            // const headers = new HttpHeaders()
            //     .set("Content-Type", "application/json");

            // PUT
            // this.http.put("/courses/-KgVwECOnlc-LHb_B0cQ.json",
            // {
            //     "courseListIcon": ".../main-page-logo-small-hat.png",
            //     "description": "Angular Tutorial For Beginners TEST",
            //     "iconUrl": ".../angular2-for-beginners.jpg",
            //     "longDescription": "...",
            //     "url": "new-value-for-url"
            // },
            // {headers})
            // .subscribe(

            // MULTIPLE
            // const parallel$ = Observable.forkJoin(
            //     this.http.get('/courses/-KgVwEBq5wbFnjj7O8Fp.json'),
            //     this.http.get('/courses/-KgVwECOnlc-LHb_B0cQ.json')
            // );

            // parallel$.subscribe(

            // IN SEQUENCE
            // const sequence$ = this.http.get<Course>(
            //     '/courses/-KgVwEBq5wbFnjj7O8Fp.json')
            // .switchMap(course => {

            //     course.description+= ' - TEST ';

            //     return this.http.put(
            //         '/courses/-KgVwEBq5wbFnjj7O8Fp.json',
            //         course)
            // });
            // sequence$.subscribe();

            // PROGRESS
            // const req = new HttpRequest('GET', this.url, {
            //     reportProgress: true
            //   });

            //   this.http.request(req).subscribe((event: HttpEvent<any>) => {
            //     switch (event.type) {
            //       case HttpEventType.Sent:
            //         console.log('Request sent!');
            //         break;
            //       case HttpEventType.ResponseHeader:
            //         console.log('Response header received!');
            //         break;
            //       case HttpEventType.DownloadProgress:
            //         const kbLoaded = Math.round(event.loaded / 1024);
            //         console.log(`Download in progress! ${ kbLoaded }Kb loaded`);
            //         break;
            //       case HttpEventType.Response:
            //         console.log('😺 Done!', event.body);
            //     }
            //   });

            return new Promise((resolve, reject) => {
                // this.http.get(this.filePath).subscribe(res => resolve(res));

                // Cater for different Servers
                let finalUrl: string = '';
                if (url == 'dashboardsRecent') {
                    finalUrl = 'http://localhost:3001/' + url;
                } else if (url == 'dataConnections') {
                    finalUrl = 'http://localhost:3001/' + url;
                } else if (url == 'dataTables') {
                    finalUrl = 'http://localhost:3001/' + url;
                } else if (url == 'dataFields') {
                    finalUrl = 'http://localhost:3001/' + url;
                } else if (url == 'dashboardSnapshots') {
                    finalUrl = 'http://localhost:3000/' + url;
                } else if (url == 'widgetCheckpoints') {
                    finalUrl = 'http://localhost:3000/' + url;
                } else if (url == 'data') {
                    finalUrl = 'http://localhost:3000/' + url;
                } else if (url == 'datasets') {
                    finalUrl = 'http://localhost:3000/' + url;
                } else if (url == 'canvasAuditTrails') {
                    finalUrl = 'http://localhost:3002/' + url;
                } else if (url == 'paletteButtonBars') {
                    finalUrl = 'http://localhost:3001/' + url;
                } else if (url == 'paletteButtonsSelecteds') {
                    finalUrl = 'http://localhost:3001/' + url;
                } else if (url == 'widgets') {
                    finalUrl = 'http://localhost:3005/' + url;
                } else {
                    finalUrl = 'http://localhost:3000/' + url;
                };


                this.http.get(finalUrl).subscribe(
                    res =>
                    {
                        resolve(res);
                    },
                    (err: HttpErrorResponse) => {
                        if (err.error instanceof Error) {
                          console.log("Client-side error occured.");
                        } else {
                          console.log("Server-side error occured.");
                        };
                        console.log('ERROR Error',err.error);
                        console.log('ERROR Name',err.name);
                        console.log('ERROR Message',err.message);
                        console.log('ERROR Status',err.status);
                      }
                )}
            );

        };

        if (this.getSource == 'File') {
            return new Promise((resolve, reject) => {
                // Get from source - files for now ...
                dl.json({url: this.filePath}, {children: 'graphSpecification'}, (err, currentData) => {
                    if (err) {
                        reject(err)
                    } else {
                        if (options == 'metadata') {}
                        resolve(currentData);
                    }
                    });
                }
            );
        };
    }

    connectLocalDB<T>(): Promise<string | Object> {
        // Connect to the local DB, ie nanaSQL
        console.log('%c    Global-Variables connectLocalDB',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");

        return new Promise((resolve, reject) => {

            // NB: if you CLEAR the IndexDB in the Browser, and create new records (where
            // pk = null, and props = ai, then it creates a new record for each one already
            // in the DB - true story!
            // TODO - for now, must delete IndexDB in browser, Application when shema changes
            // TODO - add proper error message if it fails

            // Users Table
            nSQL('users')
            .model ([
                {key:'id',type:'int', props:['pk','ai']}, // pk == primary key, ai == auto incriment
                {key:'name',type:'string'},
                {key:'age', type:'int'}
            ])
            .config({
                id: "CanvasCache",
                mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
                history: false // allow the database to undo/redo changes on the fly.
            })

            // DashboardSnapshot Table
            nSQL('DashboardSnapshot')
            .model ([
                {key:'id', type: 'int', props:['pk', 'ai']},
                {key:'dashboardID', type: 'int'},
                {key:'name', type: 'string'},
                {key:'comment', type: 'string'}
            ])
            .config({
                id: "CanvasCache",
                mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
                history: false // allow the database to undo/redo changes on the fly.
            })
            .actions([
                {
                    name:'addNewDashboardSnapshot',
                    args:['row: map'],
                    call:function(args, db) {
                        return db.query('upsert',args.row).exec();
                    }
                }
            ])
            .views([
                {
                    name: 'getDashboardSnapshotByID',
                    args: ['id:int'],
                    call: function(args, db) {
                        return db.query('select').where(['id','=',args.id]).exec();
                    }
                },
            ])

            // Dataset Table
            nSQL('Dataset')
            .model ([
                {key:'id', type: 'int', props:['pk', 'ai']},
                {key:'datasourceID', type: 'int'},
                {key:'folderName', type: 'string'},
                {key:'fileName', type: 'string'},
                {key:'data', type: 'array'},
                {key:'dataRaw', type: 'array'}
            ])
            .config({
                id: "CanvasCache",
                mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
                history: false // allow the database to undo/redo changes on the fly.
            })
            .actions([
                {
                    name:'addNewDataset',
                    args:['row: map'],
                    call:function(args, db) {
                        return db.query('upsert',args.row).exec();
                    }
                }
            ])
            .views([
                {
                    name: 'getDatasetByID',
                    args: ['id:int'],
                    call: function(args, db) {
                        return db.query('select').where(['id','=',args.id]).exec();
                    }
                },
            ])

            // Widgets Table
            nSQL('widgets')
            .model([
                {key: 'widgetType', 				type: 'string'},
                {key: 'widgetSubType', 				type: 'string'},
                {key: 'dashboardID', 				type: 'int'},
                {key: 'dashboardTabID', 			type: 'int'},
                {key: 'dashboardTabIDs', 			type: 'array'},
                {key: 'isLocked', 			        type: 'bool'},
                {key: 'id', 						type: 'int',		props:['pk','ai']},
                {key: 'originalID', 				type: 'int',		props:['pk','ai']},
                {key: 'name', 						type: 'string'},
                {key: 'description', 				type: 'string'},
                {key: 'visualGrammar', 				type: 'string'},
                {key: 'annotation', 				type: 'string'},
                {key: 'annotationLastUserID', 		type: 'string'},
                {key: 'annotationLastUpdated', 		type: 'string'},
                {key: 'version', 					type: 'int'},
                {key: 'isLiked', 					type: 'bool'},
                {key: 'isSelected', 				type: 'bool'},
                {key: 'nrDataQualityIssues', 		type: 'int'},
                {key: 'nrComments', 				type: 'int'},
                {key: 'showCheckpoints', 			type: 'bool'},
                {key: 'checkpointIDs', 			    type: 'array'},
                {key: 'currentCheckpoint', 			type: 'int'},
                {key: 'lastCheckpoint', 			type: 'int'},
                {key: 'hyperlinkDashboardID', 		type: 'int'},
                {key: 'hyperlinkDashboardTabID', 	type: 'int'},
                {key: 'datasourceID', 				type: 'int'},
                {key: 'datasetID', 					type: 'int'},
                {key: 'dataParameters', 			type: 'array'},
                {key: 'reportID', 					type: 'int'},
                {key: 'reportName', 				type: 'string'},
                {key: 'rowLimit', 					type: 'int'},
                {key: 'addRestRow', 				type: 'bool'},
                {key: 'size', 						type: 'string'},
                {key: 'containerBackgroundcolor', 	type: 'string'},
                {key: 'containerBorder', 			type: 'string'},
                {key: 'containerBorderRadius', 	    type: 'string'},
                {key: 'containerBoxshadow', 		type: 'string'},
                {key: 'containerFontsize', 			type: 'int'},
                {key: 'containerHeight', 			type: 'int'},
                {key: 'containerLeft', 				type: 'int'},
                {key: 'containerHasTitle', 		    type: 'bool'},
                {key: 'containerTop', 				type: 'int'},
                {key: 'containerWidth', 			type: 'int'},
                {key: 'containerZindex', 			type: 'int'},
                {key: 'titleText', 					type: 'string'},
                {key: 'titleBackgroundColor', 		type: 'string'},
                {key: 'titleBorder', 				type: 'string'},
                {key: 'titleColor', 				type: 'string'},
                {key: 'titleFontsize', 				type: 'int'},
                {key: 'titleFontWeight', 			type: 'string'},
                {key: 'titleHeight', 				type: 'int'},
                {key: 'titleMargin', 				type: 'string'},
                {key: 'titlePadding', 				type: 'string'},
                {key: 'titleTextAlign', 			type: 'string'},
                {key: 'titleWidth', 				type: 'int'},
                {key: 'graphType', 					type: 'string'},
                {key: 'graphHeight', 				type: 'int'},
                {key: 'graphLeft', 					type: 'int'},
                {key: 'graphTop', 					type: 'int'},
                {key: 'graphWidth', 				type: 'int'},
                {key: 'graphGraphPadding', 			type: 'int'},
                {key: 'graphHasSignals', 			type: 'bool'},
                {key: 'graphFillColor', 			type: 'string'},
                {key: 'graphHoverColor', 			type: 'string'},
                {key: 'graphSpecification', 		type: 'any'},
                {key: 'graphDescription', 			type: 'string'},
                {key: 'graphXaggregate', 			type: 'string'},
                {key: 'graphXtimeUnit', 			type: 'string'},
                {key: 'graphXfield', 				type: 'string'},
                {key: 'graphXtype', 				type: 'string'},
                {key: 'graphXaxisTitle', 			type: 'string'},
                {key: 'graphYaggregate', 			type: 'string'},
                {key: 'graphYtimeUnit', 			type: 'string'},
                {key: 'graphYfield', 				type: 'string'},
                {key: 'graphYtype', 				type: 'string'},
                {key: 'graphYaxisTitle', 			type: 'string'},
                {key: 'graphTitle', 				type: 'string'},
                {key: 'graphMark', 					type: 'string'},
                {key: 'graphMarkColor', 			type: 'string'},
                {key: 'graphUrl', 					type: 'string'},
                {key: 'graphData', 					type: 'any'},
                {key: 'graphColorField', 			type: 'string'},
                {key: 'graphColorType', 			type: 'string'},
                {key: 'tableBackgroundColor', 		type: 'string'},
                {key: 'tableColor', 				type: 'string'},
                {key: 'tableCols', 					type: 'int'},
                {key: 'fontSize',                   type: 'string'},
                {key: 'tableHeight', 				type: 'int'},
                {key: 'tableHideHeader', 			type: 'bool'},
                {key: 'tableLeft', 					type: 'int'},
                {key: 'tableLineHeight', 			type: 'int'},
                {key: 'tableRows', 					type: 'int'},
                {key: 'tableTop', 					type: 'int'},
                {key: 'tableWidth', 				type: 'int'},
                {key: 'slicerAddRest', 				type: 'bool'},
                {key: 'slicerAddRestValue', 		type: 'bool'},
                {key: 'slicerBins', 			    type: 'array'},
                {key: 'slicerColor', 		        type: 'string'},
                {key: 'slicerFieldName', 			type: 'string'},
                {key: 'slicerNumberToShow', 		type: 'string'},
                {key: 'slicerSelection', 			type: 'array'},
                {key: 'slicerSortField', 			type: 'string'},
                {key: 'slicerSortFieldOrder', 		type: 'string'},
                {key: 'slicerType', 				type: 'string'},
                {key: 'shapeStroke', 				type: 'string'},
                {key: 'shapeStrokeWidth', 			type: 'string'},
                {key: 'shapeSvgHeight', 			type: 'int'},
                {key: 'shapeSvgWidth', 			    type: 'int'},
                {key: 'shapeFill', 					type: 'string'},
                {key: 'shapeText', 					type: 'string'},
                {key: 'shapeTextAlign',				type: 'string'},
                {key: 'shapeTextColour', 			type: 'string'},
                {key: 'shapeValue', 				type: 'string'},
                {key: 'shapeBullets', 				type: 'string'},
                {key: 'shapeBulletStyleType', 		type: 'int'},
                {key: 'shapeBulletsOrdered', 		type: 'bool'},
                {key: 'shapeBulletMarginBottom', 		type: 'int'},
                {key: 'shapeOpacity', 				type: 'int'},
                {key: 'shapeRotation', 				type: 'int'},
                {key: 'shapeSize', 				    type: 'int'},
                {key: 'shapeCorner', 				type: 'int'},
                {key: 'shapeFontSize', 				type: 'int'},
                {key: 'shapeFontFamily', 			type: 'string'},
                {key: 'shapeIsBold', 				type: 'bool'},
                {key: 'shapeIsItalic', 				type: 'bool'},
                {key: 'refreshMode', 				type: 'string'},
                {key: 'refreshFrequency', 			type: 'int'},
                {key: 'widgetRefreshedOn', 			type: 'string'},
                {key: 'widgetRefreshedBy', 			type: 'string'},
                {key: 'widgetCreatedOn', 			type: 'string'},
                {key: 'widgetCreatedBy', 			type: 'string'},
                {key: 'widgetUpdatedOn', 			type: 'string'},
                {key: 'widgetUpdatedBy', 			type: 'string'}
            ])
            .config({
                id: "CanvasCache",
                mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
                history: false // allow the database to undo/redo changes on the fly.
            })
            .actions([
                {
                    name:'addNewWidget',
                    args:['row: map'],
                    call:function(args, db) {
                        return db.query('upsert',args.row).exec();
                    }
                }
            ])
            .views([
                {
                    name: 'getWidgetByID',
                    args: ['id:int'],
                    call: function(args, db) {
                        return db.query('select').where(['id','=',args.id]).exec();
                    }
                },
            ])
            .connect()
            .then(db => {
                console.log('%c    Global-Variables connectLocalDB',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", db)
                resolve(db)

            })
        })
    }

    getLocal<T>(table: string, params?: any): Promise<any> {
        // Generic retrieval of data from localDB
        console.log('%c    Global-Variables getLocal for table, params...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", table, params);

        return new Promise((resolve, reject) => {

            nSQL(table).query('select').exec()
            .then( result => {
                console.log('%c    Global-Variables getLocal result',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", result) // <= arrayid:1, name:"bill", age: 20}]
                resolve(result)
            })

            // Worked
            // nSQL(table).connect()
            // .then(function(result) {
            //     return nSQL().query('select').exec(); // select all rows from the current active table
            // })
            // .then(function(result) {
            //     console.log('%c    Global-Variables getLocal result', result) // <= arrayid:1, name:"bill", age: 20}]
            //     resolve(result)
            // })

        })
    }

    saveLocal<T>(table: string, row: any): Promise<any> {
        // Generic saving of row to a table in the localDB
        console.log('%c    Global-Variables saveLocal for table...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", table);
        return new Promise((resolve, reject) => {

            nSQL(table).query('upsert', row).exec().then(res => {

                // TODO - we need a better way to update the global vars
                if (table == 'DashboardSnapshot') {
                    res.forEach( r => {
                        r.affectedRows.forEach(ra => {
                            this.dashboardSnapshots.push(ra);
                            this.currentDashboardSnapshots.push(ra);
                        })
                    });
                };
            });
            // Worked
            // nSQL(table).connect()
            // .then(function(result) {
            //     resolve(nSQL().query('upsert', row).exec());
            // })

        })
    }


    //         // Example 1
        //         // nSQL('widgets') //  "users" is our table name.
        //         // .model([ // Declare data model
        //         //     {key:'id',type:'int',props:['pk','ai']}, // pk == primary key, ai == auto incriment
        //         //     {key:'name',type:'string'},
        //         //     {key:'age', type:'int'}
        //         // ])
        //         // .connect() // Init the data store for usage. (only need to do this once)
        //         // .then(function(result) {
        //         //     return nSQL().query('upsert',{ // Add a record
        //         //         id: null, name:"boy", age: 54
        //         //     }).exec();
        //         // })
        //         // .then(function(result) {
        //         //     return nSQL().query('select').exec(); // select all rows from the current active table
        //         // })
        //         // .then(function(result) {
        //         // })

        //         // Example 2
        //         // nSQL('users')// Table/Store Name, required to declare model and attach it to this store.
        //         // .model([ // Data Model, required
        //         //     {key:'id',type:'int',props:['pk', 'ai']}, // pk == primary key, ai == auto incriment
        //         //     {key:'name',type:'string'},
        //         //     {key:'age', type:'int'}
        //         // ])
        //         // .config({
        //         // 	mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
        //         // 	history: true // allow the database to undo/redo changes on the fly.
        //         // })
        //         // .actions([ // Optional
        //         // 	{
        //         // 		name:'add_new_user',
        //         // 		args:['user:map'],
        //         // 		call:function(args, db) {
        //         // 			return db.query('upsert',args.user).exec();
        //         // 		}
        //         // 	}
        //         // ])
        //         // .views([ // Optional
        //         // 	{
        //         // 		name: 'get_user_by_name',
        //         // 		args: ['name:string'],
        //         // 		call: function(args, db) {
        //         // 			return db.query('select').where(['name','=',args.name]).exec();
        //         // 		}
        //         // 	},
        //         // 	{
        //         // 		name: 'list_all_users',
        //         // 		args: ['page:int'],
        //         // 		call: function(args, db) {
        //         // 			return db.query('select',['id','name']).exec();
        //         // 		}
        //         // 	}
        //         // ])
        //         // .connect()
        //             // .then( conn =>
        //             // 	nSQL().doAction('add_new_user', { user: { id: null, name:"bill", age: 20 } } )
        //             // 	.then(first =>
        //             // 		nSQL().doAction('add_new_user', { user: { id: 4, name:"bambie", age: 21 } } )
        //             // 		// nSQL().query('upsert',{ // Add a record
        //             // 		// 	name:"bill", age: 20
        //             // 		// }).exec()
        //             // 			.then(second => {
        //             // 				return nSQL().getView('list_all_users');
        //             // 			}).then(result => {
        //             // 			})
        //             // 		)
        //             // )
        //     })
    // }

    refreshCurrentDashboard(
        refreshingRoutine: string,
        dashboardID: number,
        dashboardTabID: number = 0,
        tabToShow: string = '',
        widgetsToRefresh: number[] = []) {
        // Refresh the global var currentDashboardInfo, then .next it.
        // This will refresh the Dashboard on the screen (via .subscribe)
        // If a dashboardTabID is given, this one will be shown.  Else, it will navigate
        // to tabToShow, which can be First, Previous, Next, Last.  tabToShow overules
        // dashboardTabID if tabToShow is given.  It does not assume that all the currentD
        // Info has already been collected - to allow for the first time this is called.
        // It does assume that we have a currentDashboardInfo object if Previous/Next are
        // parameters.
        console.log('%c    Global-Variables refreshCurrentDashboard ...',
        "color: black; background: lightgray; font-size: 10px");

        // TODO - add Permissions, either here or automatically in DB !!!

        // Make sure the currT are indeed for the requested D
        let currentDashboardTabs: DashboardTab[];
        currentDashboardTabs = this.dashboardTabs.filter(t => t.dashboardID == dashboardID);
        currentDashboardTabs = currentDashboardTabs.sort( (obj1,obj2) => {
            if (obj1.displayOrder > obj2.displayOrder) {
                return 1;
            };
            if (obj1.displayOrder < obj2.displayOrder) {
                return -1;
            };
            return 0;
        });

        // Assume we have all currentD info
        if ( ( (tabToShow == 'Previous')  ||  (tabToShow == 'Next') )  &&
            (this.currentDashboardInfo == null) ) {
            return;
        };

        let dt = new Date();
        let x: number = 0;
        let y: number = 0;

        if (tabToShow != '') {
            if (currentDashboardTabs.length == 0) {
                console.log('this.currentDashboardTabs empty');
                return;
            }
            if (tabToShow == 'First') {
                x = 0;
            }
            if (tabToShow == 'Previous') {
                x = this.currentDashboardInfo.value.currentDashboardTabIndex - 1;
                if (x < 0) {
                    x = currentDashboardTabs.length - 1;
                }
            }
            if (tabToShow == 'Next') {
                x = this.currentDashboardInfo.value.currentDashboardTabIndex + 1;
                if (x >= currentDashboardTabs.length) {
                    x = 0;
                }
            }
            if (tabToShow == 'Last') {
                x = currentDashboardTabs.length - 1;

            }
            y = currentDashboardTabs[x].id;
        } else {
            y = dashboardTabID;

            if (currentDashboardTabs.length == 0) {
                x = 0;
            } else {
                for (var i = 0; i < currentDashboardTabs.length; i++) {
                    if (currentDashboardTabs[i].id == dashboardTabID) {
                        x = i;
                    };
                };
            };
        };

        // Register in Recent
        // this.amendDashboardRecent(dashboardID, y);

        // Inform subscribers of the change
        let dashboardIndex: number = this.dashboards.findIndex(d => d.id == dashboardID)
        let state: string = 'Draft';
        if (dashboardIndex >= 0) {
            state = this.dashboards[dashboardIndex].state;
        };
        this.currentDashboardInfo.next({
            currentDashboardID: dashboardID,
            currentDashboardState: state,
            currentDashboardTabID: y,
            currentDashboardTabIndex: x,
            refreshingRoutine: refreshingRoutine,
            refreshDateTime: dt.toString(),
            widgetsToRefresh
        });

    }

    dashboardMoveInfo(newDashboardID: number, oldDashboard: Dashboard): Dashboard {
        // Creates a new Dashboard with ID = newDashboardID, but all properties from
        // oldDashboard
        // - changedDashboard = new D, with changed properties
        console.log('%c    Global-Variables ... dashboardMoveInfo',
        "color: black; background: lightgray; font-size: 10px", newDashboardID);

        let returnDashboard: Dashboard = {
            id:  newDashboardID,
            originalID: oldDashboard.originalID,
            draftID: oldDashboard.draftID,
            version: oldDashboard.version,
            state: oldDashboard.state,
            code: oldDashboard.code,
            name: oldDashboard.name,
            description: oldDashboard.description,
            accessType: oldDashboard.accessType,
            password: oldDashboard.password,
            refreshMode: oldDashboard.refreshMode,
            refreshTimer: oldDashboard.refreshTimer,
            defaultTabID: oldDashboard.defaultTabID,
            defaultExportFileType: oldDashboard.defaultExportFileType,
            url: oldDashboard.url,
            qaRequired: oldDashboard.qaRequired,
            isSample: oldDashboard.isSample,
            backgroundColor: oldDashboard.backgroundColor,
            backgroundImage: oldDashboard.backgroundImage,
            templateDashboardID: oldDashboard.templateDashboardID,
            creator: oldDashboard.creator,
            dateCreated: oldDashboard.dateCreated,
            editor: oldDashboard.editor,
            dateEdited: oldDashboard.dateEdited,
            refresher: oldDashboard.refresher,
            dateRefreshed: oldDashboard.dateRefreshed,
            nrWidgets: oldDashboard.nrWidgets,
            nrShapes: oldDashboard.nrShapes,
            nrRecords: oldDashboard.nrRecords,
            nrTimesOpened: oldDashboard.nrTimesOpened,
            nrTimesChanged: oldDashboard.nrTimesChanged,
            tabs: oldDashboard.tabs,
            permissions: oldDashboard.permissions

        };

        // Return
        return returnDashboard;
    }

    widgetReplace(changedWidget: Widget) {
        // Replaces (ByVal) the global W and currentW
        console.log('%c    Global-Variables ... widgetReplace',
        "color: black; background: lightgray; font-size: 10px", changedWidget.id);

        // TODO - this is not DRY - there must be a better way!!
        this.widgets.forEach(w => {
            if (w.id == changedWidget.id) {
                // TODO - Make a deep copy / error free, less work copy
                w.widgetType = changedWidget.widgetType;
                w.widgetSubType = changedWidget.widgetSubType;
                w.dashboardID = changedWidget.dashboardID;
                w.dashboardTabID = changedWidget.dashboardTabID;
                w.dashboardTabIDs = changedWidget.dashboardTabIDs;
                w.isLocked = changedWidget.isLocked;
                w.id = changedWidget.id;
                w.originalID = changedWidget.originalID;
                w.name = changedWidget.name;
                w.description = changedWidget.description;
                w.visualGrammar = changedWidget.visualGrammar;
                w.annotationLastUserID = changedWidget.annotationLastUserID;
                w.annotationLastUpdated = changedWidget.annotationLastUpdated;
                w.annotation = changedWidget.annotation;
                w.version = changedWidget.version;
                w.isSelected = changedWidget.isSelected;
                w.isLiked = changedWidget.isLiked;
                w.nrDataQualityIssues = changedWidget.nrDataQualityIssues;
                w.nrComments = changedWidget.nrComments;
                w.showCheckpoints = changedWidget.showCheckpoints;
                w.checkpointIDs = changedWidget.checkpointIDs;
                w.currentCheckpoint = changedWidget.currentCheckpoint;
                w.lastCheckpoint = changedWidget.lastCheckpoint;
                w.hyperlinkDashboardID = changedWidget.hyperlinkDashboardID;
                w.hyperlinkDashboardTabID = changedWidget.hyperlinkDashboardTabID;
                w.datasourceID = changedWidget.datasourceID;
                w.datasetID = changedWidget.datasetID;
                w.data = changedWidget.data;
                w.dataFields = changedWidget.dataFields;
                w.dataFieldTypes = changedWidget.dataFieldTypes;
                w.dataFieldLengths = changedWidget.dataFieldLengths;
                w.dataParameters = changedWidget.dataParameters;
                w.reportID = changedWidget.reportID;
                w.reportName = changedWidget.reportName;
                w.rowLimit = changedWidget.rowLimit;
                w.addRestRow = changedWidget.addRestRow;
                w.size = changedWidget.size;
                w.containerBackgroundcolor = changedWidget.containerBackgroundcolor;
                w.containerBorder = changedWidget.containerBorder;
                w.containerBorderRadius = changedWidget.containerBorderRadius;
                w.containerBoxshadow = changedWidget.containerBoxshadow;
                w.containerFontsize = changedWidget.containerFontsize;
                w.containerHeight = changedWidget.containerHeight;
                w.containerLeft = changedWidget.containerLeft;
                w.containerHasTitle = changedWidget.containerHasTitle;
                w.containerTop = changedWidget.containerTop;
                w.containerWidth = changedWidget.containerWidth;
                w.containerZindex = changedWidget.containerZindex;
                w.titleText = changedWidget.titleText;
                w.titleBackgroundColor = changedWidget.titleBackgroundColor;
                w.titleBorder = changedWidget.titleBorder;
                w.titleColor = changedWidget.titleColor;
                w.titleFontsize = changedWidget.titleFontsize;
                w.titleFontWeight = changedWidget.titleFontWeight;
                w.titleHeight = changedWidget.titleHeight;
                w.titleMargin = changedWidget.titleMargin;
                w.titlePadding = changedWidget.titlePadding;
                w.titleTextAlign = changedWidget.titleTextAlign;
                w.titleWidth = changedWidget.titleWidth;
                w.graphType = changedWidget.graphType;
                w.graphHeight = changedWidget.graphHeight;
                w.graphLeft = changedWidget.graphLeft;
                w.graphTop = changedWidget.graphTop;
                w.graphWidth = changedWidget.graphWidth;
                w.graphGraphPadding = changedWidget.graphGraphPadding;
                w.graphHasSignals = changedWidget.graphHasSignals;
                w.graphFillColor = changedWidget.graphFillColor;
                w.graphHoverColor = changedWidget.graphHoverColor;
                w.graphSpecification = changedWidget.graphSpecification;
                w.graphDescription = changedWidget.graphDescription;
                w.graphXaggregate = changedWidget.graphXaggregate;
                w.graphXtimeUnit = changedWidget.graphXtimeUnit;
                w.graphXfield = changedWidget.graphXfield;
                w.graphXtype = changedWidget.graphXtype;
                w.graphXaxisTitle = changedWidget.graphXaxisTitle;
                w.graphYaggregate = changedWidget.graphYaggregate;
                w.graphYtimeUnit = changedWidget.graphYtimeUnit;
                w.graphYfield = changedWidget.graphYfield;
                w.graphYtype = changedWidget.graphYtype;
                w.graphYaxisTitle = changedWidget.graphYaxisTitle;
                w.graphTitle = changedWidget.graphTitle;
                w.graphMark = changedWidget.graphMark;
                w.graphMarkColor = changedWidget.graphMarkColor;
                w.graphUrl = changedWidget.graphUrl;
                w.graphColorField = changedWidget.graphColorField;
                w.graphColorType = changedWidget.graphColorType;
                w.graphData = changedWidget.graphData;
                w.tableBackgroundColor = changedWidget.tableBackgroundColor;
                w.tableColor = changedWidget.tableColor;
                w.tableCols = changedWidget.tableCols;
                w.fontSize  = changedWidget.fontSize;
                w.tableHeight = changedWidget.tableHeight;
                w.tableHideHeader = changedWidget.tableHideHeader;
                w.tableLeft = changedWidget.tableLeft;
                w.tableLineHeight = changedWidget.tableLineHeight;
                w.tableRows = changedWidget.tableRows;
                w.tableTop = changedWidget.tableTop;
                w.tableWidth = changedWidget.tableWidth;
                w.slicerAddRest = changedWidget.slicerAddRest;
                w.slicerAddRestValue = changedWidget.slicerAddRestValue;
                w.slicerBins = changedWidget.slicerBins;
                w.slicerColor = changedWidget.slicerColor;
                w.slicerFieldName = changedWidget.slicerFieldName;
                w.slicerSelection = changedWidget.slicerSelection;
                w.slicerNumberToShow = changedWidget.slicerNumberToShow;
                w.slicerSortField = changedWidget.slicerSortField;
                w.slicerSortFieldOrder = changedWidget.slicerSortFieldOrder;
                w.slicerType = changedWidget.slicerType,
                w.shapeStroke = changedWidget.shapeStroke;
                w.shapeStrokeWidth = changedWidget.shapeStrokeWidth;
                w.shapeSvgHeight = changedWidget.shapeSvgHeight;
                w.shapeSvgWidth = changedWidget.shapeSvgWidth;
                w.shapeFill = changedWidget.shapeFill;
                w.shapeText = changedWidget.shapeText;
                w.shapeTextAlign = changedWidget.shapeTextAlign;
                w.shapeTextColour = changedWidget.shapeTextColour;
                w.shapeValue = changedWidget.shapeValue;
                w.shapeBulletStyleType = changedWidget.shapeBulletStyleType;
                w.shapeBulletsOrdered = changedWidget.shapeBulletsOrdered;
                w.shapeBulletMarginBottom = changedWidget.shapeBulletMarginBottom;
                w.shapeOpacity = changedWidget.shapeOpacity;
                w.shapeRotation = changedWidget.shapeRotation;
                w.shapeSize = changedWidget.shapeSize;
                w.shapeCorner = changedWidget.shapeCorner;
                w.shapeFontSize = changedWidget.shapeFontSize;
                w.shapeFontFamily = changedWidget.shapeFontFamily;
                w.shapeIsBold = changedWidget.shapeIsBold;
                w.shapeIsItalic = changedWidget.shapeIsItalic;
                w.refreshMode = changedWidget.refreshMode;
                w.refreshFrequency = changedWidget.refreshFrequency;
                w.widgetRefreshedOn = changedWidget.widgetRefreshedOn;
                w.widgetRefreshedBy = changedWidget.widgetRefreshedBy;
                w.widgetCreatedOn = changedWidget.widgetCreatedOn;
                w.widgetCreatedBy = changedWidget.widgetCreatedBy;
                w.widgetUpdatedOn = changedWidget.widgetUpdatedOn;
                w.widgetUpdatedBy = changedWidget.widgetUpdatedBy;
            };
        });
        this.currentWidgets.forEach(w => {
            if (w.id == changedWidget.id) {
                // TODO - Make a deep copy / error free, less work copy
                w.widgetType = changedWidget.widgetType;
                w.widgetSubType = changedWidget.widgetSubType;
                w.dashboardID = changedWidget.dashboardID;
                w.dashboardTabID = changedWidget.dashboardTabID;
                w.dashboardTabIDs = changedWidget.dashboardTabIDs;
                w.isLocked = changedWidget.isLocked;
                w.id = changedWidget.id;
                w.originalID = changedWidget.originalID;
                w.name = changedWidget.name;
                w.description = changedWidget.description;
                w.visualGrammar = changedWidget.visualGrammar;
                w.annotationLastUserID = changedWidget.annotationLastUserID;
                w.annotationLastUpdated = changedWidget.annotationLastUpdated;
                w.annotation = changedWidget.annotation;
                w.version = changedWidget.version;
                w.isSelected = changedWidget.isSelected;
                w.isLiked = changedWidget.isLiked;
                w.nrDataQualityIssues = changedWidget.nrDataQualityIssues;
                w.nrComments = changedWidget.nrComments;
                w.showCheckpoints = changedWidget.showCheckpoints;
                w.checkpointIDs = changedWidget.checkpointIDs;
                w.currentCheckpoint = changedWidget.currentCheckpoint;
                w.lastCheckpoint = changedWidget.lastCheckpoint;
                w.hyperlinkDashboardID = changedWidget.hyperlinkDashboardID;
                w.hyperlinkDashboardTabID = changedWidget.hyperlinkDashboardTabID;
                w.datasourceID = changedWidget.datasourceID;
                w.datasetID = changedWidget.datasetID;
                w.data = changedWidget.data;
                w.dataFields = changedWidget.dataFields;
                w.dataFieldTypes = changedWidget.dataFieldTypes;
                w.dataFieldLengths = changedWidget.dataFieldLengths;
                w.dataParameters = changedWidget.dataParameters;
                w.reportID = changedWidget.reportID;
                w.reportName = changedWidget.reportName;
                w.rowLimit = changedWidget.rowLimit;
                w.addRestRow = changedWidget.addRestRow;
                w.size = changedWidget.size;
                w.containerBackgroundcolor = changedWidget.containerBackgroundcolor;
                w.containerBorder = changedWidget.containerBorder;
                w.containerBorderRadius = changedWidget.containerBorderRadius;
                w.containerBoxshadow = changedWidget.containerBoxshadow;
                w.containerFontsize = changedWidget.containerFontsize;
                w.containerHeight = changedWidget.containerHeight;
                w.containerLeft = changedWidget.containerLeft;
                w.containerHasTitle = changedWidget.containerHasTitle;
                w.containerTop = changedWidget.containerTop;
                w.containerWidth = changedWidget.containerWidth;
                w.containerZindex = changedWidget.containerZindex;
                w.titleText = changedWidget.titleText;
                w.titleBackgroundColor = changedWidget.titleBackgroundColor;
                w.titleBorder = changedWidget.titleBorder;
                w.titleColor = changedWidget.titleColor;
                w.titleFontsize = changedWidget.titleFontsize;
                w.titleFontWeight = changedWidget.titleFontWeight;
                w.titleHeight = changedWidget.titleHeight;
                w.titleMargin = changedWidget.titleMargin;
                w.titlePadding = changedWidget.titlePadding;
                w.titleTextAlign = changedWidget.titleTextAlign;
                w.titleWidth = changedWidget.titleWidth;
                w.graphType = changedWidget.graphType;
                w.graphHeight = changedWidget.graphHeight;
                w.graphLeft = changedWidget.graphLeft;
                w.graphTop = changedWidget.graphTop;
                w.graphWidth = changedWidget.graphWidth;
                w.graphGraphPadding = changedWidget.graphGraphPadding;
                w.graphHasSignals = changedWidget.graphHasSignals;
                w.graphFillColor = changedWidget.graphFillColor;
                w.graphHoverColor = changedWidget.graphHoverColor;
                w.graphSpecification = changedWidget.graphSpecification;
                w.graphDescription = changedWidget.graphDescription;
                w.graphXaggregate = changedWidget.graphXaggregate;
                w.graphXtimeUnit = changedWidget.graphXtimeUnit;
                w.graphXfield = changedWidget.graphXfield;
                w.graphXtype = changedWidget.graphXtype;
                w.graphXaxisTitle = changedWidget.graphXaxisTitle;
                w.graphYaggregate = changedWidget.graphYaggregate;
                w.graphYtimeUnit = changedWidget.graphYtimeUnit;
                w.graphYfield = changedWidget.graphYfield;
                w.graphYtype = changedWidget.graphYtype;
                w.graphYaxisTitle = changedWidget.graphYaxisTitle;
                w.graphTitle = changedWidget.graphTitle;
                w.graphMark = changedWidget.graphMark;
                w.graphMarkColor = changedWidget.graphMarkColor;
                w.graphUrl = changedWidget.graphUrl;
                w.graphColorField = changedWidget.graphColorField;
                w.graphColorType = changedWidget.graphColorType;
                w.graphData = changedWidget.graphData;
                w.tableBackgroundColor = changedWidget.tableBackgroundColor;
                w.tableColor = changedWidget.tableColor;
                w.tableCols = changedWidget.tableCols;
                w.fontSize  = changedWidget.fontSize;
                w.tableHeight = changedWidget.tableHeight;
                w.tableHideHeader = changedWidget.tableHideHeader;
                w.tableLeft = changedWidget.tableLeft;
                w.tableLineHeight = changedWidget.tableLineHeight;
                w.tableRows = changedWidget.tableRows;
                w.tableTop = changedWidget.tableTop;
                w.tableWidth = changedWidget.tableWidth;
                w.slicerAddRest = changedWidget.slicerAddRest;
                w.slicerAddRestValue = changedWidget.slicerAddRestValue;
                w.slicerBins = changedWidget.slicerBins;
                w.slicerColor = changedWidget.slicerColor;
                w.slicerFieldName = changedWidget.slicerFieldName;
                w.slicerSelection = changedWidget.slicerSelection;
                w.slicerNumberToShow = changedWidget.slicerNumberToShow;
                w.slicerSortField = changedWidget.slicerSortField;
                w.slicerSortFieldOrder = changedWidget.slicerSortFieldOrder;
                w.slicerType = changedWidget.slicerType,
                w.shapeStroke = changedWidget.shapeStroke;
                w.shapeStrokeWidth = changedWidget.shapeStrokeWidth;
                w.shapeSvgHeight = changedWidget.shapeSvgHeight;
                w.shapeSvgWidth = changedWidget.shapeSvgWidth;
                w.shapeFill = changedWidget.shapeFill;
                w.shapeText = changedWidget.shapeText;
                w.shapeTextAlign = changedWidget.shapeTextAlign;
                w.shapeTextColour = changedWidget.shapeTextColour;
                w.shapeValue = changedWidget.shapeValue;
                w.shapeBulletStyleType = changedWidget.shapeBulletStyleType;
                w.shapeBulletsOrdered = changedWidget.shapeBulletsOrdered;
                w.shapeBulletMarginBottom = changedWidget.shapeBulletMarginBottom;
                w.shapeOpacity = changedWidget.shapeOpacity;
                w.shapeRotation = changedWidget.shapeRotation;
                w.shapeSize = changedWidget.shapeSize;
                w.shapeCorner = changedWidget.shapeCorner;
                w.shapeFontSize = changedWidget.shapeFontSize;
                w.shapeFontFamily = changedWidget.shapeFontFamily;
                w.shapeIsBold = changedWidget.shapeIsBold;
                w.shapeIsItalic = changedWidget.shapeIsItalic;
                w.refreshMode = changedWidget.refreshMode;
                w.refreshFrequency = changedWidget.refreshFrequency;
                w.widgetRefreshedOn = changedWidget.widgetRefreshedOn;
                w.widgetRefreshedBy = changedWidget.widgetRefreshedBy;
                w.widgetCreatedOn = changedWidget.widgetCreatedOn;
                w.widgetCreatedBy = changedWidget.widgetCreatedBy;
                w.widgetUpdatedOn = changedWidget.widgetUpdatedOn;
                w.widgetUpdatedBy = changedWidget.widgetUpdatedBy;
            };
        });
    }

    sleep(milliseconds: number) {
        // Sleep for a while
        console.log('%c    Global-Variables sleep ...',
        "color: black; background: lightgray; font-size: 10px", milliseconds);
        var start: number = new Date().getTime();
        console.log('  start', start, new Date().getTime())
        for (var counter = 0; counter < 3600001; counter++) {
            let mod:number = counter%60000;
            // TODO - remove this console.log BUT at moment sleep increments counter * 60000
            console.log(counter, mod);
            if (mod == 0) {
                console.log ('   Minutes elapsed ', counter, mod )
            }
            if ((new Date().getTime() - start) > milliseconds){
                console.log('  end', start, new Date().getTime())

                break;
            }
        }
    }

    createVegaLiteSpec(
        widget: Widget,
        height: number = 0,
        width: number = 0): dl.spec.TopLevelExtendedSpec {
        // Creates a Vega-Lite spec for a given Widget from a standard template
        // - widget is the W for which the graph is created, and contains all the
        //   required detail
        // - height, width are optional dimensions.  If provided, it will overrule
        //   those values in spec
        console.log('%c    Global-Variables createVegaLiteSpec ...',
        "color: black; background: lightgray; font-size: 10px");

        let vlSpecsNew: dl.spec.TopLevelExtendedSpec = this.vlTemplate;
        if (widget.graphUrl != "") {
            vlSpecsNew['data'] = {"url": widget.graphUrl};
        } else {
            vlSpecsNew['data'] = {"values": widget.graphData};
        }
        vlSpecsNew['description'] = widget.graphDescription;
        vlSpecsNew['mark']['type'] = widget.graphMark;
        vlSpecsNew['mark']['color'] = widget.graphMarkColor;

        vlSpecsNew['encoding']['x']['field'] = widget.graphXfield;
        vlSpecsNew['encoding']['x']['type'] = widget.graphXtype;
        vlSpecsNew['encoding']['x']['axis']['title'] = widget.graphXaxisTitle;
        vlSpecsNew['encoding']['x']['timeUnit'] = widget.graphXtimeUnit;
        vlSpecsNew['encoding']['x']['aggregate'] = widget.graphXaggregate;

        vlSpecsNew['encoding']['y']['field'] = widget.graphYfield;
        vlSpecsNew['encoding']['y']['type'] = widget.graphYtype;
        vlSpecsNew['encoding']['y']['axis']['title'] = widget.graphYaxisTitle;
        vlSpecsNew['encoding']['y']['timeUnit'] = widget.graphYtimeUnit;
        vlSpecsNew['encoding']['y']['aggregate'] = widget.graphYaggregate;

        if (height != 0) {
            vlSpecsNew['height'] = height;
        } else {
            vlSpecsNew['height'] = widget.graphHeight;
        };
        if (width != 0) {
            vlSpecsNew['width'] = width;
        } else {
            vlSpecsNew['width'] = widget.graphWidth;
        };

        vlSpecsNew['title']['text'] = widget.graphTitle;

        vlSpecsNew['encoding']['color']['field'] = widget.graphColorField;
        vlSpecsNew['encoding']['color']['type'] = widget.graphColorType;


        // if (widget.graphColorField != ''  && widget.graphColorField != null) {
        //     vlSpecsNew['encoding']['color'] = {
        //         "field": widget.graphColorField,
        //         "type": widget.graphColorType
        //       }
        // };

        return vlSpecsNew;
    }

    actionUpsert(
        id: number,
        dashboardID: number,
        dashboardTabID: number,
        widgetID: number,
        objectType: string,
        action: string,
        description: string,
        undoID: number,
        redoID: number,
        oldWidget: any,
        newWidget: any,
        logToDB: boolean = true
     ): number {
        let actID: number = 1;
        console.log('%c    Global-Variables actionUpsert ...',
            "color: black; background: lightgray; font-size: 10px", logToDB, oldWidget,newWidget
        );

        // Make snapshot when start changing
        if (this.firstAction) {
            let dashboardIndex: number = this.dashboards.findIndex(
                d => d.id ==
                this.currentDashboardInfo.value.currentDashboardID
            );
            let today = new Date();
            let snapshotName: string = this.dashboards[
                dashboardIndex]
                .name + ' ' + this.formatDate(today);
            let snapshotComment: string = 'Added automated Snapshot before first Action';
            this.newDashboardSnapshot(snapshotName, snapshotComment,'BeforeFirstEdit'
                ).then(res => {
                    this.showStatusBarMessage(
                        {
                            message: 'Added automated Snapshot before first Action',
                            uiArea: 'StatusBar',
                            classfication: 'Info',
                            timeout: 3000,
                            defaultMessage: ''
                        }
                    );

            });

            this.firstAction = false;
        };


        if (id == null) {
            // Add / Update an action to the ActionLog.  It returns id of new/updated record
            // It returns -1 if it failed.
            // NB: id = null => Add, else Update
            // The update replaces any give non-null values

            // TODO - decide if lates / -1 is best choice here
            let act: number[] = [];
            for (var i = 0; i < this.actions.length; i++) {
                act.push(this.actions[i].id)
            };
            if (act.length > 0) {
                actID = Math.max(...act) + 1;
            };

            let today = new Date();
            this.actions.push({
                id: actID,
                dashboardID: dashboardID,
                dashboardTabID: dashboardTabID,
                objectType: objectType,
                action: action,
                description: description,
                undoID: undoID,
                redoID: redoID,
                oldWidget: oldWidget == null? null : Object.assign({}, oldWidget),
                newWidget: newWidget == null? null : Object.assign({}, newWidget),
                createor: this.currentUser.userID,
                created: this.formatDate(today)
            });
        } else {
            this.actions.forEach(ac => {
                if (ac.id == id) {
                    if (action != null) {ac.action = action};
                    if (description != null) {ac.description = description};
                    if (undoID != null) {ac.undoID = undoID};
                    if (redoID != null) {ac.redoID = redoID};
                    if (oldWidget != null) {
                        ac.oldWidget =  Object.assign({}, oldWidget)
                    };
                    if (newWidget != null) {
                        ac.newWidget = Object.assign({}, newWidget)
                    };
                    actID = id;
                };
            });

        };

        // Log to DB
        if (logToDB) {

            // Get Old and New
            let actOldWidget: Object = null;
            let actNewWidget: Object = null;
            let ac: CanvasAction = this.actions.filter(ac => ac.id == actID)[0];
            if (ac != null  &&  ac != undefined) {
                actOldWidget = ac.oldWidget;
                actNewWidget = ac.newWidget;
            };

            // Brief description of diff
            var result: any[] = [];
            if (actOldWidget == null) {
                result.push('Whole new Widget added')
            };
            if (actNewWidget == null) {
                result.push('Widget deleted')
            };
            if (actOldWidget != null  &&  actNewWidget != null) {

                for(var key in actNewWidget) {
                    if (key != 'data'  &&  key != 'graphData') {

                        if(actOldWidget[key] != actNewWidget[key]) {

                            // Add to DB
                            let today = new Date();
                            let newAuditTrail: CanvasAuditTrail ={
                                id: null,
                                dashboardID: this.currentDashboardInfo.value.currentDashboardID,
                                dashboardTabID: this.currentDashboardInfo.value.currentDashboardTabID,
                                widgetID: widgetID,
                                userID: this.currentUser.userID,
                                keyChanged: key,
                                oldValue: actOldWidget[key],
                                newValue: actNewWidget[key],
                                changedOn: this.formatDate(today)
                            }
                            this.addCanvasAuditTrail(newAuditTrail);

                            // Show to Dev
                            result.push(key + ' changed from ' + actOldWidget[key]
                                + ' to ' + actNewWidget[key]);
                        };
                    };
                };
            };

        };

        // Return
        return actID;

    }

    alignToGripPoint(inputValue: number) {
        // This routine recalcs a value to a gridpoint IF snapping is enabled
        console.log('%c    Global-Variables alignToGripPoint ...',
        "color: black; background: lightgray; font-size: 10px", inputValue);

        if (this.canvasSettings.snapToGrid) {
            if ( (inputValue % this.canvasSettings.gridSize) >= (this.canvasSettings.gridSize / 2)) {
                inputValue = inputValue + this.canvasSettings.gridSize - (inputValue % this.canvasSettings.gridSize);
            } else {
                inputValue = inputValue - (inputValue % this.canvasSettings.gridSize);
            }
        };

        // Return the value
        return inputValue;
    }

    showStatusBarMessage(statusBarMessage: StatusBarMessage
        ): void {
        // Shows a message in the right area, ie StatusBar
        console.log('%c    Global-Variables showStatusBarMessage ...',
        "color: black; background: lightgray; font-size: 10px");

        // Pop message in right area
        if (statusBarMessage.uiArea == 'StatusBar') {
            this.statusBarMessage.next(statusBarMessage);
        };
    }

    createDatagridColumns(
        dataRow: any,
        showFields: string[] = [],
        visibleFields: string[] = []
        ): DatagridColumn[] {
        // It will return an array of datagridColumns to use in the ca-datagrid
        // for a given array of data and a set of columns to show,
        console.log('%c    Global-Variables createDatagridColumns ...',
        "color: black; background: lightgray; font-size: 10px");

        // No data provided
        if (dataRow == null  ||  dataRow == undefined) {
            return [];
        };

        // Start, assuming nothing to return
        let datagridColumns: DatagridColumn[] = [];
        let columns: string[] = [];

        // Get cols from the data
        columns = Object.keys(dataRow)

        // Make All visible if nothing was given
        if (visibleFields.length == 0) {
            visibleFields = columns;
        };

        // Select All fields if nothing was given
        if (showFields.length == 0) {
            showFields = columns;
        };

        // Loop on the cols, and create an object for each in the datagridColumns array
        showFields.forEach( sf => {
            for (var i = 0; i < columns.length; i++) {

                // Include it field has to be shown
                if (sf == columns[i]) {
                    datagridColumns.push(
                    {
                        id: i,
                        displayName: columns[i],
                        fieldName: columns[i],
                        databaseDBTableName: '',
                        databaseDBFieldName: '',
                        tooltip: '',
                        datatype: 'string',
                        prefix: '',
                        divideBy: 0,
                        displayLength: 12,
                        maxLength: 0,
                        sortOrder: '',
                        filter: '',
                        backgroundColor: '',
                        color: '',
                        conditionalFormatColor: '',
                        nrDataQualityIssues: 0,
                        maxValue: 0,
                        minValue: 0,
                        average: 0,
                        linkedDashboardID: 0,
                        linkedDashboardTabID: 0,
                        isFrozen: false,
                        datagridColumnHidden:
                            visibleFields.indexOf(columns[i])
                            < 0 ? {hidden: true} :  {hidden: false}
                    });
                };
            };
        });

        return datagridColumns;

    }

    dashboardPermissionCheck(id: number, accessRequired: string = 'CanViewOrCanEdit'): boolean {
        // Checks if the current user has access to the given D.
        // - accessRequired = type of access requested.  Can be basic (CanView, CanEdit,
        //   etc), or composite : string = CanViewOrCanEdit, CanViewAndCanEdit,
        //   CanEditOrCanDelete, CanEditAndCanDelete.  These are Hard-Coded
        //   It is NOT case sensitive, and only applicable to accessType = 'AccessList'

        console.log('%c    Global-Variables dashboardPermissionCheck ...',
        "color: black; background: lightgray; font-size: 10px", id);

        // Assume no access
        let hasAccess: boolean = false;
        accessRequired = accessRequired.toLowerCase();

        // Format user
        let userID = this.currentUser.userID;

        let dashboard: Dashboard;
        this.dashboards.forEach(d => {
            if (d.id == id) {
                dashboard = Object.assign({}, d);
            };
        });

        // Make sure we have a D
        if (dashboard == undefined) {
            return;
        };

        // Everyone has access to Public Ds
        if (dashboard.accessType.toLowerCase() == 'public') {
            hasAccess = true;
        };

        // The owner has access to Private ones
        if (dashboard.accessType.toLowerCase() == 'private'
            &&
            dashboard.creator.toLowerCase() == userID.toLowerCase()) {
                hasAccess = true;
        };
        if (dashboard.accessType.toLowerCase() == 'accesslist') {
            this.dashboardPermissions.forEach(dp => {
                if (dp.dashboardID == dashboard.id) {
                    if (dp.userID != null) {
                        if (dp.userID.toLowerCase() == userID.toLowerCase()) {
                            if (accessRequired == 'canviewright'  &&  dp.canViewRight) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'caneditright'  &&  dp.canEditRight) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'candsaveright'  &&  dp.canSaveRight) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'candeleteright'  &&  dp.canDeleteRight) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'canadddatasource'  &&  dp.canAddDatasource) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'cangrantaccess'  &&  dp.canGrantAccess) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'canvieworcanedit'  &&  (dp.canViewRight  ||  dp.canEditRight) ) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'canviewandcanedit'  &&  (dp.canViewRight  &&  dp.canEditRight) ) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'caneditorcandelete'  &&  (dp.canEditRight  ||  dp.canDeleteRight) ) {
                                hasAccess = true;
                            };
                            if (accessRequired == 'caneditandcandelete'  &&  (dp.canEditRight  &&  dp.canDeleteRight) ) {
                                hasAccess = true;
                            };
                        };
                    };
                    if (dp.groupName != null) {
                        if (this.currentUser.groups.
                            map(x => x.toLowerCase()).indexOf(dp.groupName.toLowerCase()) >= 0) {
                                if (dp.canViewRight  ||  dp.canEditRight) {
                                    hasAccess = true;
                                };
                        };
                    };
                };
            });
        };

        // Return
        return hasAccess;
    }

    dashboardPermissionList(id: number): string[] {
        // Returns Array of Permissions for the current user to the given D.
        console.log('%c    Global-Variables dashboardPermissionCheck ...',
        "color: black; background: lightgray; font-size: 10px", id);

        // Assume no access
        let accessList: string[] = [];

        // Format user
        let userID = this.currentUser.userID;

        let dashboard: Dashboard;
        this.dashboards.forEach(d => {
            if (d.id == id) {
                dashboard = Object.assign({}, d);
            };
        });

        // Make sure we have a D
        if (dashboard == undefined) {
            return accessList;
        };

        // Everyone has access to Public Ds
        if (dashboard.accessType.toLowerCase() == 'public') {
            accessList = ['canviewright' ,'caneditright' ,
            'cansaveright', 'candeleteright', 'canadddatasource', 'cangrantaccess'];
        };

        // The owner has access to Private ones
        if (dashboard.accessType.toLowerCase() == 'private'
            &&
            dashboard.creator.toLowerCase() == userID.toLowerCase()) {
                accessList = ['canviewright' ,'caneditright' ,
                'cansaveright', 'candeleteright', 'canadddatasource', 'cangrantaccess'];
        };

        if (dashboard.accessType.toLowerCase() == 'accesslist') {
            this.dashboardPermissions.forEach(dp => {
                if (dp.dashboardID == dashboard.id) {
                    if (dp.userID != null) {
                        if (dp.userID.toLowerCase() == userID.toLowerCase()) {
                            if (dp.canViewRight) {
                                accessList.push('canviewright');
                            };
                            if (dp.canEditRight) {
                                accessList.push('caneditright');
                            };
                            if (dp.canSaveRight) {
                                accessList.push('candsaveright');
                            };
                            if (dp.canDeleteRight) {
                                accessList.push('candeleteright');
                            };
                            if (dp.canAddDatasource) {
                                accessList.push('canadddatasource');
                            };
                            if (dp.canGrantAccess) {
                                accessList.push('cangrantaccess');
                            };
                        };
                    };
                    if (dp.groupName != null) {
                        if (this.currentUser.groups.
                            map(x => x.toLowerCase()).indexOf(dp.groupName.toLowerCase()) >= 0) {
                                if (dp.canViewRight) {
                                    accessList.push('canViewright');
                                };
                                if (dp.canEditRight) {
                                    accessList.push('canEditright');
                                };
                                if (dp.canSaveRight) {
                                    accessList.push('candsaveright');
                                };
                                if (dp.canDeleteRight) {
                                    accessList.push('canDeleteright');
                                };
                                if (dp.canAddDatasource) {
                                    accessList.push('canadddatasource');
                                };
                                if (dp.canGrantAccess) {
                                    accessList.push('cangrantaccess');
                                };
                        };
                    };
                };
            });
        };

        // Return
        return accessList;
    }

    formatDate(date) {
         // Formats a given date into YYYY/MM/DD HH:MM:SS
         console.log('%c    Global-Variables formatDate ...',
         "color: black; background: lightgray; font-size: 10px", date);

         let d = new Date(date);
         let month = '' + (d.getMonth() + 1);
         let day = '' + d.getDate();
         let year = d.getFullYear();
         let hour = d.getHours();
         let minute = d.getMinutes();
         let second = d.getSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('/') + ' ' + hour + ':' + minute + ':' + second;
    }

    // Eazl, Tributary stuffies
    // TODO - to be replaced by actual Eazl 
    login(username: string, password: string): Promise<boolean> {
        // Login, and return a token which is stored in LocalStorage.  Also, set global User
        // If not a valid user, return false.
        // If so, set currentUser object and return true
        console.log('%c    Global-Variables login ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px");
        
        return new Promise<boolean>((resolve, reject) => {

            // Get a Token
            this.http.post<Token>('https://eazl-rest.xyz/eazl/accounts/obtain-token/', 
                {username, password}).subscribe(token => {

                // Store locally
                localStorage.setItem("eazl-token", JSON.stringify(token));

                resolve(true);
            },
            err => {
                console.log('Error login FAILED', err);;
                resolve(false);
            });
        });
    };
    
    getTributaryData(source: any): Promise<any> {
        // Description: Gets data from the Tributary Server
        // Returns: Added Data or error message
        console.log('%c    Global-Variables getTributaryData ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", source);

        let url: string = 'https://eazl-rest.xyz/eazl/canvas/enqueue/';
        this.filePath = './assets/data.dashboards.json';

        return new Promise<any>((resolve, reject) => {

            let localToken: Token = JSON.parse(localStorage.getItem('eazl-token'));
            console.warn('xx token', localToken)
            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Authorization", "JWT " + localToken.token);

            this.http.post(url, source, {headers})
            .subscribe(
                res => {

                    console.log('Tributary Data', res)

                    resolve(res);
                },
                err => {
                    console.log('Error Get Tributary Data FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getTributaryDirectDBSchema(serverName: string): DataSchema[] {
        // Description: Returns schema of a given DB via Tributary Server
        // Returns: Added Data or error message
        console.log('%c    Global-Variables getTributaryDirectDBSchema ...',
        "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px", serverName);
        
        // TODO - Remove once Tributary can do discovery
        let tributarySchemas: DataSchema[] = [
            {
                serverName: 'pellefant.db.elephantsql.com',
                tableName: 'Accounts',
                tableDescription: '',
                tableFields: [
                    {
                        fieldName: 'id',
                        fieldType: 'any'
                    },
                    {
                        fieldName: 'AccountCode',
                        fieldType: 'any'
                    },
                    {
                        fieldName: 'AcctDescription',
                        fieldType: 'any'
                    }
                ]
            },
            {
                serverName: 'pellefant.db.elephantsql.com',
                tableName: 'Invoices',
                tableDescription: '',
                tableFields: [
                    {
                        fieldName: 'id',
                        fieldType: 'any'
                    },
                    {
                        fieldName: 'InvoiceDate',
                        fieldType: 'any'
                    },
                    {
                        fieldName: 'Total',
                        fieldType: 'any'
                    }
                ]
            },
        ];

        let tributarySchema: DataSchema[] = tributarySchemas.filter(
            trib => trib.serverName == serverName
        );
        
        // Return requested schema
        return tributarySchema;
    }


}