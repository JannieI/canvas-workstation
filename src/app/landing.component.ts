/*
 * Landing page, including Add, Open Dashboards, recently used Dashboards and Help
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { PaletteButtonsSelected } 	  from './models';
import { Dashboard } 				  from './models';
import { DashboardRecent } 			  from './models';


@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

	@Output() formLandingClosed: EventEmitter<string> = new EventEmitter();

	// sampleDashboards: Dashboard[] = this.globalVariableService.dashboardsSamples;
	dashboardsRecent: DashboardRecent[];
	errorMessage: string = '';
	gotIt: boolean = false;
	isFirstTimeUser: boolean = false;
	sampleDashboards: Dashboard[];
	showModel: boolean = true;

	constructor(
		private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {

		// Load Startup info:
		// Create DB models and connect
		// this.globalVariableService.connectLocalDB().then(i => {
		// 	if (i != '') {
		// 		console.log('Successfuly Connected to localDB in Landing page Constructor');
		// 	} else {
		// 		console.log('Connection to localDB in Landing page FAILED');
		// 	}
		// });

		// All Datasources
		this.globalVariableService.getResource('datasources');
		this.globalVariableService.getDatasourcePermissions();

		// Load D
		this.globalVariableService.getResource('dashboards')
			.then(readD => {

				// Sample Dashboards - max n, else the landing page overflows
				this.sampleDashboards = readD
					.filter(
						i => (i.isSample)  && i.state === 'Complete'
					)
					.slice(0,5);

				// Set user stuffies
				this.isFirstTimeUser = this.globalVariableService.currentUser.isFirstTimeUser;

				// Recent D
				this.globalVariableService.getDashboardsRecent(
					this.globalVariableService.currentUser.userID)
					.then(recD => {
						this.dashboardsRecent = recD.slice(0, 5);

						this.globalVariableService.getResource('dashboardPermissions').then(dP => {

							// Determine access - different rights can achive View or Edit access
							let accessIDs: number[] = [];
							for (var i = 0; i < this.dashboardsRecent.length; i++) {
								if (this.dashboardsRecent[i].editMode) {

									if (this.globalVariableService.dashboardPermissionCheck(

										this.dashboardsRecent[i].dashboardID, 'caneditright')) {
											accessIDs.push(this.dashboardsRecent[i].dashboardID);
									};

									if (this.globalVariableService.dashboardPermissionCheck(

										this.dashboardsRecent[i].dashboardID, 'canviewandcanedit')) {
											accessIDs.push(this.dashboardsRecent[i].dashboardID);
									};

									if (this.globalVariableService.dashboardPermissionCheck(

										this.dashboardsRecent[i].dashboardID, 'caneditandcandelete')) {
											accessIDs.push(this.dashboardsRecent[i].dashboardID);
									};
								} else {

									if (this.globalVariableService.dashboardPermissionCheck(

										this.dashboardsRecent[i].dashboardID, 'canviewright')) {
											accessIDs.push(this.dashboardsRecent[i].dashboardID);
									};

									if (this.globalVariableService.dashboardPermissionCheck(

										this.dashboardsRecent[i].dashboardID, 'canviewandcanedit')) {
											accessIDs.push(this.dashboardsRecent[i].dashboardID);
									};
								};
							};

							this.dashboardsRecent = this.dashboardsRecent.filter(
								dR => accessIDs.indexOf(dR.dashboardID) >= 0
							);

							// Palette buttons for current user
							this.globalVariableService.getResource('paletteButtonsSelecteds').then(pBsel =>
								{

									pBsel = pBsel.sort( (obj1,obj2) => {
										if (obj1.sortOrderSelected > obj2.sortOrderSelected) {
											return 1;
										};
										if (obj1.sortOrderSelected < obj2.sortOrderSelected) {
											return -1;
										};
										return 0;
									});
			
									// User has no Buttons selected, which will be the case for new users
									if (pBsel.length === 0) {
										// Load the default ones
										this.globalVariableService.getResource('paletteButtonBars').then(pb => {
											let promiseArray = [];

											pb.forEach(p => {
												if (p.isDefault) {
													let newButton: PaletteButtonsSelected = {
															id: null,
															userID: this.globalVariableService.currentUser.userID,
															paletteButtonBarID: p.id,
															mainmenuItem: p.mainmenuItem,
															menuText: p.menuText,
															shape: p.shape,
															size: p.size,
															class: p.class,
															backgroundColor: p.backgroundColor,
															accesskey: p.accesskey,
															sortOrder: p.sortOrder,
															sortOrderSelected: p.sortOrderSelected,
															isDefault: p.isDefault,
															functionName: p.functionName,
															params: p.params,
															tooltipContent: p.tooltipContent,
															isSelected: p.isSelected
													};
													promiseArray.push(
														this.globalVariableService.addPaletteButtonsSelected(newButton)
													);
												};
											});

											Promise.all(promiseArray)
												.then(resolvedData => {
													this.globalVariableService.currentPaletteButtonsSelected.next(
														this.globalVariableService.currentPaletteButtonsSelected.value
													);
												})
												.catch(err => {
													this.errorMessage = 'Error reading Database: ', err;
												});
													
										});
									} else {
										pBsel = pBsel.filter(
											s => s.userID === this.globalVariableService.currentUser.userID
										);

										// Inform subscribers
										this.globalVariableService.currentPaletteButtonsSelected
											.next(pBsel);

									};

									// Store for app to use

								}
							);
						});
					})
					.catch(err => {
						this.errorMessage = 'Error reading Database: ', err;
					});
			})
			.catch(err => {
				this.errorMessage = 'Error reading Database: ', err;
			});

	}

	ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

	}

	ngAfterViewInit() {
        // After
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
	}

	clickOpenSampleDashboard(dashboardID: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenSampleDashboard', '@Start');

		this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenSampleDashboard', dashboardID, -1, ''
		);

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit('OpenSample');
	}

	clickOpenRecentDashboard(
		dashboardID: number,
		dashboardTabID: number,
		editMode: boolean,
		index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenRecentDashboard', '@Start');

		// Cannot open deleted ones
		if (this.dashboardsRecent[index].stateAtRunTime === 'Deleted') {
			this.globalVariableService.showStatusBarMessage(
				{
					message: 'Cannot open deleted Dashboard',
					uiArea: 'StatusBar',
					classfication: 'Warning',
					timeout: 3000,
					defaultMessage: ''
				}
			);
				return;
		};

		// this.globalVariableService.editMode.next(editMode)
        this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenRecentDashboard', dashboardID, dashboardTabID, ''
		);

		// Close modal, and show the Dashboard
		this.globalVariableService.openDashboardFormOnStartup = false;
		this.formLandingClosed.emit('OpenRecent');
	}

	dblclickDeleteRecent(id: number) {
        // Delete recent record
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDeleteRecent', '@Start');

		// Delete from temp array, refresh
		this.globalVariableService.deleteResource('dashboardsRecent', id).then(
			i => {

				let index: number = this.dashboardsRecent.findIndex(dR =>
					dR.id === id
				);
				if (index >= 0) {
					this.dashboardsRecent.splice(index, 1);
				}
		})
	}

	clickClose(action: string) {
        // Close this form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formLandingClosed.emit(action);
	}

	clickOpenExisting() {
        // Open form to select an existing D to open
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenExisting', '@Start');

		this.globalVariableService.openDashboardFormOnStartup = true;

		this.formLandingClosed.emit('OpenExisting');
	}

	clickOpenNewDashboard() {
        // Open form to create a new D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenNewDashboard', '@Start');

		this.formLandingClosed.emit('New');
	}

	clickGotIt(ev: any) {
        // Alter first time user-ness
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGotIt', '@Start');

		this.globalVariableService.currentUser.isFirstTimeUser = !ev.srcElement.checked;
		this.globalVariableService.saveResource(
			'canvasUsers', 
			this.globalVariableService.currentUser
		);
	}

}
