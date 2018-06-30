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

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { DatasourcePermission }       from './models';

@Component({
    selector: 'data-share',
    templateUrl: './data.share.component.html',
    styleUrls: ['./data.share.component.css']
})
export class DatasourceShareComponent implements OnInit {

    @Output() formDataShareClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    showTypeDatasource: boolean = false;
    datasourcePermissions: DatasourcePermission[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getDatasourcePermissions().then (dp => {
            this.datasourcePermissions = dp;
            this.datasourcePermissions.forEach(tdsp => {
                tdsp.name = this.globalVariableService.datasources.filter(
                    ds => ds.id == tdsp.datasourceID)[0].name;
            })
            console.warn('xx this.datasourcePermissions', this.datasourcePermissions)
        });

    }

    clickToggleEdit(id: number, $event) {
        // User dblclicked Edit - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleEdit', '@Start');

        let index: number = -1;
        for(var i = 0; i < this.datasourcePermissions.length; i++) {
            if (this.datasourcePermissions[i].id == id) {
                this.datasourcePermissions[i].canEdit = ! this.datasourcePermissions[i].canEdit;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveDatasourcePermissions(
                this.datasourcePermissions[index])
                ;
        };
    }

    clickDeletePermission(id: number, index: number) {
        // Delete the selected Permission
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDeletePermission', '@Start');

        this.datasourcePermissions.splice(index,1);
        this.globalVariableService.deleteDatasourcePermission(id);
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDataShareClosed.emit(action);
    }
}
