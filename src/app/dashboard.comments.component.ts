/*
 * Shows form with comments for the current Dashboard, or current Widget
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { CanvasComment }              from './models';

@Component({
    selector: 'dashboard-comments',
    templateUrl: './dashboard.comments.component.html',
    styleUrls: ['./dashboard.comments.component.css']
})
export class DashboardCommentsComponent implements OnInit {

    @Output() formDashboardCommentsClosed: EventEmitter<string> = new EventEmitter();
    @Input() selectedWidgetID: number;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if (
            (event.code === 'Enter'  ||  event.code === 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickAdd();
            return;
        };
    }

    canvasComments: CanvasComment[] = [];
    commentText: string;
    datagridPaginationSize: number = 6;
    editLast: boolean = false;
    errorMessage: string = '';
    headerText: string;
    indexLastRecord: number;
    message: string = '';
    selectedRow: number = 0;
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Set header
        if (this.selectedWidgetID === -1) {
            this.headerText = 'this Dashboard';
        } else {
            this.headerText = 'the selected Widget';
        };

        // Set the data for the grid
        this.globalVariableService.getResource('canvasComments')
            .then (ca => {
                console.log('COMM ca', ca)
                this.canvasComments = ca.filter( c =>
                    (c.dashboardID === this.globalVariableService.currentDashboardInfo
                            .value.currentDashboardID
                    &&
                    (c.widgetID === this.selectedWidgetID  ||  this.selectedWidgetID === -1) )
                );
                this.indexLastRecord = this.canvasComments.length - 1;
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.comments reading canvasComments: ' + err);
            });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDashboardCommentsClosed.emit(action);
    }

    clickEditComment(index: number, id: number) {
        // Last row can be Edited, so start process
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEditComment', '@Start');

        this.errorMessage = '';
        this.message = '';

        // Validation
        if (this.canvasComments[this.canvasComments.length - 1]['creator'] !=
            this.globalVariableService.currentUser.userID) {
            this.errorMessage = 'Can only edit own comments';
            return;
        };

        this.commentText = this.canvasComments[this.canvasComments.length - 1].comment;
        this.editLast = true;

    }

    clickCancel() {
        // Cancel Editing, go back
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        this.errorMessage = '';
        this.message = '';
        this.commentText = '';
        this.editLast = false;
    }

    clickSave() {
        // Save changes to the last Comment
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.errorMessage = '';
        this.message = '';

        // Validation
        if (this.commentText === '') {
            this.errorMessage = 'Comment cannot be blank';
            return;
        };

        // Update local array
        this.canvasComments[this.canvasComments.length - 1].comment = this.commentText;
        this.commentText = '';
        this.editLast = false;

        this.globalVariableService.saveResource('canvasComments', 
            this.canvasComments[this.canvasComments.length - 1])
                .then(res => {
                    this.message = 'Comment saved';
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in Dashboard.comments saving canvasComments: ' + err);
                });
    
    }

    clickAdd() {
        // Add a new Comment
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        this.errorMessage = '';
        this.message = '';

        // Validation
        if (this.commentText === '') {
            this.errorMessage = 'Comment cannot be blank';
            return;
        };

        // Add
        let dt = new Date();

        let newComment: CanvasComment =
            {
                id: null,
                dashboardID: this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                widgetID: this.selectedWidgetID,
                comment: this.commentText,
                creator: this.globalVariableService.currentUser.userID,
                createdOn: dt
            };

        // Globally and locally
        this.globalVariableService.addResource('canvasComments', newComment)
            .then( data => {

                this.canvasComments.push(data)
                    this.message = 'Comment added';
                    this.commentText = '';
                    this.indexLastRecord = this.canvasComments.length - 1;
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.comments adding canvasComments: ' + err);
            });

    }

    clickRow(index: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }
}