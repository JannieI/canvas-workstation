/*
 * Copyright Clarity Analytics.  All rights reserved
 *
 * Main Module, with menu
 */

// Angular
import { BrowserAnimationsModule }    from "@angular/platform-browser/animations";
import { BrowserModule }              from '@angular/platform-browser';
import { FormsModule }                from '@angular/forms';
import { NgModule }                   from '@angular/core';
import { ROUTING }                    from "./app.routing";
import { HttpClientModule }           from '@angular/common/http';

// Clarity Framework
import { ClarityModule }              from 'clarity-angular';

// Own Components
import { CaDatagridComponent }        from './ca.datagrid.component';
import { ColourPickerComponent }      from './colour.picker.component';

import { AppComponent }               from './app.component';
import { LandingComponent }           from './landing.component';

import { DashboardNewComponent }      from './dashboard.new.component';
import { DashboardOpenComponent }     from './dashboard.open.component';
import { DashboardSaveComponent }     from './dashboard.save.component';
import { DashboardSaveAsComponent }   from './dashboard.saveas.component';
import { DashboardDiscardComponent }  from './dashboard.discard.component';
import { DashboardRenameComponent }   from './dashboard.rename.component';
import { DashboardSnapshotsComponent }      from './dashboard.snapshots.component';
import { DashboardDescriptionComponent }    from './dashboard.description.component';
import { DashboardShareComponent }    from './dashboard.share.component';
import { DashboardTagsComponent }     from './dashboard.tags.component';
import { DashboardThemeComponent }    from './dashboard.theme.component';
import { DashboardTemplateComponent } from './dashboard.template.component';
import { DashboardScheduleComponent } from './dashboard.schedule.component';
import { DashboardScheduleEditComponent }   from './dashboard.scheduleEdit.component';
import { DashboardDeleteComponent }   from './dashboard.delete.component';
import { DashboardDeleteBulkComponent }     from './dashboard.deleteBulk.component';
import { DashboardCommentsComponent } from './dashboard.comments.component';
import { DashboardPrintComponent }    from './dashboard.print.component';
import { DashboardTabComponent }      from './dashboard.tab.component';
import { DashboardHelpComponent }     from './dashboard.help.component';
import { DashboardTreeviewComponent } from './dashboard.treeview.component';
import { DashboardImportComponent }   from './dashboard.import.component';
import { DashboardExportComponent }   from './dashboard.export.component';
import { DashboardSubscribeComponent }         from './dashboard.subscribe.component';
import { DashboardDataQualityComponent }       from './dashboard.dataquality.component';
import { DashboardUsagestatsComponent }        from './dashboard.usagestats.component';

import { WidgetEditorComponent }      from './widget.editor.component';
import { WidgetCheckpointsComponent } from './widget.checkpoints.component';
import { WidgetLinksComponent }       from './widget.links.component';
import { WidgetExpandComponent }      from './widget.expand.component';
import { WidgetExportComponent }      from './widget.export.component';
import { WidgetDeleteComponent }      from './widget.delete.component';
import { WidgetSingleComponent }      from './widget.single.component';
import { WidgetContainerComponent }   from './widget.container.component';
import { WidgetTitleComponent }       from './widget.title.component';
import { WidgetRefreshComponent }     from './widget.refresh.component';
import { WidgetAnnotationsComponent } from './widget.annotations.component';
import { WidgetDescriptionComponent } from './widget.description.component';

import { TableSingleComponent }       from './table.single.component';
import { TableEditorComponent }       from './table.editor.component';
import { TableDeleteComponent }       from './table.delete.component';

import { SlicerSingleComponent }      from './slicer.single.component';
import { SlicerEditorComponent }      from './slicer.editor.component';
import { SlicerDeleteComponent }      from './slicer.delete.component';

import { ShapeEditComponent }         from './shape.editor.component';
import { ShapeDeleteComponent }       from './shape.delete.component';

import { DataDirectFileComponent }    from './data.direct.file.component';
import { DataDirectQueryBuilderComponent }  from './data.direct.queryBuilder.component';
import { DataDirectSQLEditorComponent }      from './data.direct.sqlEditor.component';
import { DataDirectNoSQLComponent }   from './data.direct.Nosql.component';
import { DataDirectServiceComponent } from './data.direct.service.component';
import { DataDirectWebComponent }     from './data.direct.web.component';
import { DataDirectImportComponent }  from './data.direct.import.component';
import { DataDirectExportComponent }  from './data.direct.export.component';

import { DataManagedConnectionComponent }    from './data.managed.connection.component';
import { DataManagedQueryBuilderComponent }  from './data.managed.queryBuilder.component';
import { DataManagedSQLEditorComponent }     from './data.managed.sqlEditor.component';
import { DataManagedGraphQLEditorComponent } from './data.managed.graphqlEditor.component';
import { DataManagedOverlayEditorComponent } from './data.managed.overlayEditor.component';
import { DataManagedNoSQLEditorComponent }   from './data.managed.noSqlEditor.component';
import { DataManageDataQualityComponent }    from './data.managed.dataQuality.component';
import { DataManageDataOwnershipComponent }  from './data.managed.dataOwnership.component';
import { DataManagedDataDictionaryComponent } from './data.managed.dataDictionary.component';
import { DataManagedBusGlossaryComponent }    from './data.managed.busGlossary.component';

import { DataTransformationComponent }       from './data.transformation.component';
import { DataEditDatasourceComponent }       from './data.editDatasource.component';
import { DataPopupComponent }         from './data.popup.component';
import { DataDatasourceOverviewComponent }   from './data.datasourceOverview.component';
import { DataCombinationComponent }   from './data.combination.component';
import { DataCombinationAppendComponent }    from './data.combination.append.component';
import { DatasourceShareComponent }   from './data.share.component';
import { DataDictionaryComponent }    from './data.dictionary.component';
import { DataSummaryComponent }       from './data.summary.component';
import { DataDatasourceUsageComponent }      from './data.datasourceUsage.component';
import { DataRefreshOnceComponent }   from './data.refresh.once.component';
import { DataRefreshRepeatComponent }   from './data.refresh.repeat.component';
import { DataDeleteDatasourceComponent }     from './data.deleteDatasource.component';

import { HelpComponent }              from './help.component';

import { CollaborateMessagesComponent }     from './collaborate.messages.component';
import { CollaborateTaskAddComponent }      from './collaborate.taskadd.component';
import { CollaborateTasksComponent }        from './collaborate.tasks.component';
import { CollaborateAuditTrailComponent }   from './collaborate.auditTrail.component';
import { CollaborateSendMessageComponent }  from './collaborate.sendmessage.component';
import { CollaborateSendEmailComponent }    from './collaborate.sendemail.component';
import { CollaborateMessageContentComponent }   from './collaborate.messageContent.component';

import { UserPaletteButtonBarComponent}         from './user.palette.buttonbar.component';
import { LoginComponent}              from './login.component';
import { MyProfileComponent }         from './myprofile.component';
import { PreferencesComponent }       from './preferences.component';
import { MyPermissionsComponent }     from './mypermissions.component';
import { UsersComponent }             from './users.component';
import { GroupsComponent }            from './groups.component';
import { SystemSettingsComponent }    from './systemsettings.component';
import { LogoutComponent}             from './logout.component';

import { WidgetTablistComponent }     from './widget.tablist.component';

import { PipeFilterDSType }           from './pipe.filter.component';


// Our Services
import { AuthGuard }                  from './authguard.service';
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Testing
import { DelayDirective }             from './test.delay.directive';
import { MyNgIfDirective }            from './test.ngif.directive';
import { StatusbarComponent }         from './statusbar.component';

@NgModule({
    declarations: [

        CaDatagridComponent,
        ColourPickerComponent,

        AppComponent,
        HelpComponent,
        LandingComponent,

        DashboardNewComponent,
        DashboardOpenComponent,
        DashboardSaveComponent,
        DashboardSaveAsComponent,
        DashboardDiscardComponent,
        DashboardRenameComponent,
        DashboardSnapshotsComponent,
        DashboardShareComponent,
        DashboardDescriptionComponent,
        DashboardTagsComponent,
        DashboardThemeComponent,
        DashboardTemplateComponent,
        DashboardScheduleComponent,
        DashboardScheduleEditComponent,
        DashboardDeleteComponent,
        DashboardDeleteBulkComponent,
        DashboardCommentsComponent,
        DashboardPrintComponent,
        DashboardTabComponent,
        DashboardHelpComponent,
        DashboardTreeviewComponent,
        DashboardSubscribeComponent,
        DashboardImportComponent,
        DashboardExportComponent,
        DashboardDataQualityComponent,
        DashboardUsagestatsComponent,

        DataDirectFileComponent,
        DataDirectQueryBuilderComponent,
        DataDirectSQLEditorComponent,
        DataDirectNoSQLComponent,
        DataDirectServiceComponent,
        DataDirectWebComponent,
        DataDirectImportComponent,
        DataDirectExportComponent,
        DataPopupComponent,
        DataManagedConnectionComponent,
        DataManagedQueryBuilderComponent,
        DataManagedSQLEditorComponent,
        DataManagedGraphQLEditorComponent,
        DataManagedOverlayEditorComponent,
        DataManagedNoSQLEditorComponent,

        DataTransformationComponent,
        DataEditDatasourceComponent,
        DataCombinationComponent,
        DataCombinationAppendComponent,
        DatasourceShareComponent,
        DataDictionaryComponent,
        DataSummaryComponent,
        DataManageDataQualityComponent,
        DataManageDataOwnershipComponent,
        DataManagedDataDictionaryComponent,
        DataManagedBusGlossaryComponent,
        DataDatasourceOverviewComponent,
        DataDatasourceUsageComponent,
        DataRefreshOnceComponent,
        DataRefreshRepeatComponent,
        DataDeleteDatasourceComponent,

        WidgetEditorComponent,
        WidgetCheckpointsComponent,
        WidgetLinksComponent,
        WidgetExpandComponent,
        WidgetExportComponent,
        WidgetDeleteComponent,
        WidgetSingleComponent,
        WidgetContainerComponent,
        WidgetTitleComponent,
        WidgetRefreshComponent,
        WidgetAnnotationsComponent,
        WidgetDescriptionComponent,

        TableSingleComponent,
        TableEditorComponent,
        TableDeleteComponent,
        
        SlicerSingleComponent,
        SlicerEditorComponent,
        SlicerDeleteComponent,

        ShapeEditComponent,
        ShapeDeleteComponent,

        CollaborateMessagesComponent,
        CollaborateTaskAddComponent,
        CollaborateTasksComponent,
        CollaborateAuditTrailComponent,
        CollaborateSendMessageComponent,
        CollaborateSendEmailComponent,
        CollaborateMessageContentComponent,

        MyProfileComponent,
        PreferencesComponent,
        MyPermissionsComponent,
        UserPaletteButtonBarComponent,
        UsersComponent,
        GroupsComponent,
        SystemSettingsComponent,
        LoginComponent,
        LogoutComponent,

        DelayDirective,
        MyNgIfDirective,

        PipeFilterDSType,
        StatusbarComponent,

        WidgetTablistComponent,


    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        ROUTING,
        HttpClientModule,
    ],
    providers: [

        // Our Services
        AuthGuard,
        GlobalVariableService,
        GlobalFunctionService,

    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
