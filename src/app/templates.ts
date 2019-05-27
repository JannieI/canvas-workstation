// List of templates used in the code

import { CanvasSettings }             from './models';
import { Dashboard }                  from './models';
import { DashboardTab }               from './models';
import { Datasource }                 from './models';
import { Transformation }             from './models';
import { TributaryServerType }        from './models';
import { Widget }                     from './models';
import * as dl                        from 'datalib';

let today: Date = new Date();

export const vlTemplate: dl.spec.TopLevelExtendedSpec =
    {
        "$schema": "https://vega.github.io/schema/vega-lite/v3.json",

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

export const datasourceTemplate: Datasource =
    {
        id: null,
        type: 'Server',
        subType: '',
        typeVersion: '',
        name: '',
        username: '',
        password: '',
        description: '',
        createdBy: '',
        createdOn: today,
        createMethod: '',
        editor: '',
        dateEdited: null,
        refreshedBy: '',
        refreshedServerOn: null,
        dataFields: [''],
        dataFieldTypes: [''],
        dataFieldLengths: [0],
        datasourceFilters: [],
        accessType: '',
        cacheResultsOnServer: true,
        serverExpiryDateTime: null,
        unRefreshable: true,
        cacheResultsLocal: false,
        oldnessMaxPeriodInterval: '',
        oldnessMaxPeriodUnits: 0,
        oldnessRelatedDate: '',
        oldnessRelatedTime: '',
        refreshedLocalOn: null,
        folder: '',
        fileName: '',
        excelWorksheet: '',
        transposeOnLoad: false,
        startLineNr: 0,
        csvSeparationCharacter: '',
        csvQuotCharacter: '',
        webUrl: '',
        webTableIndex: '',
        connectionID: 0,
        dataTableID: 0,
        nrWidgets: 0,
        databaseName: '',
        port: '',
        serverType: '',
        serverName: '',
        dataTableName: '',
        dataSQLStatement: '',
        dataNoSQLStatement: '',
        dataNeo4jStatement: '',
        dataGraphQLStatement: '',
        businessGlossary: '',
        dataDictionary: '',
        datasourceCombinationSpec: null,
        isNetworkShape: false,
        subDatasources: [],
        rowLimitFromSource: 0,
        timeoutLimitSeconds: 0,
        endLineNr: 0,
        startColumnNr: 1,
        endColumnNr: 0,
        encoding: '',
        serviceUrl: '',
        serviceParams: '',
        serviceQueryParams: '',
        serviceHeaders: '',
        sourceIsAccessable: true,
        queryParameters: '',
        metaDataFields: [],
        transformations: [],
        dataErrorMessage: '',
        nrRecordsReturned: 0,
        sourceLocation: '',
        dataFull: [],
        dataFiltered: []
    };

export const widgetTemplateInner: any = 
    {

        // Mark
        "graphMark": "",
        "graphMarkOrient": "",
        "graphMarkLine": false,
        "graphMarkPoint": false,
        "graphMarkPointColorName": "",
        "graphMarkPointColor": "",
        "graphMarkColourName": "",
        "graphMarkColour": "",
        "graphMarkCornerRadius": 0,
        "graphMarkExtent": "",
        "graphMarkOpacity": 1,
        "graphMarkBinSpacing": 0,
        "graphMarkSize": "",
        "graphMarkInterpolate": "",

        // X
        "graphXfield": "",
        "graphXaggregateName": "",
        "graphXaggregate": "",
        "graphXtimeUnit": "",
        "graphXbin": false,
        "graphXMaxBins": 0,
        "graphXformat": "",
        "graphXimpute": "",
        "graphXimputeValue": "",
        "graphXstack": "",
        "graphXsort": "",
        "graphXtype": "",
        "graphXtypeName": "",

        // Y
        "graphYfield": "",
        "graphYaggregateName": "",
        "graphYaggregate": "",
        "graphYbin": false,
        "graphYMaxBins": 0,
        "graphYformat": "",
        "graphYimpute": "",
        "graphYimputeValue": 0,
        "graphYstack": "",
        "graphYsort": "",
        "graphYtimeUnit": "",
        "graphYtype": "",
        "graphYtypeName": "",

        // Color
        "graphColorField": "",
        "graphColorAggregateName": "",
        "graphColorAggregate": "",
        "graphColorBin": false,
        "graphColorMaxBins": 0,
        "graphColorFormat": "",
        "graphColorImpute": "",
        "graphColorImputeValue": "",
        "graphColorScheme": "blues",
        "graphColorSort": "",
        "graphColorStack": "",
        "graphColorType": "",
        "graphColorTypeName": "",
        "graphColorTimeUnit": "",

        // X Axis
        "graphXaxisFormat": "",
        "graphXaxisGrid": true,
        "graphXaxisGridColorName": "",
        "graphXaxisGridColor": "",
        "graphXaxisLabels": true,
        "graphXaxisLabelAngle": 0,
        "graphXaxisLabelColorName": "",
        "graphXaxisLabelsLength": 0,
        "graphXaxisLabelColor": "",
        "graphXaxisTitle": "",
        "graphXaxisTitleCheckbox": true,
        "graphXaxisScaleType": "",

        // Y Axis
        "graphYaxisFormat": "",
        "graphYaxisGrid": true,
        "graphYaxisGridColorName": "",
        "graphYaxisGridColor": "",
        "graphYaxisLabels": true,
        "graphYaxisLabelAngle": 0,
        "graphYaxisLabelColorName": "",
        "graphYaxisLabelColor": "",
        "graphYaxisScaleType": "",
        "graphYaxisTitle": "",
        "graphYaxisTitleCheckbox": true,

        // Legend
        "graphLegendAxisScaleType": "",
        "graphLegendHide": false,
        "graphLegendTitleCheckbox": true,
        "graphLegendTitle": "",
        "graphLegendFormat": "",
        "graphLegendLabels": true,
        "graphLegendLabelColorName": "",
        "graphLegendLabelColor": "",

        // Size
        "graphSizeField": "",
        "graphSizeType": "",
        "graphSizeTypeName": "",
        "graphSizeAggregateName": "",
        "graphSizeAggregate": "",
        "graphSizeBin": false,
        "graphSizeMaxBins": 0,

        // Row
        "graphRowField": "",
        "graphRowType": "",
        "graphRowTypeName": "",

        // Column
        "graphColumnField": "",
        "graphColumnType": "",
        "graphColumnTypeName": "",

        // Detail
        "graphDetailField": "",
        "graphDetailType": "",
        "graphDetailTypeName": "",

        // X2
        "graphX2Field": "",
        "graphX2Type": "",
        "graphX2TypeName": "",
        "graphX2AggregateName": "",

        // Y2
        "graphY2Field": "",
        "graphY2Type": "",
        "graphY2TypeName": "",
        "graphY2AggregateName": "",

        // Projection
        "graphProjectionType": "",
        "graphProjectionFieldLatitude": "",
        "graphProjectionFieldLongitude": ""
    }; 

export const widgetTemplate: Widget =
    {
        "widgetType": "",
        "widgetSubType": "",
        "isLocked": false,
        "dashboardID": null,
        "dashboardTabID": null,
        "id": null,
        "originalID": null,
        "name": "New Widget",
        "description": "New Widget from Template",
        "annotation": '',
        "annotationLastUserID": "",
        "annotationLastUpdated": null,
        "visualGrammar": "Vega-Lite",
        "visualGrammarType": 'standard',
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
        "containerStyleID": null,

        "datasourceID": null,
        "dataFields": null,
        "dataFieldTypes": null,
        "dataFieldLengths": null,
        "dataschema": null,
        "dataParameters": [],
        "reportID": null,
        "reportName": "",
        "rowLimit": null,
        "addRestRow": false,
        "size": "",

        "containerBackgroundcolor": "transparent",
        "containerBackgroundcolorName": "transparent",
        "containerBorder": "1px solid gray",
        "containerBorderColour": "gray",
        "containerBorderColourName" : "1px solid gray",
        "containerBorderRadius": "6px",
        "containerBoxshadow": "none",
        "containerFontsize": 12,
        "containerHeight": 320,
        "containerLeft": 10,
        "containerHasContextMenus": false,
        "containerHasTitle": false,
        "containerTop": 80,
        "containerWidth": 410,
        "containerZindex": 51,      // So that Widget->Back has an effect

        "graphLayerFacet": "Single",
        "graphLayers": [
            {
                // Optional Specification, used for Custom graphTypes
                "graphSpecification": null,

                // Mark
                "graphMark": "",
                "graphMarkOrient": "",
                "graphMarkLine": false,
                "graphMarkPoint": false,
                "graphMarkPointColorName": "",
                "graphMarkPointColor": "",
                "graphMarkColourName": "",
                "graphMarkColour": "",
                "graphMarkCornerRadius": 0,
                "graphMarkExtent": "",
                "graphMarkOpacity": 1,
                "graphMarkBinSpacing": 0,
                "graphMarkSize": 20,
                "graphMarkInterpolate": "",

                // X
                "graphXfield": "",
                "graphXaggregateName": "",
                "graphXaggregate": "",
                "graphXtimeUnit": "",
                "graphXbin": false,
                "graphXMaxBins": 0,
                "graphXformat": "",
                "graphXimpute": "",
                "graphXimputeValue": 0,
                "graphXstack": "",
                "graphXsort": "",
                "graphXtype": "",
                "graphXtypeName": "",

                // Y
                "graphYfield": "",
                "graphYaggregateName": "",
                "graphYaggregate": "",
                "graphYbin": false,
                "graphYMaxBins": 0,
                "graphYformat": "",
                "graphYimpute": "",
                "graphYimputeValue": 0,
                "graphYstack": "",
                "graphYsort": "",
                "graphYtimeUnit": "",
                "graphYtype": "",
                "graphYtypeName": "",

                // Color
                "graphColorField": "",
                "graphColorAggregateName": "",
                "graphColorAggregate": "",
                "graphColorBin": false,
                "graphColorMaxBins": 0,
                "graphColorFormat": "",
                "graphColorImpute": "",
                "graphColorImputeValue": 0,
                "graphColorScheme": "blues",
                "graphColorSort": "",
                "graphColorStack": "",
                "graphColorType": "",
                "graphColorTypeName": "",
                "graphColorTimeUnit": "",

                // X Axis
                "graphXaxisFormat": "",
                "graphXaxisGrid": true,
                "graphXaxisGridColorName": "",
                "graphXaxisGridColor": "",
                "graphXaxisLabels": true,
                "graphXaxisLabelAngle": 0,
                "graphXaxisLabelColorName": "",
                "graphXaxisLabelsLength": 0,
                "graphXaxisLabelColor": "",
                "graphXaxisScaleType": "",
                "graphXaxisScaleDomainStart": "",
                "graphXaxisScaleDomainEnd": "",
                "graphXaxisTitle": "",
                "graphXaxisTitleCheckbox": true,

                // Y Axis
                "graphYaxisFormat": "",
                "graphYaxisGrid": true,
                "graphYaxisGridColorName": "",
                "graphYaxisGridColor": "",
                "graphYaxisLabels": true,
                "graphYaxisLabelAngle": 0,
                "graphYaxisLabelColorName": "",
                "graphYaxisLabelColor": "",
                "graphYaxisLabelsLength": 0,
                "graphYaxisScaleType": "",
                "graphYaxisScaleDomainStart": "",
                "graphYaxisScaleDomainEnd": "",
                "graphYaxisTitle": "",
                "graphYaxisTitleCheckbox": true,

                // Legend
                "graphLegendAxisScaleType": "",
                "graphLegendHide": false,
                "graphLegendTitleCheckbox": true,
                "graphLegendTitle": "",
                "graphLegendFormat": "",
                "graphLegendLabels": true,
                "graphLegendLabelColorName": "",
                "graphLegendLabelColor": "",
                "graphLegendLabelsLength" : 0,

                // Size
                "graphSizeField": "",
                "graphSizeType": "",
                "graphSizeTypeName": "",
                "graphSizeAggregateName": "",
                "graphSizeAggregate": "",
                "graphSizeBin": false,
                "graphSizeMaxBins": 0,

                // Row
                "graphRowField": "",
                "graphRowType": "",
                "graphRowTypeName": "",
                "graphRowTitleCheckbox" : true,
                "graphRowTitle" : "",

                // Column
                "graphColumnField": "",
                "graphColumnType": "",
                "graphColumnTypeName": "",
                "graphColumnTitleCheckbox" : true,
                "graphColumnTitle" : "",

                // Detail
                "graphDetailField": "",
                "graphDetailType": "",
                "graphDetailTypeName": "",

                // X2
                "graphX2Field": "",
                "graphX2Type": "",
                "graphX2TypeName": "",
                "graphX2AggregateName": "",

                // Y2
                "graphY2Field": "",
                "graphY2Type": "",
                "graphY2TypeName": "",
                "graphY2AggregateName": "",

                // Projection
                "graphProjectionType": "",
                "graphProjectionFieldLatitude": "",
                "graphProjectionFieldLongitude": "",

                // Condition
                "conditionColourName": "",
                "conditionColour": "",
                "conditionFieldName": "",
                "conditionOperator": "",
                "conditionValue": "",
                "conditionValueFrom": "",
                "conditionValueTo": "",
            }
        ],

        "graphUrl": "",
        "dataFiltered": "",

        "graphTitleText": "",
        "graphTitleAnchor": "Middle",
        "graphTitleAngle": 0,
        "graphBackgroundColorName": "transparent",
        "graphBackgroundColor": "transparent",
        "graphBorderColorName": "lightgray",
        "graphBorderColor": "lightgray",

        "graphTitleBaseline": "Bottom",
        "graphTitleColorName": "Gray",
        "graphTitleColor": "Gray",
        "graphTitleFont": "",
        "graphTitleFontSize": 10,
        "graphTitleFontWeight": 400,
        "graphTitleLength": 0,
        "graphTitleOrientation": "Top",

        "graphTransformations": [{
            "id": 0,
            "sequence": 0,
            "transformationType": ""
        }],
        "graphCalculations": [],
        "widgetFilters": [],
        "sampleNumberRows": 0,

        "titleText": "Title of new Widget",
        "titleBackgroundColor": "lightgray",
        "titleBackgroundColorName": "lightgray",
        "titleBorder": "",
        "titleBorderName": "",
        "titleColor": "black",
        "titleColorName": "black",
        "titleFontsize": 12,
        "titleFontWeight": "",
        "titleHeight": 24,
        "titleMargin": "0",
        "titlePadding": "0 0 0 5px",
        "titleTextAlign": "center",
        "titleWidth": 100,
        "graphHeight": 240,
        "graphLeft": 1,
        "graphTop": 1,
        "graphWidth": 240,
        "graphDimensionRight": 140,
        "graphDimensionLeft": 80,
        "graphDimensionBottom": 70,
        "graphGraphPadding": 1,
        "graphHasSignals": false,
        "graphFillColor": "",
        "graphHoverColor": "",
        "graphPanAndZoom": false,
        "graphDescription": "",
        "tableBackgroundColor" : "",
        "tableBackgroundColorName" : "",
        "tableColor": "",
        "tableColorName": "",
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
        "shapeFillName": "",
        "shapeFontSize": 24,
        "shapeLineHeight": "normal",
        "shapeLineLength": 66,
        "shapePath": "",
        "shapeFontFamily": "",
        "shapeImageUrl": "",
        "shapeIsBold": true,
        "shapeIsItalic": false,
        "shapeOpacity": 1,
        "shapeRotation": 0,
        "shapeSize": 1,
        "shapeStroke": "",
        "shapeStrokeName": "",
        "shapeStrokeWidth": "",
        "shapeSvgHeight": 30,
        "shapeSvgWidth": 30,
        "shapeText": "",
        "shapeTextDisplay": "",
        "shapeTextAlign": 'Left',
        "shapeTextColour": "",
        "shapeTextColourName": "",
        "shapeValue": "",
        "navigatorNetworkID": null,
        "navigatorSelectParentNodeType": "",
        "navigatorSelectParentNodeName": "",
        "navigatorSelectRelationship": "",
        "navigatorSelectView": "",
        "refreshMode": "",
        "refreshFrequency": 1,
        "widgetRefreshedOn": "",
        "widgetRefreshedBy": "",
        "widgetCreatedOn": null,
        "widgetCreatedBy": "",
        "widgetUpdatedOn": null,
        "widgetUpdatedBy": ""
    };

export const widgetNavigatorVegaSpecification: any =
    {
        "_schema" : "https://vega.github.io/schema/vega/v5.json",
        "width" : 380,
        "height" : 380,
        "padding" : 5,
        "data" : [ 
            {
                "name" : "tree",
                "values" : [],
                "transform" : [ 
                    {
                        "type" : "stratify",
                        "key" : "id",
                        "parentKey" : "parent"
                    }, 
                    {
                        "type" : "tree",
                        "method" : "tidy",
                        "size" : [ 
                            {
                                "signal" : "height"
                            }, 
                            {
                                "signal" : "width - 100"
                            }
                        ],
                        "as" : [ 
                            "y", 
                            "x", 
                            "depth", 
                            "children"
                        ]
                    }
                ]
            }, 
            {
                "name" : "links",
                "source" : "tree",
                "transform" : [ 
                    {
                        "type" : "treelinks"
                    }, 
                    {
                        "type" : "linkpath",
                        "orient" : "horizontal",
                        "shape" : "diagonal"
                    }
                ]
            }
        ],
        "scales" : [ 
            {
                "name" : "color",
                "type" : "linear",
                "range" : {
                    "scheme" : "magma"
                },
                "domain" : {
                    "data" : "tree",
                    "field" : "depth"
                },
                "zero" : true
            }
        ],
        "marks" : [ 
            {
                "type" : "path",
                "from" : {
                    "data" : "links"
                },
                "encode" : {
                    "enter" : {
                        "tooltip" : {
                            "signal" : "{'Rate': '0.1%'}"
                        }
                    },
                    "update" : {
                        "path" : {
                            "field" : "path"
                        },
                        "stroke" : {
                            "value" : "#ccc"
                        }
                    }
                }
            }, 
            {
                "type" : "symbol",
                "from" : {
                    "data" : "tree"
                },
                "encode" : {
                    "enter" : {
                        "size" : {
                            "value" : 100
                        },
                        "stroke" : {
                            "value" : "#fff"
                        }
                    },
                    "update" : {
                        "x" : {
                            "field" : "x"
                        },
                        "y" : {
                            "field" : "y"
                        },
                        "fill" : {
                            "scale" : "color",
                            "field" : "depth"
                        }
                    }
                }
            }, 
            {
                "type" : "text",
                "from" : {
                    "data" : "tree"
                },
                "encode" : {
                    "enter" : {
                        "text" : {
                            "field" : "name"
                        },
                        "fontSize" : {
                            "value" : 9
                        },
                        "baseline" : {
                            "value" : "middle"
                        }
                    },
                    "update" : {
                        "x" : {
                            "field" : "x"
                        },
                        "y" : {
                            "field" : "y"
                        },
                        "dx" : {
                            "signal" : "datum.children ? -7 : 7"
                        },
                        "align" : {
                            "signal" : "datum.children ? 'right' : 'left'"
                        },
                        "opacity" : {
                            "signal" : 1
                        }
                    }
                }
            }
        ],
        "description" : "",
        "title" : "Navigator"
}

export const dashboardTemplate: Dashboard =
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
        backgroundColorName: '',
        backgroundImage: '',
        templateDashboardID: 0,
        creator: '',
        dateCreated: null,
        editor: '',
        dateEdited: null,
        refresher: '',
        dateRefreshed: null,
        nrWidgets: 0,
        nrShapes: 0,
        nrRecords: 0,
        nrTimesOpened: 0,
        nrTimesChanged: 0,
        tabs: [],
        permissions: [],

        // Special info
        userCanViewList: [],
        userCanEditList: [],
        userCanDeleteList: [],
        userCanRefreshList: [],
        userCanGrantList: [],
        groupCanViewList: [],
        groupCanEditList: [],
        groupCanDeleteList: [],
        groupCanRefreshList: [],
        groupCanGrantList: []

    };

export const dashboardTabTemplate: DashboardTab =
    {
        id: null,
        originalID: null,
        dashboardID: 0,
        name: 'First',
        description: '',
        displayOrder: 0,            // Note: this must start at 0
        backgroundColor: '',
        backgroundColorName: '',
        color: '',
        colorName: '',
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null
    };

// export const transformationsFormat: Transformation[] =
// [
//     {
//         id: 1,
//         category: 'Column-level',
//         name: 'FormatDate',
//         description: '(columnName, new-date-format, old-date-format): if the columnName is blank, Tributary will try to convert all date fields.  The format can be YYYYMMDD, MMMMM, M/D/Y, etc.',
//         nrParameters: 6,
//         parameterPlaceholder: ['place1','place2','place3','place4','place5','place6'],
//         parameterTitle: ['tit1','tit2','tit3','tit4','tit5','tit6'],
//         parameterDefaultValue: ['txt1','txt2','txt3','txt4','txt5','txt6'],
//         parameterHeading: ['head1','head2','head3','head4','head5','head6'],
//         parameterType: ['','','','','',''],
//         editedBy: '',
//         editedOn: null,
//         createdBy: '',
//         createdOn: null
//     },
//     {
//         id: 16,
//         category: 'Column-level',
//         name: 'DatePart',
//         description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second',
//         nrParameters: 1,
//         parameterPlaceholder: ['place1'],
//         parameterTitle: ['tit1'],
//         parameterDefaultValue: ['txt1'],
//         parameterHeading: ['head1'],
//         parameterType: ['','','','','',''],
//         editedBy: '',
//         editedOn: null,
//         createdBy: '',
//         createdOn: null
//     },
//     {
//         id: 20,
//         category: 'Column-level',
//         name: 'FormatNumber',
//         description: '(columnName, formatString) where formatString is a valid string in Excel (VBA) format.  For example, ‘#0.00’, R#0,00’, ‘0000’',
//         nrParameters: 1,
//         parameterPlaceholder: ['place1'],
//         parameterTitle: ['tit1'],
//         parameterDefaultValue: ['txt1'],
//         parameterHeading: ['head1'],
//         parameterType: ['','','','','',''],
//         editedBy: '',
//         editedOn: null,
//         createdBy: '',
//         createdOn: null
//     }
// ];

export const finalFields =
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

export const serverTypes: TributaryServerType[] =
    [
        {
            serverType: 'MySQL',
            driverName: 'mysql',
            inspector: 'tributary.inspectors.sql:SqlInspector',
            connector: 'tributary.connectors.sql:SqlConnector',
            editedBy: '',
            editedOn: null,
            createdBy: '',
            createdOn: null

        },
        {
            serverType: 'PostgresSQL',
            driverName: 'postgresql',
            inspector: 'tributary.inspectors.sql:SqlInspector',
            connector: 'tributary.connectors.sql:SqlConnector',
            editedBy: '',
            editedOn: null,
            createdBy: '',
            createdOn: null

        },
        {
            serverType:'MicrosoftSQL',
            driverName: 'mssql',    // "mssql+pyodbc", "mssql+pymssql"
            inspector: 'tributary.inspectors.sql:SqlInspector',
            connector: 'tributary.connectors.sql:SqlConnector',
            editedBy: '',
            editedOn: null,
            createdBy: '',
            createdOn: null

        },
        {
            serverType:'SQLite',
            driverName: 'sqlite',
            inspector: 'tributary.inspectors.sql:SqlInspector',
            connector: 'tributary.connectors.sql:SqlConnector',
            editedBy: '',
            editedOn: null,
            createdBy: '',
            createdOn: null

        },
        {
            serverType:'Oracle',
            driverName: 'oracle',
            inspector: 'tributary.inspectors.sql:SqlInspector',
            connector: 'tributary.connectors.sql:SqlConnector',
            editedBy: '',
            editedOn: null,
            createdBy: '',
            createdOn: null

        },
        {
            serverType:'Mongo',
            driverName: 'mongo',
            inspector: 'tributary.inspectors.mongodb:MongoDBInspector',
            connector: 'tributary.connectors.mongodb:MongoDBConnector',
            editedBy: '',
            editedOn: null,
            createdBy: '',
            createdOn: null
        },
        {
            serverType:'MicrosoftSSAS',
            driverName: 'Microsoft SSAS',
            inspector: 'tributary.inspectors...',
            connector: 'tributary.connectors...',
            editedBy: '',
            editedOn: null,
            createdBy: '',
            createdOn: null
        }
    ];

export const canvasSettings: CanvasSettings = 
    {
        id: 1,
        companyName: '',
        companyLogo: '',
        dashboardTemplate: '',
        maxTableLength: 500,
        widgetsMinZindex: 50,
        widgetsMaxZindex: 59,
        gridSize: 3,
        printDefault: '',
        printSize: '',
        printLayout: '',
        notInEditModeMsg: 'Not in Edit Mode (see Edit menu Option)',
        noQueryRunningMessage: 'No Query',
        queryRunningMessage: 'Query running...',
        cleanCacheOnLogin: false,
        cleanCacheOnLogout: false,
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null

    };

export const timeUnits: string[] = 
    [
        "",
        "Date",
        "Day",
        "Hours",
        "HoursMinutes",
        "HoursMinutesSeconds",
        "Milliseconds",
        "Minutes",
        "MinutesSeconds",
        "Month",
        "MonthDate",
        "Quarter",
        "QuarterMonth",
        "Seconds",
        "SecondsMilliseconds",
        "Year",
        "YearMonth",
        "YearMonthDate",
        "YearMonthDateHours",
        "YearMonthDateHoursMinutes",
        "YearMonthDateHoursMinutesSeconds",
        "YearQuarter",
        "YearQuarterMonth"
    ];

export const vegaColorSchemes: string[] = 
    [
        "None",
        "accent",
        "bluegreen",
        "bluegreen-3",
        "bluegreen-4",
        "bluegreen-5",
        "bluegreen-6",
        "bluegreen-7",
        "bluegreen-8",
        "bluegreen-9",
        "blueorange",
        "blueorange-10",
        "blueorange-11",
        "blueorange-3",
        "blueorange-4",
        "blueorange-5",
        "blueorange-6",
        "blueorange-7",
        "blueorange-8",
        "blueorange-9",
        "bluepurple",
        "bluepurple-3",
        "bluepurple-4",
        "bluepurple-5",
        "bluepurple-6",
        "bluepurple-7",
        "bluepurple-8",
        "bluepurple-9",
        "blues",
        "blues-3",
        "blues-4",
        "blues-5",
        "blues-6",
        "blues-7",
        "blues-8",
        "blues-9",
        "brownbluegreen",
        "brownbluegreen-10",
        "brownbluegreen-11",
        "brownbluegreen-3",
        "brownbluegreen-4",
        "brownbluegreen-5",
        "brownbluegreen-6",
        "brownbluegreen-7",
        "brownbluegreen-8",
        "brownbluegreen-9",
        "category10",
        "category20",
        "category20b",
        "category20c",
        "dark2",
        "greenblue",
        "greenblue-3",
        "greenblue-4",
        "greenblue-5",
        "greenblue-6",
        "greenblue-7",
        "greenblue-8",
        "greenblue-9",
        "greens",
        "greens-3",
        "greens-4",
        "greens-5",
        "greens-6",
        "greens-7",
        "greens-8",
        "greens-9",
        "greys",
        "greys-3",
        "greys-4",
        "greys-5",
        "greys-6",
        "greys-7",
        "greys-8",
        "greys-9",
        "inferno",
        "magma",
        "orangered",
        "orangered-3",
        "orangered-4",
        "orangered-5",
        "orangered-6",
        "orangered-7",
        "orangered-8",
        "orangered-9",
        "oranges",
        "oranges-3",
        "oranges-4",
        "oranges-5",
        "oranges-6",
        "oranges-7",
        "oranges-8",
        "oranges-9",
        "paired",
        "pastel1",
        "pastel2",
        "pinkyellowgreen",
        "pinkyellowgreen-10",
        "pinkyellowgreen-11",
        "pinkyellowgreen-3",
        "pinkyellowgreen-4",
        "pinkyellowgreen-5",
        "pinkyellowgreen-6",
        "pinkyellowgreen-7",
        "pinkyellowgreen-8",
        "pinkyellowgreen-9",
        "plasma",
        "purpleblue",
        "purpleblue-3",
        "purpleblue-4",
        "purpleblue-5",
        "purpleblue-6",
        "purpleblue-7",
        "purpleblue-8",
        "purpleblue-9",
        "purplebluegreen",
        "purplebluegreen-3",
        "purplebluegreen-4",
        "purplebluegreen-5",
        "purplebluegreen-6",
        "purplebluegreen-7",
        "purplebluegreen-8",
        "purplebluegreen-9",
        "purplegreen",
        "purplegreen-10",
        "purplegreen-11",
        "purplegreen-3",
        "purplegreen-4",
        "purplegreen-5",
        "purplegreen-6",
        "purplegreen-7",
        "purplegreen-8",
        "purplegreen-9",
        "purpleorange",
        "purpleorange-10",
        "purpleorange-11",
        "purpleorange-3",
        "purpleorange-4",
        "purpleorange-5",
        "purpleorange-6",
        "purpleorange-7",
        "purpleorange-8",
        "purpleorange-9",
        "purplered",
        "purplered-3",
        "purplered-4",
        "purplered-5",
        "purplered-6",
        "purplered-7",
        "purplered-8",
        "purplered-9",
        "purples",
        "purples-3",
        "purples-4",
        "purples-5",
        "purples-6",
        "purples-7",
        "purples-8",
        "purples-9",
        "rainbow",
        "redblue",
        "redblue-10",
        "redblue-11",
        "redblue-3",
        "redblue-4",
        "redblue-5",
        "redblue-6",
        "redblue-7",
        "redblue-8",
        "redblue-9",
        "redgrey",
        "redgrey-10",
        "redgrey-11",
        "redgrey-3",
        "redgrey-4",
        "redgrey-5",
        "redgrey-6",
        "redgrey-7",
        "redgrey-8",
        "redgrey-9",
        "redpurple",
        "redpurple-3",
        "redpurple-4",
        "redpurple-5",
        "redpurple-6",
        "redpurple-7",
        "redpurple-8",
        "redpurple-9",
        "reds",
        "reds-3",
        "reds-4",
        "reds-5",
        "reds-6",
        "reds-7",
        "reds-8",
        "reds-9",
        "redyellowblue",
        "redyellowblue-10",
        "redyellowblue-11",
        "redyellowblue-3",
        "redyellowblue-4",
        "redyellowblue-5",
        "redyellowblue-6",
        "redyellowblue-7",
        "redyellowblue-8",
        "redyellowblue-9",
        "redyellowgreen",
        "redyellowgreen-10",
        "redyellowgreen-11",
        "redyellowgreen-3",
        "redyellowgreen-4",
        "redyellowgreen-5",
        "redyellowgreen-6",
        "redyellowgreen-7",
        "redyellowgreen-8",
        "redyellowgreen-9",
        "set1",
        "set2",
        "set3",
        "sinebow",
        "spectral",
        "spectral-10",
        "spectral-11",
        "spectral-3",
        "spectral-4",
        "spectral-5",
        "spectral-6",
        "spectral-7",
        "spectral-8",
        "spectral-9",
        "tableau10",
        "tableau20",
        "viridis",
        "yellowgreen",
        "yellowgreen-3",
        "yellowgreen-4",
        "yellowgreen-5",
        "yellowgreen-6",
        "yellowgreen-7",
        "yellowgreen-8",
        "yellowgreen-9",
        "yellowgreenblue",
        "yellowgreenblue-3",
        "yellowgreenblue-4",
        "yellowgreenblue-5",
        "yellowgreenblue-6",
        "yellowgreenblue-7",
        "yellowgreenblue-8",
        "yellowgreenblue-9",
        "yelloworangebrown",
        "yelloworangebrown-3",
        "yelloworangebrown-4",
        "yelloworangebrown-5",
        "yelloworangebrown-6",
        "yelloworangebrown-7",
        "yelloworangebrown-8",
        "yelloworangebrown-9",
        "yelloworangered",
        "yelloworangered-3",
        "yelloworangered-4",
        "yelloworangered-5",
        "yelloworangered-6",
        "yelloworangered-7",
        "yelloworangered-8",
        "yelloworangered-9"

    ];

export const aggregations: { displayName: string; vegaLiteName: string; description: string}[] = 
    [
        {
            displayName: '',
            vegaLiteName: '',
            description: 'None.'
        },
        {
            displayName: 'Average',
            vegaLiteName: 'average',
            description: 'The mean (average) field value. Identical to mean.'
        },
        {
            displayName: 'Count',
            vegaLiteName: 'count',
            description: 'The total count of data objects in the group.  Similar to SQL’s count(*), count can be specified with a field "*".'
        },
        {
            displayName: 'Distinct',
            vegaLiteName: 'distinct',
            description: 'The count of distinct field values.'
        },
        {
            displayName: 'Max',
            vegaLiteName: 'max',
            description: 'The maximum field value.'
        },
        {
            displayName: 'Mean',
            vegaLiteName: 'mean',
            description: 'The mean (average) field value.'
        },
        {
            displayName: 'Median',
            vegaLiteName: 'median',
            description: 'The median field value.'
        },
        {
            displayName: 'Min',
            vegaLiteName: 'min',
            description: 'The minimum field value.'
        },
        {
            displayName: 'Mising',
            vegaLiteName: 'missing',
            description: 'The count of null or undefined field values.'
        },
        {
            displayName: 'Lower quartile boundary',
            vegaLiteName: 'q1',
            description: 'The lower quartile boundary of field values.'
        },
        {
            displayName: 'Lower Confidence',
            vegaLiteName: 'ci0',
            description: 'The lower boundary of the bootstrapped 95% confidence interval of the mean field value.'
        },
        {
            displayName: 'Standard Deviation',
            vegaLiteName: 'stdev',
            description: 'The sample standard deviation of field values.'
        },
        {
            displayName: 'Standard Error',
            vegaLiteName: 'stderr',
            description: 'The standard error of field values.'
        },
        {
            displayName: 'Sum',
            vegaLiteName: 'sum',
            description: 'The sum of field values.'
        },
        {
            displayName: 'Upper Confidence',
            vegaLiteName: 'ci1',
            description: 'The upper boundary of the bootstrapped 95% confidence interval of the mean field value.'
        },
        {
            displayName: 'Upper quartile boundary',
            vegaLiteName: 'q3',
            description: 'The upper quartile boundary of field values.'
        },
        {
            displayName: 'Valid',
            vegaLiteName: 'valid',
            description: 'The count of field values that are not null, undefined or NaN.'
        },
        {
            displayName: 'Variance',
            vegaLiteName: 'variance',
            description: 'The sample variance of field values.'
        }
    ];

export const dateTimeFormats: {displayFormat: string; d3Format: string, description: string}[] =
    [
        {
            displayFormat: 'Short Weekday Name',
            d3Format: '%a',
            description: 'abbreviated weekday name.*'
        },
        {
            displayFormat: 'Full Weekday Name',
            d3Format: '%A',
            description: 'full weekday name.*'
        },
        {
            displayFormat: 'Abr Month Name',
            d3Format: '%b',
            description: 'abbreviated month name.*'
        },
        {
            displayFormat: 'Full Month Name',
            d3Format: '%B',
            description: 'full month name.*'
        },
        {
            displayFormat: 'Locale Datetime',
            d3Format: '%c',
            description: 'the locale’s date and time, such as %x, %X.*'
        },
        {
            displayFormat: 'Zero padded Day',
            d3Format: '%d',
            description: 'zero-padded day of the month as a decimal number [01,31].'
        },
        {
            displayFormat: 'Space padded Day',
            d3Format: '%e',
            description: 'space-padded day of the month as a decimal number [ 1,31]; equivalent to %_d.'
        },
        {
            displayFormat: 'Microseconds',
            d3Format: '%f',
            description: 'microseconds as a decimal number [000000, 999999].'
        },
        {
            displayFormat: 'Hour (24h)',
            d3Format: '%H',
            description: 'hour (24-hour clock) as a decimal number [00,23].'
        },
        {
            displayFormat: 'Hour (12h)',
            d3Format: '%I',
            description: 'hour (12-hour clock) as a decimal number [01,12].'
        },
        {
            displayFormat: 'Day number of year',
            d3Format: '%j',
            description: 'day of the year as a decimal number [001,366].'
        },
        {
            displayFormat: 'Month number',
            d3Format: '%m',
            description: 'month as a decimal number [01,12].'
        },
        {
            displayFormat: 'Minutes',
            d3Format: '%M',
            description: 'minute as a decimal number [00,59].'
        },
        {
            displayFormat: 'Millisecond',
            d3Format: '%L',
            description: 'milliseconds as a decimal number [000, 999].'
        },
        {
            displayFormat: 'AM or PM',
            d3Format: '%p',
            description: 'either AM or PM.*'
        },
        {
            displayFormat: 'Seconds',
            d3Format: '%S',
            description: 'second as a decimal number [00,61].'
        },
        {
            displayFormat: 'Weekday number (Monday)',
            d3Format: '%u',
            description: 'Monday-based (ISO 8601) weekday as a decimal number [1,7].'
        },
        {
            displayFormat: 'Week number (Sunday)',
            d3Format: '%U',
            description: 'Sunday-based week of the year as a decimal number [00,53].'
        },
        {
            displayFormat: 'Week number (ISO)',
            d3Format: '%V',
            description: 'ISO 8601 week of the year as a decimal number [01, 53].'
        },
        {
            displayFormat: 'Weekday (Sunday)',
            d3Format: '%w',
            description: 'Sunday-based weekday as a decimal number [0,6].'
        },
        {
            displayFormat: 'Week number (Monday)',
            d3Format: '%W',
            description: 'Monday-based week of the year as a decimal number [00,53].'
        },
        {
            displayFormat: 'Locale date',
            d3Format: '%x',
            description: 'the locale’s date, such as %-m/%-d/%Y.*'
        },
        {
            displayFormat: 'Locale time',
            d3Format: '%X',
            description: 'the locale’s time, such as %-I:%M:%S %p.*'
        },
        {
            displayFormat: 'Year as YY',
            d3Format: '%y',
            description: 'year without century as a decimal number [00,99].'
        },
        {
            displayFormat: 'Year as YYYY',
            d3Format: '%Y',
            description: 'year with century as a decimal number.'
        },
        {
            displayFormat: 'Date Time',
            d3Format: 'dateTime',
            description: 'The date and time (%c) format specifier (e.g., "%a %b %e %X %Y").'
        },
        {
            displayFormat: 'Full Weekday',
            d3Format: 'days',
            description: 'The full names of the weekdays, starting with Sunday.'
        },
        {
            displayFormat: 'Short Weekday',
            d3Format: 'shortDays',
            description: 'The abbreviated names of the weekdays, starting with Sunday.'
        },
        {
            displayFormat: 'full Months',
            d3Format: 'months',
            description: 'The full names of the months (starting with January).'
        },
        {
            displayFormat: 'Short Months',
            d3Format: 'shortMonths',
            description: 'The abbreviated names of the months (starting with January).'
        }
    ];

export const numberFormats: {displayFormat: string; d3Format: string; description: string}[] =
    [
        {
            displayFormat: 'Exponent',
            d3Format: 'e',
            description: 'exponent notation.'
        },
        {
            displayFormat: 'Fixed point',
            d3Format: 'f',
            description: 'fixed point notation.'
        },
        {
            displayFormat: 'Rounded',
            d3Format: 'r',
            description: 'decimal notation, rounded to significant digits.'
        },
        {
            displayFormat: 'SI Prefix',
            d3Format: 's',
            description: 'decimal notation with an SI prefix, rounded to significant digits.'
        },
        {
            displayFormat: 'Percentage',
            d3Format: '%',
            description: 'multiply by 100, and then decimal notation with a percent sign.'
        },
        {
            displayFormat: 'Percentage rounded',
            d3Format: 'p',
            description: 'multiply by 100, round to significant digits, and then decimal notation with a percent sign.'
        }
    ];

export const siPrefix: {displayFormat: string; d3Format: string; description: string}[] =
    [
        {
            displayFormat: 'yocto',
            d3Format: 'y',
            description: '10⁻²⁴'
        },
        {
            displayFormat: 'zepto',
            d3Format: 'z',
            description: '10⁻²¹'
        },
        {
            displayFormat: 'atto',
            d3Format: 'a',
            description: '10⁻¹⁸'
        },
        {
            displayFormat: 'femto',
            d3Format: 'f',
            description: '10⁻¹⁵'
        },
        {
            displayFormat: 'pico',
            d3Format: 'p',
            description: '10⁻¹²'
        },
        {
            displayFormat: 'nano',
            d3Format: 'n',
            description: '10⁻⁹'
        },
        {
            displayFormat: 'micro',
            d3Format: 'µ',
            description: '10⁻⁶'
        },
        {
            displayFormat: 'milli',
            d3Format: 'm',
            description: '10⁻³'
        },
        {
            displayFormat: ' (none)',
            d3Format: '​',
            description: '10⁰'
        },
        {
            displayFormat: 'kilo',
            d3Format: 'k',
            description: '10³'
        },
        {
            displayFormat: 'mega',
            d3Format: 'M',
            description: '10⁶'
        },
        {
            displayFormat: 'giga',
            d3Format: 'G',
            description: '10⁹'
        },
        {
            displayFormat: 'tera',
            d3Format: 'T',
            description: '10¹²'
        },
        {
            displayFormat: 'peta',
            d3Format: 'P',
            description: '10¹⁵'
        },
        {
            displayFormat: 'exa',
            d3Format: 'E',
            description: '10¹⁸'
        },
        {
            displayFormat: 'zetta',
            d3Format: 'Z',
            description: '10²¹'
        },
        {
            displayFormat: 'yotta',
            d3Format: 'Y',
            description: '10²⁴'
        }
    ];