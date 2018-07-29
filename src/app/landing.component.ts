/*
 * Help page, including Recently opened Dashboards
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
	experiencedUser: boolean = true;
	sampleDashboards: Dashboard[];
	showModel: boolean = true;

	constructor(
		private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {

		// Load Startup info:

		// Create DB models and connect
		this.globalVariableService.connectLocalDB().then(i => {
			if (i != '') {
				console.log('Successfuly Connected to localDB in Landing page Constructor');
			} else {
				console.log('Connection to localDB in Landing page FAILED');
			}
		});

		// All Datasources
		this.globalVariableService.getDatasources();

		// Load D
		this.globalVariableService.getDashboards().then(i => {
			// Sample Dashboards
			this.globalVariableService.getDashboardSamples().then(sD => {
				this.sampleDashboards = sD;

				// Recent D
				this.globalVariableService.getDashboardsRecent(
					this.globalVariableService.currentUser.userID
					).then(recD => {
					this.dashboardsRecent = recD.slice(0, 5);

					// Palette buttons for current user
					this.globalVariableService.getPaletteButtonsSelected().then(pBsel =>
						{

							// User has no Buttons selected, which will be the case for new users
							if (pBsel.length == 0) {
								// Load the default ones
								this.globalVariableService.getPaletteButtonBar().then(pb => {
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

									this.globalVariableService.allWithAsync(...promiseArray)
										.then(resolvedData => {

										// Inform subscribers
										this.globalVariableService.currentPaletteButtonsSelected.next(
											this.globalVariableService.currentPaletteButtonsSelected.value
										);
									});

									// // Inform subscribers
									this.globalVariableService.dashboardsRecentBehSubject.next(recD);
								});
							} else {
								pBsel = pBsel.filter(
									s => s.userID == this.globalVariableService.currentUser.userID
								);

								// Inform subscribers
								this.globalVariableService.currentPaletteButtonsSelected
									.next(pBsel);
								this.globalVariableService.dashboardsRecentBehSubject.next(recD);

							};

							// Store for app to use

						}
					);
				});
			});
		});

		// Load System Settings
		this.globalVariableService.getSystemSettings().then(i => {
		});
	}

	ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

		// Get setup info
		this.globalVariableService.getBackgroundColors();

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

		console.warn('xx IDs', dashboardID, dashboardTabID)
		// Cannot open deleted ones
		if (this.dashboardsRecent[index].stateAtRunTime == 'Deleted') {
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
 
		this.globalVariableService.editMode.next(editMode)
        this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenRecentDashboard', dashboardID, dashboardTabID, ''
		);

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit('OpenRecent');
	}

	dblclickDeleteRecent(id: number) {
        // Delete recent record
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDeleteRecent', '@Start');

		// Delete from temp array, refresh
		this.globalVariableService.deleteDashboardRecent(id).then(
			i => {

				let index: number = this.dashboardsRecent.findIndex(dR =>
					dR.id == id
				);
				if (index >= 0) {
					this.dashboardsRecent.splice(index, 1);
				}
		})
	}

	clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formLandingClosed.emit(action);
	}

	clickOpenExisting() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenExisting', '@Start');

		this.globalVariableService.openDashboardFormOnStartup = true;

		this.formLandingClosed.emit('OpenExisting');
	}

	clickOpenNewDashboard() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenNewDashboard', '@Start');

		this.formLandingClosed.emit('New');
	}

}
