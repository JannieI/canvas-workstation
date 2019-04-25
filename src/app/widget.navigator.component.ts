/*
 * Manage a single Navigator component
 */

// From Angular
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

// Our Services
import { GlobalVariableService } from './global-variable.service';
import { GlobalFunctionService } from './global-function.service';

// Our Models
import { Datasource } from './models'
import { NavigatorHistory } from './models'
import { NavigatorRelationship } from './models'
import { NavigatorProperties } from './models'
import { NavigatorNodeFiler } from './models'
import { NavigatorWatchList } from './models'
import { Widget } from './models'

// Functions, 3rd Party
import { parse } from 'vega';
import { View } from 'vega';
import vegaTooltip from 'vega-tooltip';

const MORE_TO_FILTER: string = 'Filter for more ...';

@Component({
    selector: 'widget-navigator',
    templateUrl: './widget.navigator.component.html',
    styleUrls: ['./widget.navigator.component.css']
})
export class WidgetNavigatorComponent {
    @ViewChild('dragWidget', { read: ElementRef }) dragWidget: ElementRef;  //Vega graph
    @Input() selectedWidget: Widget;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        event.preventDefault();
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown' ||
            event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            return false;
        };
    };

    // Note about the structure of the data:
    // The data for the Networks are stored locally in the this.networks variable, and
    // in a DS in the Database, lets call it DSn.  DSn has a property subDatasources[],
    // subDS.  These point to the rest of the DSs used in a network:
    //  - DSn = network name, description, access, etc
    //  - subDS[0] = id of the DS that keeps the relationships, say DSrel.
    //  - subDS[1] = id of the DS that keeps the Node properties, say DSpr.
    //
    // The folowing shapes are temporary, and only used in this routine (not stored in the DB):
    //  - NavigatorHistory
    //  - NavigatorNodeFiler
    errorMessage: string = '';                          // Error on form
    graphData: any[] = [];                              // childDataAll formatted for Vega

    ngNetworks: Datasource[] = [];                      // All Networks (DS with isNetwork = True)
    ngHistory: NavigatorHistory[] = [];                   // History for current network
    historyAll: NavigatorHistory[] = [];                // All history for All networks

    networkRelationships: NavigatorRelationship[] = []; // Data with Node-Relationship-Node DSrel
    networkProperties: NavigatorProperties[] = [];      // Data with Node-PropertyKeyValye DSprop
    ngDropdownParentNodeTypes: string[] = [];           // Dropdown: Parent Node Types
    ngDropdownParentNodes: string[] = [];               // Dropdown: Parent Nodes
    ngDropdownRelationships: string[] = [];             // Dropdown: Relationships
    ngNodeProperties: string[] = [];                    // Dropdown: Properties per Parent Node Type

    selectedNetworkID: number = -1;                     // Select NW ID
    selectedNetworkRelationshipID: number = -1;         // DSid for DSrel
    selectedNetworkPropertiesID: number = -1;           // DSid for DSprop
    selectedHistoryID: number = -1;                     // History ID
    selectedAdditonalProperty: string = '';             // Property to shown with Nodes in graph
    selectedView: string = 'DefaultView';               // Selected View Name
    isViewsDisabled: boolean = false;                   // True if all views are disabled

    // Selected - value selected in a dropdown
    selectedParentNodeType: string = '';                // Dropdown: selected Parent Node Type
    selectedParentNode: string = '';                    // Dropdown: selected Parent Node
    selectedRelationship: string = '';                  // Dropdown: selected Relationship
    selectedChildFilterID: number = -1;
    selectedParentFilterID: number = -1;

    networkGraph2: NavigatorRelationship[] = [];
    watchList: NavigatorWatchList[] = [];               // Watchlist per user and per NodeType

    ngParentNodeFilterDropdown: string[] = [];          // Dropdown: Parent Nodes Filter
    ngParentNodeFilterSelectedFieldName: string = '';   // Parent Node Filter
    ngParentNodeFilterSelectedOperator: string = '';    // Parent Node Filter
    ngParentNodeFilterSelectedValue: string = '';       // Parent Node Filter
    parentNodesFilteredList: string[] = [];             // List of Nodes, after filtered on NodeProperties

    ngSelectedRelationshipFilterRole: string = '';      // Relationship Role Filter
    relationshipsFilteredList: string[] = [];           // List of Relationships, after filtered on NodeProperties

    ngChildNodeFilterDropdown: string[] = [];           // Dropdown: Child Nodes Filter
    ngChildNodeFilterSelectedFieldName: string = '';    // Child Node Filter
    ngChildNodeFilterSelectedOperator: string = '';     // Child Node Filter
    ngChildNodeFilterSelectedValue: string = '';        // Child Node Filter
    ngChildFilterShowTop: string = '';                  // Show top n Child Nodes
    ngChildFilterSortFieldName: string = '';            // Sort Child Nodes
    childNodesFilteredList: string[] = [];              // List of Nodes, after filtered on NodeProperties

    // Working
    childDataAll: any[] = [];                           // List of all children after filter
    childDataVisible: any[] = [];                       // Visible children, based on nrShown
    childNodeFilter: NavigatorNodeFiler[] = [];         // Actual Filter
    childFilterErrorMessage: string = '';
    filterID: number = -1;
    firstAdjacencyCellRowNr: number = -1;
    parentFilterErrorMessage: string = '';
    parentNodeFilter: NavigatorNodeFiler[] = [];        // Actual Filter
    ngRelationshipRoles: string[] = [];
    relationshipFilterErrorMessage: string = '';
    visibleNumberChildren: number = 12;

    // Graph dimensions
    graphHeight: number = 400;          // TODO - fill this into Spec
    graphWidth: number = 400;           // TODO - fill this into Spec
    graphLevels: number = 2;            // Nr of levels in the graph (1 level = Parent-Relationship-Child)
    graphLevelsMax: number = 10;        // Max Nr of levels allowed per graph

    // Form layout and elements
    graphNotes: string = 'Optional Additional information';
    graphTitle: string = 'Directors for Absa, filtered by age (9/24)';
    showHistory: boolean = false;
    showNetwork: boolean = false;
    showRoles: boolean = false;             // True to add level to graph with Relationship Roles
    showProperty: boolean = false;          // True to show selected Property with Nodes in graph
    showVisibleNumberInput: boolean = false;

    // Widget and Graph (Vega)
    localWidget: Widget;                            // W to modify, copied from selected
    showSpecificGraphLayer: boolean = false;
    specification: any;             // Full spec for Vega, or other grammar

    // Popups and forms
    showGraphHelp: boolean = false;
    showGraphNotes: boolean = false;
    showGraphProperties: boolean = false;

    watchListFiltered: boolean = false;


    navMaxRecursion: number = 100;
    navRecursionCounter: number = 0;
    navVisitedNodes: string[] = [];


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,

    ) {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name, 'constructor', '@Start');

    }

    ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnInit', '@Start');

        // Deep copy Local W
        this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));


        // Populate persisted data - TODO via DB
        this.tempCreateDummyData();



        // Read DS for all Networks from DB
        this.globalVariableService.getResource('datasources', 'filterObject={"isNetworkShape": true}')
            .then(res => {
                this.ngNetworks = res;
                console.log('xx this.ngNetworks', this.ngNetworks)
                // Find DS for selected W inside Networks
                let networkIndex: number = this.ngNetworks.findIndex(
                    nw => nw.id == this.localWidget.datasourceID);

                // Select the network for the current W, else the first one
                if (this.ngNetworks.length > 0) {
                    if (networkIndex >= 0) {
                        this.selectedNetworkID = this.ngNetworks[networkIndex].id;

                        this.clickNetwork(networkIndex, this.selectedNetworkID);
                    } else {
                        this.clickNetwork(0, this.ngNetworks[0].id);
                    };
                };
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Navigator.OnInit reading datasources: ' + err);
            });



    }

    clickMenuShowNetworks() {
        // Clicked Menu to open form on which to select a new network
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShowNetworks', '@Start');

        this.showNetwork = true;
    }

    clickMenuShowHistory() {
        // Click the menu to open Navigated History popup
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShowHistory', '@Start');

        this.showHistory = true;
    }

    clickMenuShowGraphProperties() {
        // Clicked Menu to open popup to edit graph properties like title
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShowGraphProperties', '@Start');

        this.showGraphProperties = true;
    }

    clickMenuShowGraphNotes() {
        // Clicked the Menu to show popup to edit notes at bottom of graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShowGraphNotes', '@Start');

        this.showGraphNotes = true;
    }

    clickMenuShowGraphHelp() {
        // Clicked Menu to show popup with help information
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShowGraphHelp', '@Start');

        this.showGraphHelp = true;
    }

    clickMenuClearHistory() {
        // Clear history for the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuClearHistory', '@Start');

        this.ngHistory = this.ngHistory.filter(h => h.networkID != this.selectedNetworkID);
        this.historyAll = this.historyAll.filter(h => h.networkID != this.selectedNetworkID);
    }

    clickMenuExportGraph() {
        // Export the current graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuExportGraph', '@Start');

        let fileName: string = 'Nav Network'
        let newW: Widget = JSON.parse(JSON.stringify(this.selectedWidget));
        newW.dataFiltered = [];
        var obj = JSON.stringify(newW);

        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u, ' + encodeURIComponent(JSON.stringify(obj)));
        a.setAttribute('download', fileName);
        a.click()

    }

    clickCloseNetworksPopup() {
        // Close network popup
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseNetworksPopup', '@Start');

        this.showNetwork = false;

    }

    clickCloseHistoryPopup() {
        // Close Navigated History popup
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseHistoryPopup', '@Start');

        this.showHistory = false;

    }

    dblclickDeleteHistory(index: number, historyID: number) {
        // Delete selected history row.  If current, move to first
        this.globalFunctionService.printToConsole(this.constructor.name, 'dblclickDeleteHistory', '@Start');

        this.ngHistory = this.ngHistory.filter(h => h.id != historyID);
        this.historyAll = this.historyAll.filter(h => h.id != historyID);

    }

    clickClosepropertyPopup(index: number, historyID: number) {
        // Delete selected history row.  If current, move to first
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickClosepropertyPopup', '@Start');

        this.showGraphProperties = false;

    }

    clickCloseGraphNotesPopup() {
        // Close popup to edit notes at bottom of graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseGraphNotesPopup', '@Start');

        this.showGraphNotes = false;
    }

    clickCloseHelpPopup() {
        // Close popup to edit notes at bottom of graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseHelpPopup', '@Start');

        this.showGraphHelp = false;
    }

    clickAdditionalPropertyClear() {
        // Clear Properties from Nodes, shown in brackets
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickAdditionalPropertyClear', '@Start');

        this.selectedAdditonalProperty = '';

        this.checkShowGraph();
    }

    clickAdditionalPropertyShow() {
        // Show selected Property in brackets with Nodes
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickAdditionalPropertyShow', '@Start');

        this.checkShowGraph();

    }

    clickNetwork(index: number, networkID: number) {
        // Clicked a network (or called from ngOnInit)
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickNetwork', '@Start');

        // Reset
        this.errorMessage = '';
        this.parentFilterErrorMessage = '';
        this.childFilterErrorMessage = '';

        // Remember the ID of the selected Network
        this.selectedNetworkID = networkID;

        // Read the Data for this W from the DB
        if (this.selectedNetworkID >= 0) {

            if (this.ngNetworks[index].subDatasources.length != 2) {
                // TODO - make friendly
                console.log('ERROR ...')
            } else {

                this.selectedNetworkRelationshipID = this.ngNetworks[index].subDatasources[0];
                this.globalVariableService.getData(
                    'datasourceID=' + this.selectedNetworkRelationshipID.toString()
                )
                    .then(res => {
                        this.networkRelationships = res;

                        // Fill ParentNode type Dropdown
                        this.ngDropdownParentNodeTypes = this.distinctNodeTypes();
                        this.ngDropdownParentNodeTypes = ['', ...this.ngDropdownParentNodeTypes];

                        this.selectedNetworkPropertiesID = this.ngNetworks[index].subDatasources[1];
                        this.globalVariableService.getData(
                            'datasourceID=' + this.selectedNetworkPropertiesID.toString()
                        )
                            .then(res => {
                                this.networkProperties = res;

                                // Disable Views
                                this.isViewsDisabled = true;

                                // Dropdown
                                this.ngNodeProperties = this.distinctNodeProperties();
                                this.ngNodeProperties = ['', ...this.ngNodeProperties];

                                // Clear the rest & reset pointers
                                this.ngDropdownParentNodes = [];
                                this.ngDropdownRelationships = [];
                                this.parentNodeFilter = [];
                                this.childNodeFilter = [];

                                this.selectedParentNodeType = '';
                                this.selectedParentNode = '';
                                this.selectedRelationship = '';
                                this.selectedParentFilterID = -1;
                                this.selectedChildFilterID = -1;

                                this.ngHistory = this.historyAll
                                    .filter(h => h.networkID === networkID)
                                    .sort((a, b) => {
                                        if (a.id < b.id) {
                                            return 1;
                                        };
                                        if (a.id > b.id) {
                                            return -1;
                                        };
                                        return 0;
                                    });

                                // Click the first row
                                if (this.ngHistory.length > 0) {
                                    this.clickHistory(0, this.ngHistory[0].id);
                                } else {
                                    // Clear the graph
                                    this.selectedView = 'SummaryView';
                                    this.clickNetworkSummaryView();
                                };

                                // Close Navigated popup
                                this.showHistory = false;
                            })
                            .catch(err => {
                                this.errorMessage = err.slice(0, 100);
                                console.error('Error in Navigator.OnInit reading clientData: ' + err);
                            });
                    })
                    .catch(err => {
                        this.errorMessage = err.slice(0, 100);
                        console.error('Error in Navigator.OnInit reading clientData: ' + err);
                    });

            };
        };

    }

    clickHistory(index: number, historyID: number) {
        // Click a point in history, and show that graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickHistory', '@Start');

        // Set the history id, selected fields
        this.selectedParentNodeType = this.ngHistory[index].parentNodeType;
        this.selectedParentNode = this.ngHistory[index].parentNode;
        this.selectedRelationship = this.ngHistory[index].relationship;
        this.showRoles = this.ngHistory[index].showRoles;
        this.selectedView = this.ngHistory[index].view;

        // Set the history id and reset the isSelected field in history
        this.selectedHistoryID = historyID;
        this.ngHistory.forEach(h => {
            if (h.id === historyID) {
                h.isSelected = true;
            } else {
                h.isSelected = false;
            };
        });

        // Show the graph
        this.showGraph(0, 0, false)
    }

    changeParentNodeType(ev: any) {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeParentNodeType', '@Start');

        // Set selected Nodes
        this.selectedParentNodeType = ev.target.value;

        if (this.selectedParentNodeType === '') {
            return;
        };

        // Fill Dropdowns
        this.ngDropdownParentNodes = this.distinctNodesPerNodeType(this.selectedParentNodeType);
        this.ngDropdownParentNodes = ['', 'All', ...this.ngDropdownParentNodes];

        // Fill Relationships Dropdown
        this.ngDropdownRelationships = this.distinctRelationships(this.selectedParentNodeType);
        this.ngDropdownRelationships = ['All', ...this.ngDropdownRelationships];

        // Reduce size of Dropdown
        if (this.ngDropdownRelationships.length > 20) {
            this.ngDropdownRelationships = [...this.ngDropdownRelationships.slice(0, 20), MORE_TO_FILTER]
        };

        // Clear Relationship roles
        this.ngRelationshipRoles = [];

        // Clear all Filters
        this.clickParentFilterClear();
        this.clickRelationshipFilterClear();
        this.clickChildFilterClear();

        // Set Parent Node Property Filter properties
        this.ngParentNodeFilterDropdown = this.networkProperties
            .filter(np => np.nodeType == this.selectedParentNodeType && np.propertyKey != '')
            .map(np => np.propertyKey);
        this.ngParentNodeFilterDropdown = this.navUniqifySortNodes(this.ngParentNodeFilterDropdown);

    }

    changeParentNode(ev: any) {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeParentNode', '@Start');

        this.selectedParentNode = ev.target.value;

        // More clicked
        if (this.selectedParentNode === MORE_TO_FILTER) {
            return;
        };

        // Clear child filter
        this.clickChildFilterClear();

        // Show graph if all 3 selected
        this.checkShowGraph();
    }

    changeRelationship(ev: any) {
        // Make the filter inactive
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeRelationship', '@Start');

        this.selectedRelationship = ev.target.value;

        // Get Relationship Roles
        this.ngRelationshipRoles = this.distinctRelationshipRoles(this.selectedRelationship);
        this.showRoles = false;

        // Clear child filter
        this.clickChildFilterClear();

        // Show graph if all 3 selected
        this.checkShowGraph();

    }

    checkShowGraph() {
        // Check if all selected; then show graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'checkShowGraph', '@Start');

        // Network view is always available
        if (this.selectedView === 'SummaryView') {
            this.createGraphDataSummaryView();
        } else {

            // Show the graph when all fields selected
            if (this.selectedParentNodeType != ''
                &&
                this.selectedParentNode != ''
                &&
                this.selectedRelationship != '') {

                // Build the data for the Graph based on the selection and graph type
                switch (this.selectedView) {
                    case 'DefaultView': {
                        this.createGraphDefaultView();
                        break;
                    }
                    case 'CommonParentView': {
                        this.createGraphCommonParentView();
                        break;
                    }
                    case 'CommonNodeView': {
                        this.createGraphCommonNodeView();
                        break;
                    }
                    case 'DistanceView': {
                        this.createGraphDistanceView();
                        break;
                    }
                    case 'NodeTypeView': {
                        this.createGraphNodeTypeView();
                        break;
                    }

                    default: {
                        // Unknown
                        console.log('Error - unknown selectedView value:', this.selectedView);
                        break;
                    }
                };
            };
        };

        // Show the graph
        this.showGraph();

    }

    createGraphDefaultView(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphDefaultView', '@Start');

        this.graphTitle = '';
        // Build data and graph if all parent & relationship fields selected
        if (this.selectedParentNodeType != ''
            && this.selectedParentNode != ''
            && this.selectedRelationship != '') {

            // Set the data, some unique
            this.childDataAll = this.distinctChildrenNodes(
                this.selectedParentNodeType, 
                this.selectedParentNode, 
                [this.selectedRelationship],
                this.ngSelectedRelationshipFilterRole
            );
            this.ngRelationshipRoles = this.distinctRelationshipRoles(this.selectedRelationship);

            // Set title, etc
            this.graphTitle = this.showRoles ? '*' : '';
            this.graphTitle = this.graphTitle + this.selectedRelationship + ' for '
                + this.selectedParentNode;
            if (this.ngChildNodeFilterSelectedFieldName != '') {
                this.graphTitle = this.graphTitle + ', filtered on ' + this.ngChildNodeFilterSelectedFieldName;
            };

            // Reduce visible list
            this.childDataVisible = this.childDataAll.slice(0, this.visibleNumberChildren);

            // Format the graphData
            this.graphData = [];
            if (!this.showRoles) {

                // Parent
                this.graphData.push(
                    {
                        "id": 1,
                        "name": this.constructNodeName(this.selectedParentNode)
                    });

                // Children
                for (var i = 0; i < this.childDataVisible.length; i++) {
                    this.graphData.push({
                        id: i + 2,
                        name: this.constructNodeName(this.childDataVisible[i]),
                        parent: 1
                    });
                };
            } else {
                console.log('xx 6', this.childDataAll, this.ngRelationshipRoles)
                // Parent
                this.graphData.push(
                    {
                        "id": 1,
                        "name": this.constructNodeName(this.selectedParentNode)
                    });

                // Offset
                let offset: number = 2;

                for (var roleID = 0; roleID < this.ngRelationshipRoles.length; roleID++) {
                    let parentRoleID = offset;
                    this.graphData.push(
                        {
                            "id": parentRoleID,
                            "name": this.ngRelationshipRoles[roleID],
                            parent: 1
                        });

                    // Get list of Children for this role
                    let leftChildrenFilteredRole: string[] = this.networkRelationships
                        .filter(nr => nr.leftNodeType === this.selectedParentNodeType
                            && nr.leftNodeName === this.selectedParentNode
                            && nr.relationshipLeftToRight === this.selectedRelationship
                            && nr.relationshipProperty === this.ngRelationshipRoles[roleID])
                        .map(y => y.rightNodeName);
                    let rightChildrenFilteredRole: string[] = this.networkRelationships
                        .filter(nr => nr.rightNodeType === this.selectedParentNodeType
                            && nr.rightNodeName === this.selectedParentNode
                            && nr.relationshipRightToLeft === this.selectedRelationship
                            && nr.relationshipProperty === this.ngRelationshipRoles[roleID])
                        .map(y => y.rightNodeName);
                    let childrenFilteredRole: string[] = leftChildrenFilteredRole
                        .concat(rightChildrenFilteredRole);

                    // Increment with 1, which was added above
                    offset = offset + 1;
                    for (var childID = 0; childID < childrenFilteredRole.length; childID++) {
                        this.graphData.push(
                            {
                                "id": childID + offset,
                                "name": this.constructNodeName(childrenFilteredRole[childID]),
                                parent: parentRoleID
                            });
                    };
                    offset = offset + childrenFilteredRole.length;
                };
                console.log('xx 6.5', this.graphData)
            };

            // Add to History
            // TODO - keep ParentNodeID of selected for here
            // TODO - cater for more than 1 Filter; Parent and Child
            if (addToHistory
                && this.selectedParentNodeType != ''
                && this.selectedParentNode != ''
                && this.selectedRelationship != '') {
                let parentFilterFieldName: string = '';
                let parentFilterOperator: string = '';
                let parentFilterValue: string = '';
                let childFilterFieldName: string = '';
                let childFilterOperator: string = '';
                let childFilterValue: string = '';
                if (this.parentNodeFilter.length > 0) {
                    parentFilterFieldName = this.parentNodeFilter[0].field;
                    parentFilterOperator = this.parentNodeFilter[0].operator;
                    parentFilterValue = this.parentNodeFilter[0].value;

                };
                if (this.childNodeFilter.length > 0) {
                    childFilterFieldName = this.childNodeFilter[0].field;
                    childFilterOperator = this.childNodeFilter[0].operator;
                    childFilterValue = this.childNodeFilter[0].value;

                };
                console.log('xx 7')
                // Deselect all history, and add a new one at the top
                this.ngHistory.forEach(x => x.isSelected = false);
                this.selectedHistoryID = this.ngHistory.length;
                let historyNew: NavigatorHistory =
                {
                    id: this.ngHistory.length,
                    text: this.graphTitle,
                    networkID: this.selectedNetworkID,
                    parentNodeID: null,
                    parentNodeType: this.selectedParentNodeType,
                    parentNode: this.selectedParentNode,
                    relationship: this.selectedRelationship,
                    showRoles: this.showRoles,
                    parentNodeFiler:
                    {
                        id: 0,
                        field: parentFilterFieldName,
                        operator: parentFilterOperator,
                        value: parentFilterValue
                    },
                    childNodeFiler:
                    {
                        id: 0,
                        field: childFilterFieldName,
                        operator: childFilterOperator,
                        value: childFilterValue
                    },
                    isSelected: true,
                    view: this.selectedView
                };
                this.ngHistory = [historyNew, ...this.ngHistory];
                this.historyAll = [historyNew, ...this.historyAll];
                console.log('xx 8', this.ngHistory)
            };

            // Set H & W
            if (inputHeight != 0) {
                this.graphHeight = inputHeight;
            } else {
                if (this.localWidget.graphLayers.length > 0) {
                    this.graphHeight = this.localWidget.graphLayers[0].graphSpecification.height;
                };
            };
            if (this.graphHeight < 100) {
                this.graphHeight = 100;
            };
        } else {
            this.graphTitle = '';
            console.log('xx 9')
            // Set data
            this.graphData = [];
            this.graphData.push(
                {
                    "id": 1,
                    "name": "Select a Parent using the dropdowns at the top"
                });
        };

        // Set H & W
        if (inputWidth != 0) {
            this.graphWidth = inputWidth;
        } else {
            if (this.localWidget.graphLayers.length > 0) {
                this.graphWidth = this.localWidget.graphLayers[0].graphSpecification.width;
            };
        };
        if (this.graphWidth < 100) {
            this.graphWidth = 100;
        };
    }

    createGraphDataSummaryView(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphDataSummaryView', '@Start');

        let networkIndex: number = this.ngNetworks.findIndex(nw => nw.id == this.selectedNetworkID);

        // No network selected
        if (networkIndex < 0) {
            return;
        };

        // Find unique Nodes
        let uniqueNodeTypes: string[] = this.distinctNodeTypes();

        // Count relationships
        let nodeCount: number = -1;
        let uniqueNodesWithCount: { nodeType: string; nodeCount: number }[] = [];
        for (var i = 0; i < uniqueNodeTypes.length; i++) {
            nodeCount = this.networkRelationships.filter(x => x.leftNodeType == uniqueNodeTypes[i]).length;
            console.log('xx nodeCount', nodeCount)
            nodeCount = nodeCount + this.networkRelationships
                .filter(x => x.rightNodeType == uniqueNodeTypes[i]).length;
            uniqueNodesWithCount.push(
                {
                    nodeType: uniqueNodeTypes[i],
                    nodeCount: nodeCount
                });
        };
        console.log('xx uniqueNodesWithCount', uniqueNodesWithCount)
        // Set data
        this.graphData = [];
        this.graphData.push(
            {
                "id": 1,
                "name": "Summary"
            });
        for (var i = 0; i < uniqueNodeTypes.length; i++) {

            this.graphData.push(
                {
                    id: i + 2,
                    name: uniqueNodesWithCount[i].nodeType + ' ('
                        + uniqueNodesWithCount[i].nodeCount.toString() + ')',
                    parent: 1
                }
            );
        };

        this.graphTitle = 'Summary of ' + this.ngNetworks[networkIndex].name;

        // Dimension it
        this.graphHeight = 400; //this.localWidget.graphLayers[0].graphSpecification.height;
        this.graphWidth = 400; //this.localWidget.graphLayers[0].graphSpecification.width;

    }

    createGraphCommonParentView(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphCommonParentView', '@Start');
    }

    createGraphCommonNodeView(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphCommonNodeView', '@Start');
    }

    createGraphDistanceView(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphDistanceView', '@Start');
        this.nav2WalkInPath(null, "y", "rel", 0, [])

    }

    createGraphNodeTypeView(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Create the data for the view
        this.globalFunctionService.printToConsole(this.constructor.name, 'createGraphNodeTypeView', '@Start');

    }

    showGraph(inputHeight: number = 0, inputWidth: number = 0, addToHistory: boolean = true) {
        // Re-create the Vega spec, and show the graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'showGraph', '@Start');

        // Create specification
        this.specification = this.globalVariableService.createVegaSpec(
            this.localWidget,
            this.graphHeight - 20,  // 280
            this.graphWidth - 20,  // 280
            this.showSpecificGraphLayer,
            0
        );
        console.log('xx this.specification', this.graphTitle, this.graphData, this.specification)

        // Load the data
        this.specification['data'][0]['values'] = this.graphData;
        this.specification['title'] = this.graphTitle;

        // TODO - decide if we need to update the Widget Data too ?
        // this.specification.graphLayers[0].graphSpecification.data = this.graphData;

        // Render in DOM
        let view = new View(parse(this.specification));

        // JS trick to reference outside scope from inside that callback
        var that = this;
        view.addEventListener('click', function (event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            let childNodeClicked: string = datumClick.name;

            // TODO - is it safe to use a ( ?
            if (childNodeClicked.indexOf('(') >= 0) {
                childNodeClicked = childNodeClicked.slice(0, childNodeClicked.indexOf('(') - 1);
            };

            console.log('XX CLICKED ', childNodeClicked, that.selectedView)
            // this.selectedParentNodeType = this.selectedParentNodeType.bind(this);

            // Network Summary -> Fill Node Type
            if (that.selectedView === 'SummaryView') {
                console.log('xx summ View')
                that.selectedParentNodeType = childNodeClicked;
                that.selectedParentNode = '';
                that.selectedRelationship =  '';
                let ev: any = {
                    target: {
                        value: childNodeClicked
                    }
                };

                that.changeParentNodeType(ev);
            } else {
                // Find Child in list of visible children
                let childClickedNodeType: string = '';
                let childClickedIndex: number = that.networkRelationships.findIndex(
                    nr => nr.leftNodeName === childNodeClicked
                );
                if (childClickedIndex >= 0) {
                    childClickedNodeType = that.networkRelationships[childClickedIndex]
                        .leftNodeType;
                } else {
                    childClickedIndex = that.networkRelationships.findIndex(
                        nr => nr.rightNodeName === childNodeClicked
                    );
                    if (childClickedIndex >= 0) {
                        childClickedNodeType = that.networkRelationships[childClickedIndex]
                            .rightNodeType;
                    };
                };
                console.log('xx childClicked', childClickedNodeType, childNodeClicked)

                if (childClickedNodeType != '') {
                    that.selectedParentNodeType = childClickedNodeType;
                    that.selectedParentNode = childNodeClicked;
                    that.selectedRelationship = '';
                    let evNT: any = {
                        target: {
                            value: childClickedNodeType
                        }
                    };
                    that.changeParentNodeType(evNT);

                    let evN: any = {
                        target: {
                            value: childNodeClicked
                        }
                    };
                    that.changeParentNode(evN);
                };

            };
        });
        view.addEventListener('mouseover', function (event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            let childNodeOvered: string = datumClick.name;
            console.log('xx MOUSEover !!', childNodeOvered)
        });
        
        view.renderer('svg')
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();

        vegaTooltip(view);
    }

    constructGraphDataForUnit(
        parentNodeName: string, 
        relationships: string[], 
        isBreakOnRelationship: boolean = false, 
        isBreakOnRole: boolean = false,
        startID: number = 1
        ): any[] {
        // Creates the graphData for a Unit: parent - relationship(s) - children (1 level deep)
        // This can be called multiple times from calling routines
        // Input:
        //  parentNodeName - SINGLE parent NodeName
        //  relationships - array of relationships, can be 1, some or 'All'
        //  isBreakOnRelationship - add a level per relationship, ie Absa - directors - children
        //     Absa - shareholders - children, etc
        //  isBreakOnRole - break EACH relationship on roles (if there are any), ie
        //     Absa - Executive - children, Absa Non-Executive - children (if relationship = Director)
        //  startID - id in graphData where parent starts (the rest of the rest has this as their parent)
        this.globalFunctionService.printToConsole(this.constructor.name, 'constructGraphDataForUnit', '@Start');
    
        // Reset the data which will now be created
        let localGraphData = [];

        // Add Parent
        localGraphData.push(
            {
                "id": startID,
                "name": this.constructNodeName(this.selectedParentNode)
            });
        
        // There are 4 scenarios, each one creating a different amount of sub-levels
        
        // 1. parent - children
        if (!isBreakOnRelationship  &&  !isBreakOnRole) {
            this.childDataAll = this.distinctChildrenNodes(
                'All',
                parentNodeName, 
                [this.selectedRelationship],
                'All'
            );

            // Get visible children
            this.childDataVisible = this.childDataAll.splice(0, this.visibleNumberChildren)

            // Add Children
            let childCnt: number = 0;
            this.childDataVisible.forEach(child => {

                // Increment
                childCnt = childCnt + 1;

                // Add
                localGraphData.push({
                    id: startID + childCnt,
                    name: this.constructNodeName(child),
                    parent: startID
                });
            });

            // Return
            return localGraphData;
            
        };

        // 2. parent - roles - children
        if (!isBreakOnRelationship  &&  isBreakOnRole) {
            let relationshipRoles: string[] = this.distinctRelationshipRoles(this.selectedRelationship);
            
            // Reduce amount shown
            relationshipRoles = relationshipRoles.splice(0, this.visibleNumberChildren);

            let roleCnt: number = 0;

            relationshipRoles.forEach(role => {

                // Increment
                roleCnt = roleCnt + 1;

                // Add Role
                this.graphData.push({
                    id: startID + roleCnt,
                    name: this.constructNodeName(role),
                    parent: startID
                });

                // Get children for parent - role
                this.childDataAll = this.distinctChildrenNodes(
                    '...', 
                    parentNodeName, 
                    relationships,
                    role
                );

                // Get visible children
                this.childDataVisible = this.childDataAll.splice(0, this.visibleNumberChildren)

                // Add Children
                let childCnt: number = 0;

                this.childDataVisible.forEach(child => {

                    // Increment
                    childCnt = childCnt + 1;

                    // Add
                    this.graphData.push({
                        id: startID + roleCnt + childCnt,
                        name: this.constructNodeName(child),
                        parent: startID + roleCnt
                    });
                });
            })
    
            // Return
            return localGraphData;

        };

TODO - make distinctRelationships on optional nodeName as well,

        // 3. parent - relationship - children
        if (isBreakOnRelationship  &&  !isBreakOnRole) {
            let relationships: string[] = this.distinctRelationships(parentNodeName)

            relationships.forEach(rel => {
                this.childDataAll = this.distinctChildrenNodes(
                    'All', 
                    parentNodeName, 
                    [rel],
                    'All'
                );
            })
    
        };

        // 4. parent - relationship - roles - children
        if (isBreakOnRelationship  &&  isBreakOnRole) {
            let relationships: string[] = this.distinctRelationships(parentNodeName)
            let relationshipRoles: string[] = this.distinctRelationshipRoles(this.selectedRelationship);
            relationships.forEach(rel => {

                relationshipRoles.forEach(role => {
                    this.childDataAll = this.distinctChildrenNodes(
                        '...', 
                        parentNodeName, 
                        [rel],
                        role
                    );
                })
            })    
        };




       
    }

    nav2WalkInPath(
        parent: string,
        nodeName: string,
        relationship: string,
        iterationCount: number,
        path: string[]
    ) {
        // Walk to next node in path for given info (parent, node, ect)
        this.globalFunctionService.printToConsole(this.constructor.name, 'nav2WalkInPath', '@Start');

        // Stop if Cyclical
        if (path.indexOf(nodeName) >= 0) {
            path.push(nodeName + '*');
            console.log('xx nav2WalkInPath @END path', iterationCount, path);
            path = [];
            return;
        };

        // Add this node to path
        path.push(nodeName);

        // Increment
        iterationCount = iterationCount + 1;

        // Get next nodes in path, Left and Right, excluding the Parent
        let nextInPath: string[] = [];
        let leftInPath: string[] = this.networkGraph2
            .filter(nw => nw.leftNodeName === nodeName && nw.rightNodeName != parent)
            .map(nw => nw.rightNodeName);
        let rightInPath: string[] = this.networkGraph2
            .filter(nw => nw.rightNodeName === nodeName && nw.leftNodeName != parent)
            .map(nw => nw.leftNodeName);

        // Combine
        nextInPath = leftInPath.concat(rightInPath);

        // Log
        console.log('xx nav2WalkInPath related nodeName', nodeName, ' (from ', parent, ')', nextInPath, 'path:', path)

        if (nextInPath.length == 0) {
            console.log('xx nav2WalkInPath @END path', iterationCount, path)
            path = [];
        };

        // Call recursively, starting a new path
        nextInPath.forEach(child => {
            let newPath: string[] = [];
            path.forEach(c => newPath.push(c));
            this.nav2WalkInPath(nodeName, child, relationship, iterationCount, newPath)
        });
    }

    distinctNodeTypes(): string[] {
        // Return distinct array of Nodes Type for the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctNodeTypes', '@Start');

        // Find unique Nodes
        let leftNodeTypes: string[] = this.networkRelationships.map(x => x.leftNodeType);
        let rightNodeTypes: string[] = this.networkRelationships.map(x => x.rightNodeType);
        let uniqueNodeTypes: string[] = leftNodeTypes.concat(rightNodeTypes);
        uniqueNodeTypes = this.navUniqifySortNodes(uniqueNodeTypes);

        // Return
        return uniqueNodeTypes;
    }

    distinctNodesPerNodeType(selectedParentNodeType: string): string[] {
        // Return distinct array of Nodes per Node Type for the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctNodesPerNodeType', '@Start');

        // Filter correct Col
        let leftNodeTypes: string[] = this.networkRelationships
            .filter(nr => nr.leftNodeType == selectedParentNodeType)
            .map(nr => nr.leftNodeName);
        let rightNodeTypes: string[] = this.networkRelationships
            .filter(nr => nr.rightNodeType == selectedParentNodeType)
            .map(nr => nr.rightNodeName);
        let nodesPerNodeType = Array.from(new Set(leftNodeTypes.concat(rightNodeTypes)));

        // TODO - fix for Other Than Equal Operator
        // Filter parent Nodes IF a filter active
        if (this.ngParentNodeFilterSelectedFieldName != ''
            &&
            this.ngParentNodeFilterSelectedOperator != '') {
            nodesPerNodeType = nodesPerNodeType.filter(
                x => this.parentNodesFilteredList.indexOf(x) >= 0
            );
        };

        // Make sure it is unique, non-null list
        nodesPerNodeType = this.navUniqifySortNodes(nodesPerNodeType);

        // Return
        return nodesPerNodeType;
    }

    distinctRelationships(
        selectedParentNodeType: string = 'All',
        selectedParentNodeName: string = 'All',
        ): string[] {
        // Return distinct array of Relationships per Node Type for the current Network
        // Filtering is Optional
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctRelationships', '@Start');

        // Fill ParentNode type Dropdown
        let leftRelationships: string[] = this.networkRelationships
            .filter(nr => (
                            (
                                nr.leftNodeType === selectedParentNodeType
                                &&  selectedParentNodeType != 'All'
                            )
                            ||
                            selectedParentNodeType == 'All'
                           )
            )
            .filter(nr => selectedParentNodeName == 'All'
                          ||
                          (
                              selectedParentNodeName != 'All'
                              &&
                              nr.leftNodeName === selectedParentNodeName
                          )
            )
            .filter(nr => nr.relationshipLeftToRight != '')
            .map(nr => nr.relationshipLeftToRight);

        let rightRelationships: string[] = this.networkRelationships
            .filter(nr => (
                            (
                                nr.rightNodeType === selectedParentNodeType
                                &&
                                selectedParentNodeType != 'All'
                            )
                            ||
                            selectedParentNodeType == 'All'
                           )
            )
            .filter(nr => selectedParentNodeName == 'All'
                          ||
                          (
                              selectedParentNodeName != 'All'
                              &&
                              nr.leftNodeName === selectedParentNodeName
                          )
            )
            .filter(nr => nr.relationshipRightToLeft != '')
            .map(nr => nr.relationshipRightToLeft);

        let nodeRelationships: string[] = Array.from(new Set(leftRelationships.concat(rightRelationships)));

        // Make sure it is unique, non-null list
        nodeRelationships = this.navUniqifySortNodes(nodeRelationships);

        // Return
        return nodeRelationships;
    }

    distinctChildrenNodes(
        selectedParentNodeType: string, 
        selectedParentNodeName: string,
        selectRelationships: string[],
        selectedRelationshipFilterRole: string
        ): string[] {
        // Return distinct array of Children for the selected Info
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctChildrenNodes', '@Start');

        // Fill ParentNode type Dropdown
        let leftChildren: string[] = this.networkRelationships
            .filter(nr => (selectedParentNodeType === 'All'
                           ||
                           (
                                selectedParentNodeType != 'All'
                                &&
                                nr.leftNodeType === selectedParentNodeType)
                           )
            )
            .filter(nr => selectedParentNodeName == 'All'
                          ||
                          (
                              selectedParentNodeName != 'All'
                              &&
                              nr.leftNodeName === selectedParentNodeName
                          )
            )
            .filter(nr => ( 
                            selectRelationships.length == 1
                            &&
                            selectRelationships[0] == 'All'
                          )
                          ||
                          selectRelationships.indexOf(nr.relationshipLeftToRight) >= 0
            )
            .filter(nr => selectedRelationshipFilterRole === 'All'
                          ||
                          (
                              selectedRelationshipFilterRole != 'All'
                              &&
                              nr.relationshipProperty === selectedRelationshipFilterRole
                          )
                )
            .filter(nr => nr.rightNodeName != '')
            .map(nr => nr.rightNodeName);

        let rightChildren: string[] = this.networkRelationships
            .filter(nr => (selectedParentNodeType === 'All'
                           ||
                           (
                                selectedParentNodeType != 'All'
                                &&
                                nr.rightNodeType === selectedParentNodeType)
                           )
            )
            .filter(nr => selectedParentNodeName === 'All'
                          ||
                          (
                              this.selectedParentNode != 'All'
                              &&
                              nr.rightNodeName === selectedParentNodeName
                          )
            )
            .filter(nr => ( 
                            selectRelationships.length === 1
                            &&
                            selectRelationships[0] === 'All'
                          )
                          ||
                          selectRelationships.indexOf(nr.relationshipRightToLeft) >= 0
            )
            .filter(nr => selectedRelationshipFilterRole === 'All'
                          ||
                          (
                              selectedRelationshipFilterRole != 'All'
                              &&
                              nr.relationshipProperty === selectedRelationshipFilterRole
                          )
            )
            .filter(nr => nr.leftNodeName != '')
            .map(nr => nr.leftNodeName);

        let nodeChildren: string[] = Array.from(new Set(leftChildren.concat(rightChildren)));

        // Filter if a Child filter is active
        if (this.childNodesFilteredList.length > 0) {
                nodeChildren = nodeChildren.filter(c => this.childNodesFilteredList.indexOf(c) >= 0);
        };

        // Make sure it is unique, non-null list
        nodeChildren = this.navUniqifySortNodes(nodeChildren);

        // Return
        return nodeChildren;
    }










    // distinctChildrenNodes(
    //     selectedParentNodeType: string, 
    //     selectedParentNode: string
    //     ): string[] {
    //     // Return distinct array of Children for the selected Info
    //     this.globalFunctionService.printToConsole(this.constructor.name, 'distinctChildrenNodes', '@Start');

    //     // Fill ParentNode type Dropdown
    //     let leftChildren: string[] = this.networkRelationships
    //         .filter(nr => (
    //                         nr.leftNodeType === selectedParentNodeType
    //                         &&
    //                         (
    //                             selectedParentNode == 'All'
    //                             ||
    //                             (
    //                                 selectedParentNode != 'All'
    //                                 &&
    //                                 nr.leftNodeName === selectedParentNode
    //                             )
    //                         )
    //                         &&
    //                         nr.relationshipLeftToRight === this.selectedRelationship
    //                         &&
    //                         (
    //                             this.ngSelectedRelationshipFilterRole === ''
    //                             ||
    //                             (
    //                                 this.ngSelectedRelationshipFilterRole != ''
    //                                 &&
    //                                 nr.relationshipProperty === this.ngSelectedRelationshipFilterRole
    //                             )
    //                         )
    //                        )
    //         )
    //         .filter(nr => nr.rightNodeName != '')
    //         .map(nr => nr.rightNodeName);

    //     let rightChildren: string[] = this.networkRelationships
    //         .filter(nr => (
    //                         nr.rightNodeType === selectedParentNodeType
    //                         &&
    //                         (
    //                             selectedParentNode == 'All'
    //                             ||
    //                             (
    //                                 this.selectedParentNode != 'All'
    //                                 &&
    //                                 nr.rightNodeName === selectedParentNode
    //                             )
    //                         )
    //                         &&
    //                         nr.relationshipRightToLeft === this.selectedRelationship
    //                         &&
    //                         (
    //                             this.ngSelectedRelationshipFilterRole === ''
    //                             ||
    //                             (
    //                                 this.ngSelectedRelationshipFilterRole != ''
    //                                 &&
    //                                 nr.relationshipProperty === this.ngSelectedRelationshipFilterRole
    //                             )
    //                         )
    //                        )
    //         )
    //         .filter(nr => nr.leftNodeName != '')
    //         .map(nr => nr.leftNodeName);

    //     let nodeChildren: string[] = Array.from(new Set(leftChildren.concat(rightChildren)));

    //     // Filter if a Child filter is active
    //     if (this.childNodesFilteredList.length > 0) {
    //             nodeChildren = nodeChildren.filter(c => this.childNodesFilteredList.indexOf(c) >= 0);
    //     };

    //     // Make sure it is unique, non-null list
    //     nodeChildren = this.navUniqifySortNodes(nodeChildren);

    //     // Return
    //     return nodeChildren;
    // }





    distinctRelationshipRoles(selectedRelationship: string): string[] {
        // Return distinct array of Nodes per Relationship Roles for a given Relationship
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctRelationshipRoles', '@Start');

        // Filter on Relationship
        let leftRelationships: string[] = this.networkRelationships
            .filter(nr => nr.relationshipLeftToRight === selectedRelationship)
            .map(nr => nr.relationshipProperty);
        let rightRelationships: string[] = this.networkRelationships
            .filter(nr => nr.relationshipRightToLeft === selectedRelationship)
            .map(nr => nr.relationshipProperty);
        let nodeRelationships: string[] = leftRelationships.concat(rightRelationships);

        // Make unique & Sort
        nodeRelationships = this.navUniqifySortNodes(nodeRelationships);

        // Return
        return nodeRelationships;
    }

    distinctNodeProperties(selectedParentNodeType: string = null): string[] {
        // Return distinct array of Properties per Node Type for the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'distinctNodeProperties', '@Start');

        // Fill ParentNode type Dropdown
        let nodeProperties: string[] = this.networkProperties
            .filter(np => (
                    (
                        selectedParentNodeType == null
                        ||
                        (
                            selectedParentNodeType != null
                            &&
                            np.nodeType === selectedParentNodeType
                        )
                    )
                    &&  np.propertyKey != ''
            ))
            .map(np => np.propertyKey);

        // Make sure it is unique, non-null list
        nodeProperties = this.navUniqifySortNodes(nodeProperties);
        console.log('xx nodeProperties', nodeProperties)
        // Return
        return nodeProperties;
    }

    constructNodeName(nodeName: string): string {
        // Return constructed Node Name to show in the graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'constructNodeName', '@Start');

        let returnNodeName: string = nodeName;
        if (this.selectedAdditonalProperty != '') {

            let nodePropertyIndex: number = this.networkProperties
                .findIndex(np => np.nodeName == nodeName
                           &&
                           np.propertyKey == this.selectedAdditonalProperty
                );

            if (nodePropertyIndex >= 0) {
                returnNodeName = returnNodeName + ' ('
                    + this.networkProperties[nodePropertyIndex].propertyValue + ')';
            };
        };

        // Return
        return returnNodeName;
    }

    navUniqifySortNodes(
        inputNodes: string[],
        uniqify: boolean = true,
        sort: boolean = false
    ): string[] {
        // Make given array of nodes unique and sort, if so requested
        // this.globalFunctionService.printToConsole(this.constructor.name, 'navUniqifySortNodes', '@Start');

        // Make sure it is a non-null list
        if (inputNodes == null || inputNodes == undefined) {
            inputNodes = [];
        };

        // Make sure it is unique, non-null list
        if (uniqify) {
            inputNodes = Array.from(new Set(inputNodes));
        };

        // No undefined
        inputNodes.filter(n => n != undefined);

        // Sort
        inputNodes.sort((a, b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });

        // Return
        return inputNodes;

    }

    // navSingleRoute(navStartNode: string, parentNode: string, relationship: string, path: string[]) {
    //     // Recursive process to get a single route for a start Node
    //     this.globalFunctionService.printToConsole(this.constructor.name, 'navSingleRoute', '@Start');

    //     console.log('xx navSingleRoute START node-parent-path', this.navRecursionCounter, navStartNode, parentNode, path)

    //     // Safety check
    //     this.navRecursionCounter = this.navRecursionCounter + 1;
    //     if (this.navRecursionCounter > this.navMaxRecursion) {
    //         console.log('xx navSingleRoute navMaxRecursion EXCEEDED')
    //         return;
    //     };

    //     // Add to path
    //     path.push(navStartNode);
    //     this.navVisitedNodes.push(navStartNode);

    //     // Get children of start Node in the SAME path
    //     let childrenOfStartNode: string[] = this.navNextNodesInPath(navStartNode, relationship);
    //     console.log('xx navSingleRoute childrenOfStartNode', childrenOfStartNode)

    //     // Create new path, minus navStartNode and parentNode
    //     let newChildrendOfStartNode: string [] = [];
    //     childrenOfStartNode.forEach(child => {
    //         if (child != navStartNode
    //             &&
    //             child != parentNode
    //             &&
    //             path.indexOf(child) < 0
    //             &&
    //             this.navVisitedNodes.indexOf(child) < 0
    //             ) {
    //             newChildrendOfStartNode.push(child)
    //         };
    //     });
    //     console.log('xx navSingleRoute newChildrendOfStartNode', newChildrendOfStartNode);

    //     // Single, unique route if pathNew is empty
    //     if (newChildrendOfStartNode.length == 0) {
    //         this.singleRoutesArray.push(path);
    //         console.log('xx navSingleRoute ROUTE path', path);
    //         this.navSinglePaths.push(path);
    //         path = [];
    //         return;
    //     };

    //     // Call recursively with new path
    //     newChildrendOfStartNode.forEach(child =>  {
    //         let newPath: string[] = [];
    //         path.forEach(c => newPath.push(c));
    //         console.log('xx newPath', newPath);
    //         this.navSingleRoute(child, navStartNode, relationship, newPath);
    //     });
    // }


    clickParentFilterClear() {
        // Clear the Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickParentFilterClear', '@Start');

        this.ngParentNodeFilterDropdown = [];
        this.ngParentNodeFilterSelectedFieldName = '';
        this.ngParentNodeFilterSelectedOperator = '';
        this.ngParentNodeFilterSelectedValue = '';
        this.parentNodesFilteredList = [];
    }

    clickParentFilterSave() {
        // Add Parent Filter, and create list of parent nodes as a result of the filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickParentFilterSave', '@Start');

        // TODO - for now, only one filter by choice.  In future, consider more than one as
        // data structurs allows it

        // Validation
        if (this.ngParentNodeFilterSelectedFieldName === '') {
            this.parentFilterErrorMessage = 'The field name is compulsory';
            return;
        };
        if (this.ngParentNodeFilterSelectedOperator) {
            this.parentFilterErrorMessage = 'The operator is compulsory';
            return;
        };
        if (this.ngParentNodeFilterSelectedValue) {
            this.parentFilterErrorMessage = 'The value is compulsory';
            return;
        };

        // Create Filtered List of ParentNodes
        // TODO - do other operator than ==
        this.parentNodesFilteredList = this.networkProperties
            .filter(np => np.propertyKey === this.ngParentNodeFilterSelectedFieldName
                &&
                np.propertyValue === this.ngParentNodeFilterSelectedValue)
            .map(np => np.nodeName);

        // Make unique
        this.parentNodesFilteredList = Array.from(new Set(this.parentNodesFilteredList));

        // Filter Parent Nodes
        this.ngParentNodeFilterDropdown = this.ngParentNodeFilterDropdown
            .filter(pn => this.parentNodesFilteredList.indexOf(pn) >= 0
            );

    }

    clickRelationshipFilterClear() {
        // Clear the Relationship Filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickRelationshipFilterClear', '@Start');

        this.ngSelectedRelationshipFilterRole = '';
        this.relationshipsFilteredList = [];
    }

    clickRelationshipFilterSave() {
        // Add Relationship Filter, and create list of relationships as a result of the filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickRelationshipFilterSave', '@Start');

        // TODO - for now, only one filter by choice.  In future, consider more than one as
        // data structurs allows it

        // Validation
        if (this.ngSelectedRelationshipFilterRole === '') {
            this.relationshipFilterErrorMessage = 'The field name is compulsory';
            return;
        };

        // Create Filtered List of ParentNodes
        // TODO - do other operator than ==
        let lefRelationshipsFilteredList = this.networkRelationships
            .filter(nr => nr.relationshipLeftToRight === this.selectedRelationship
                          &&
                          nr.relationshipProperty === this.ngSelectedRelationshipFilterRole
            )
            .map(nr => nr.relationshipLeftToRight);
        let rightRelationshipsFilteredList = this.networkRelationships
            .filter(nr => nr.relationshipRightToLeft === this.selectedRelationship
                          &&
                          nr.relationshipProperty === this.ngSelectedRelationshipFilterRole
            )
            .map(nr => nr.relationshipRightToLeft);
        this.relationshipsFilteredList = lefRelationshipsFilteredList
            .concat(rightRelationshipsFilteredList);

        // Make unique
        this.relationshipsFilteredList = Array.from(new Set(this.relationshipsFilteredList));

    }

    clickChildFilterClear() {
        // Clear Parent Filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickChildFilterClear', '@Start');

        this.ngChildNodeFilterDropdown = [];
        this.ngChildNodeFilterSelectedFieldName = '';
        this.ngChildNodeFilterSelectedOperator = '';
        this.ngChildNodeFilterSelectedValue = '';
        this.ngChildFilterShowTop = '';
        this.ngChildFilterSortFieldName = '';
        this.childNodesFilteredList = [];
    }

    clickChildFilterSave() {
        // Add Parent Filter, and create list of parent nodes as a result of the filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickChildFilterSave', '@Start');

        // TODO - for now, only one filter by choice.  In future, consider more than one as
        // data structurs allows it

        // Validation
        if (this.ngChildNodeFilterSelectedFieldName === '') {
            this.childFilterErrorMessage = 'The field name is compulsory';
            return;
        };
        if (this.ngChildNodeFilterSelectedOperator) {
            this.childFilterErrorMessage = 'The operator is compulsory';
            return;
        };
        if (this.ngChildNodeFilterSelectedValue) {
            this.childFilterErrorMessage = 'The value is compulsory';
            return;
        };

        // Create Filtered List of Child Nodes
        // TODO - do other operator than ==
        this.childNodesFilteredList = this.networkProperties
            .filter(np => np.propertyKey === this.ngChildNodeFilterSelectedFieldName
                &&
                np.propertyValue === this.ngChildNodeFilterSelectedValue)
            .map(np => np.nodeName);

        // Make unique
        this.childNodesFilteredList = Array.from(new Set(this.childNodesFilteredList));

        // Filter Child Nodes
        this.ngChildNodeFilterDropdown = this.ngChildNodeFilterDropdown
            .filter(pn => this.childNodesFilteredList.indexOf(pn) >= 0
            );

    }

    clickNetworkSummaryView() {
        // Show a summary of the current Network
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickNetworkSummaryView', '@Start');
        let networkIndex: number = this.ngNetworks.findIndex(nw => nw.id == this.selectedNetworkID);

        // Set view
        this.selectedView = 'SummaryView';

        this.checkShowGraph();

    }

    clickDefaultView() {
        // Show the default view = tree with children
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDefaultView', '@Start');

        // Refresh the graph
        this.selectedView = 'DefaultView'

        this.checkShowGraph();
    }

    clickCommonParentView() {
        // Show the Common Node view = list of all nodes where 2 or more children have the
        // same parent
        // Example: which directors of Absa are also direcytors of another company
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCommonParentView', '@Start');

        // Refresh the graph
        this.selectedView = 'CommonParentView';

        this.graphData = [];
        this.graphData.push(
            {
                "id": 1,
                "name": "CommonParent"
            });
        this.graphData.push({
            id: 2,
            name: "Absa",
            parent: 1
        });
        this.graphData.push({
            id: 3,
            name: "Johnathon (Director)",
            parent: 2
        });
        this.graphData.push({
            id: 4,
            name: "Martha (Director)",
            parent: 2
        });
        this.graphData.push({
            id: 5,
            name: "Bidvest",
            parent: 1
        });
        this.graphData.push({
            id: 6,
            name: "Johnathon (Shareholder)",
            parent: 5
        });
        this.graphData.push({
            id: 7,
            name: "Olivia (CFO)",
            parent: 5
        });

        this.graphTitle = 'Common parents for any Directors of Absa';

        // Dimension it
        this.graphHeight = 300; //this.localWidget.graphLayers[0].graphSpecification.height;
        this.graphWidth = 300; //this.localWidget.graphLayers[0].graphSpecification.width;

        // Create specification
        this.specification = this.globalVariableService.createVegaSpec(
            this.localWidget,
            this.graphHeight,
            this.graphWidth,
            this.showSpecificGraphLayer,
            0
        );

        // Load the data
        this.specification['data'][0]['values'] = this.graphData;
        this.specification['title'] = this.graphTitle;

        console.log('xx summ', this.graphHeight, this.graphWidth, this.graphData, this.specification)
        // TODO - decide if we need to update the Widget Data too ?
        // this.specification.graphLayers[0].graphSpecification.data = this.graphData;

        // Render in DOM
        let view = new View(parse(this.specification));
        view.addEventListener('click', function (event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            console.log('xx CLICK CommParnt', item, item.datum.text, datumClick.name);
            this.selectedParentNodeType = 'Person';
            this.selectedParentNode = 'Koos';
            this.selectedRelationship = 'Director-Of';
        });
        view.renderer('svg')
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();

    }

    clickCommonNodeView() {
        // Show the Common Parent view = list of all nodes where any children has the
        // same parent as a specified node
        // Example: which directors of Absa are children of the same node as Jannie Mouton
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCommonNodeView', '@Start');

        // Refresh the graph
        this.selectedView = 'CommonNodeView'

        this.graphData = [];
        this.graphData.push(
            {
                "id": 1,
                "name": "CommonNode"
            });
        this.graphData.push({
            id: 2,
            name: "Steinhoff",
            parent: 1
        });
        this.graphData.push({
            id: 3,
            name: "Johnathon (Shareholder)",
            parent: 2
        });
        this.graphData.push({
            id: 4,
            name: "Mandy (Shareholder)",
            parent: 2
        });
        this.graphData.push({
            id: 5,
            name: "Aspen",
            parent: 1
        });
        this.graphData.push({
            id: 6,
            name: "Johnathon (Shareholder)",
            parent: 5
        });
        this.graphData.push({
            id: 7,
            name: "Gareth (Director)",
            parent: 5
        });

        this.graphTitle = 'Common parents for Johnathon... & Directors of Absa';

        // Dimension it
        this.graphHeight = 300; //this.localWidget.graphLayers[0].graphSpecification.height;
        this.graphWidth = 300; //this.localWidget.graphLayers[0].graphSpecification.width;

        // Create specification
        this.specification = this.globalVariableService.createVegaSpec(
            this.localWidget,
            this.graphHeight,
            this.graphWidth,
            this.showSpecificGraphLayer,
            0
        );

        // Load the data
        this.specification['data'][0]['values'] = this.graphData;
        this.specification['title'] = this.graphTitle;

        console.log('xx summ', this.graphHeight, this.graphWidth, this.graphData, this.specification)
        // TODO - decide if we need to update the Widget Data too ?
        // this.specification.graphLayers[0].graphSpecification.data = this.graphData;

        // Render in DOM
        let view = new View(parse(this.specification));
        view.addEventListener('click', function (event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            console.log('xx CLICK CommNod', item, item.datum.text, datumClick.name);
            this.selectedParentNodeType = 'Person';
            this.selectedParentNode = 'Koos';
            this.selectedRelationship = 'Director-Of';
        });
        view.renderer('svg')
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();
    }

    clickDistanceView() {
        // Show the Distance view = sub tree with all nodes between a given child and
        // a specified node
        // Example: how are directors of Absa related to Markus Jooste
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDistanceView', '@Start');

        // Refresh the graph
        this.selectedView = 'DistanceView'

        this.graphData = [];
        this.graphData.push(
            {
                "id": 1,
                "name": ""
            });
        this.graphData.push({
            id: 2,
            name: "Johnathan",
            parent: 1
        });
        this.graphData.push({
            id: 3,
            name: "BarlowWorld",
            parent: 2
        });
        this.graphData.push({
            id: 4,
            name: "Meridith (Director)",
            parent: 3
        });
        this.graphData.push({
            id: 5,
            name: "Meridith (Shareholder)",
            parent: 3
        });
        this.graphData.push({
            id: 6,
            name: "Mandy",
            parent: 1
        });
        this.graphData.push({
            id: 7,
            name: "Bidvest",
            parent: 6
        });
        this.graphData.push({
            id: 8,
            name: "Plumblink (Subsidiary)",
            parent: 7
        });
        this.graphData.push({
            id: 9,
            name: "Meridith (CEO)",
            parent: 8
        });

        this.graphTitle = 'Distance: Meridith... to some Directors of Absa';

        // Dimension it
        this.graphHeight = 300; //this.localWidget.graphLayers[0].graphSpecification.height;
        this.graphWidth = 400; //this.localWidget.graphLayers[0].graphSpecification.width;

        // Create specification
        this.specification = this.globalVariableService.createVegaSpec(
            this.localWidget,
            this.graphHeight,
            this.graphWidth,
            this.showSpecificGraphLayer,
            0
        );

        // Load the data
        this.specification['data'][0]['values'] = this.graphData;
        this.specification['title'] = this.graphTitle;

        console.log('xx summ', this.graphHeight, this.graphWidth, this.graphData, this.specification)
        // TODO - decide if we need to update the Widget Data too ?
        // this.specification.graphLayers[0].graphSpecification.data = this.graphData;

        // Render in DOM
        let view = new View(parse(this.specification));
        view.addEventListener('click', function (event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            console.log('xx CLICK Dist', item, item.datum.text, datumClick.name);
            this.selectedParentNodeType = 'Person';
            this.selectedParentNode = 'Koos';
            this.selectedRelationship = 'Director-Of';
        });
        view.renderer('svg')
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();

    }

    clickNodeTypeView() {
        // Show the Node Type View = full tree with all children of a given node type
        // Example: all beneficiary shareholders of company and subsidiaries
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickNodeTypeView', '@Start');

        // Refresh the graph
        // this.selectedView = 'NodeTypeView'

        this.graphData = [];
        this.graphData.push(
            {
                "id": 1,
                "name": ""
            });
        this.graphData.push({
            id: 2,
            name: "Absa",
            parent: 1
        });
        this.graphData.push({
            id: 3,
            name: "Glenis (Shareholder",
            parent: 2
        });
        this.graphData.push({
            id: 4,
            name: "Old Mutual",
            parent: 1
        });
        this.graphData.push({
            id: 5,
            name: "Nedbank",
            parent: 4
        });
        this.graphData.push({
            id: 6,
            name: "Zaheer",
            parent: 5
        });
        this.graphData.push({
            id: 7,
            name: "Capitec",
            parent: 5
        });
        this.graphData.push({
            id: 8,
            name: "Bernard (Shareholder)",
            parent: 7
        });

        this.graphTitle = 'Beneficiary Shareholders of Top 40 companies';

        // Dimension it
        this.graphHeight = 300; //this.localWidget.graphLayers[0].graphSpecification.height;
        this.graphWidth = 300; //this.localWidget.graphLayers[0].graphSpecification.width;

        // Create specification
        this.specification = this.globalVariableService.createVegaSpec(
            this.localWidget,
            this.graphHeight,
            this.graphWidth,
            this.showSpecificGraphLayer,
            0
        );

        // Load the data
        this.specification['data'][0]['values'] = this.graphData;
        this.specification['title'] = this.graphTitle;

        console.log('xx summ', this.graphHeight, this.graphWidth, this.graphData, this.specification)
        // TODO - decide if we need to update the Widget Data too ?
        // this.specification.graphLayers[0].graphSpecification.data = this.graphData;

        // Render in DOM
        let view = new View(parse(this.specification));
        view.addEventListener('click', function (event, item) {
            // Needs separate object, else item.datum.text is sometimes undefined.
            let datumClick: any = item.datum;
            console.log('xx CLICK NodTyp', item, item.datum.text, datumClick.name);
            this.selectedParentNodeType = 'Person';
            this.selectedParentNode = 'Koos';
            this.selectedRelationship = 'Director-Of';
        });
        view.renderer('svg')
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();

    }

    clickAdditionalLevel() {
        // Add an additional level to the default view, based on a property of the relationship
        // that has already been defined.
        // Example: if false, company  -> Directors
        //          if true,  company  ->  Ex/Non-Exec  ->  Directors
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickAdditionalLevel', '@Start');

        this.showRoles = !this.showRoles;

        this.checkShowGraph();
    }

    clickPageLeft() {
        // Move to the previous page of children
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPageLeft', '@Start');
    }

    clickPageRight() {
        // Move to the next page of children
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPageRight', '@Start');

    }



    // Temp dummy data for demo - must be done via DB
    tempCreateDummyData() {


        // Populate the watchList - TODO via DB
        let watchListNew: NavigatorWatchList =
        {
            id: 1,
            userID: 'JannieI',
            nodeType: 'Company',
            nodes: ['Absa', 'PSG']
        };
        this.watchList.push(watchListNew);


        // Build the Array for the network - Nodes, properties, proximity / relationships
        this.networkGraph2 = [];
        this.networkGraph2.push(
            {
                id: 1,
                networkID: 1,
                leftNodeID: 1,
                leftNodeType: "Company",
                leftNodeName: "A",
                relationshipLeftToRight: "Subsidiary",
                relationshipRightToLeft: "Owned By",
                rightNodeID: 3,
                rightNodeType: "Company",
                rightNodeName: "C",
                relationshipProperty: ""
            }
        );
        this.networkGraph2.push(
            {
                id: 2,
                networkID: 1,
                leftNodeID: 1,
                leftNodeType: "Company",
                leftNodeName: "A",
                relationshipLeftToRight: "Director",
                relationshipRightToLeft: "Director Of",
                rightNodeID: 5,
                rightNodeType: "Person",
                rightNodeName: "x",
                relationshipProperty: "Executive"
            }
        );
        this.networkGraph2.push(
            {
                id: 3,
                networkID: 1,
                leftNodeID: 3,
                leftNodeType: "Company",
                leftNodeName: "C",
                relationshipLeftToRight: "Director",
                relationshipRightToLeft: "Director Of",
                rightNodeID: 7,
                rightNodeType: "Person",
                rightNodeName: "z",
                relationshipProperty: ""
            }
        );
        this.networkGraph2.push(
            {
                id: 4,
                networkID: 1,
                leftNodeID: 3,
                leftNodeType: "Company",
                leftNodeName: "C",
                relationshipLeftToRight: "Subsidiary",
                relationshipRightToLeft: "Owned By",
                rightNodeID: 4,
                rightNodeType: "Company",
                rightNodeName: "D",
                relationshipProperty: ""
            }
        );
        this.networkGraph2.push(
            {
                id: 5,
                networkID: 1,
                leftNodeID: 4,
                leftNodeType: "Company",
                leftNodeName: "D",
                relationshipLeftToRight: "Director",
                relationshipRightToLeft: "Director Of",
                rightNodeID: 8,
                rightNodeType: "Person",
                rightNodeName: "a",
                relationshipProperty: ""
            }
        );
        this.networkGraph2.push(
            {
                id: 6,
                networkID: 1,
                leftNodeID: 4,
                leftNodeType: "Company",
                leftNodeName: "D",
                relationshipLeftToRight: "Director",
                relationshipRightToLeft: "Director Of",
                rightNodeID: 6,
                rightNodeType: "Person",
                rightNodeName: "y",
                relationshipProperty: ""
            }
        );
    };

}

