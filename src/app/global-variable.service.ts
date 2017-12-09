// Service to provide global variables
import { BehaviorSubject }            from 'rxjs/BehaviorSubject';
import { Injectable }                 from '@angular/core';

// Our Models
import { currentDatasource }          from './models';
import { currentTransformation }      from './models';
import { dashboard }                  from './models';
import { datasource }                 from './models';
import { CSScolor }                   from './models';
import { transformation }             from './models';
import { field }                      from './models';
import { checkpoint }                 from './models';
import { fieldMetadata }              from './models';
import { dashboardTag }               from './models';
import { dashboardTheme }             from './models';
import { dashboardSchedule }          from './models';
import { dashboardComment }           from './models';
import { dataQualityIssue}            from './models'

// import { CanvasUser }                 from './model.user';

// Constants - to be replaced with DB access
const dataQualityIssues: dataQualityIssue[] =
[ 
    {
        id: 1,
        status: 'Open',
        name: 'Missing Data',
        type: 'Data',
        description: 'bla-bla-bla',
        loggedBy: 'AstonK',
        loggedOn: '2017/01/01',
        solvedBy: '',
        solvedOn: '',
    },
    {
        id: 2,
        status: '',
        name: 'Invalid Entries',
        type: 'Process',
        description: 'bla-bla-bla',
        loggedBy: 'BarbaraR',
        loggedOn: '2017/01/01',
        solvedBy: 'GordonL',
        solvedOn: '2017/01/01',
    }
]

const dashboardComments: dashboardComment[] =
[
    {
        id: 1,
        dashboardID: 42,
        comment: 'We need to investigate the quality of the data',
        creator: 'GerhardD',
        createdOn: '2017/01/01'
    }
]

const dashboardSchedules: dashboardSchedule[] =
[
    {
        id: 1,
        dashboardID: 12,
        name: 'Daily',
        description: '7 Days a weeks, forever',
        repeats: 'Daily',
        repeatsEvery: 1,
        repeatsOn: null,
        repeatsFor: null,
        startsOn: '2017/01/01',
        EndsNever: true,
        EndsAfter: null,
        EndsOn: null
    },
    {
        id: 2,
        dashboardID: 12,
        name: 'Weekday (M-F)',
        description: 'Mon-Fri for 10 times',
        repeats: 'Weekday (M-F)',
        repeatsEvery: null,
        repeatsOn: null,
        repeatsFor: null,
        startsOn: '2017/01/01',
        EndsNever: null,
        EndsAfter: 10,
        EndsOn: null
    },
    {
        id: 3,
        dashboardID: 12,
        name: 'Weekly',
        description: 'Every second week on Tuesday and Friday',
        repeats: 'Weekly',
        repeatsEvery: 2,
        repeatsOn: ['Tuesday, Friday'],
        repeatsFor: 'DayOfWeek',
        startsOn: '2017/01/01',
        EndsNever: true,
        EndsAfter: 0,
        EndsOn: ''
    },
    {
        id: 4,
        dashboardID: 12,
        name: 'Monthly',
        description: 'Quarterly for one year',
        repeats: 'Monthly',
        repeatsEvery: 3,
        repeatsOn: null,
        repeatsFor: null,
        startsOn: '2017/01/01',
        EndsNever: null,
        EndsAfter: null,
        EndsOn: '2017/12/31'
    },
    {
        id: 1,
        dashboardID: 12,
        name: 'Yearly',
        description: 'Annualy forever',
        repeats: 'Yearly',
        repeatsEvery: 1,
        repeatsOn: null,
        repeatsFor: null,
        startsOn: '2017/01/01',
        EndsNever: true,
        EndsAfter:null,
        EndsOn: null
    }
];

const dashboardThemes: dashboardTheme[] =
[
    {
        id: 1,
        name: 'Theme basic',
        description: 'bla-bla-bla'
    }
]

const dashboardTags: dashboardTag[] =
[
    {
        id: 1,
        dashboardID: 12,
        tag: 'budget2017'
    },
    {
        id: 2,
        dashboardID: 12,
        tag: 'savings'
    },
    {
        id: 3,
        dashboardID: 12,
        tag: 'projectAard'
    }
];

const checkpoints: checkpoint[] =
[
    {
        id: 1,
        dashboardID: 1,
        name: 'Rough layut',
        comment: ''
    },
    {
        id: 2,
        dashboardID: 1,
        name: 'Costing done',
        comment: 'Still need to confirm figures'
    }
]

const dashboards: dashboard[] =
[
    {
        id: 1,
        state: 'WIP',
        name: 'Market Overview',
        description: 'Economic indicator summary',
        nrWidgets: 1,
        nrRecords: 12,
        creator: 'JonathanS',
        nrTimesOpened: 4
    },
    {
        id: 2,
        state: 'Pending',
        name: 'Costing Summary',
        description: 'Costing Summary',
        nrWidgets: 1,
        nrRecords: 12,
        creator: 'JonathanS',
        nrTimesOpened: 0
    },
    {
        id: 3,
        state: 'Complete',
        name: 'Home Budget',
        description: 'Home Budget',
        nrWidgets: 1,
        nrRecords: 12,
        creator: 'JonathanS',
        nrTimesOpened: 21
    },
    {
        id: 4,
        state: 'Complete',
        name: 'Bitcoin sales',
        description: 'Bitcoin sales',
        nrWidgets: 1,
        nrRecords: 12,
        creator: 'JonathanS',
        nrTimesOpened: 4
    },
    {
        id: 5,
        state: 'Pending',
        name: 'Cycling routes',
        description: 'Cycling routes',
        nrWidgets: 1,
        nrRecords: 12,
        creator: 'JonathanS',
        nrTimesOpened: 14
    }
];

const backgroundcolors: CSScolor[] =
[
    {
        name: 'transparent'
    },
    {
        name: 'beige'
    },
    {
        name: 'white'
    }
];

const currentDatasources: currentDatasource [] = [];

const datasources: currentDatasource [] =
[
    {
        id: 1,
        name: 'My Expenses',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 2,
        name: 'Bitcoin Trades',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 3,
        name: 'My Budget',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 4,
        name: 'Bicycle Sales',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 5,
        name: 'Bond Valuation',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 6,
        name: 'Auditors',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 7,
        name: 'Student Marks',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 8,
        name: 'Security Breaches',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 9,
        name: 'Milk Proteins',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 10,
        name: 'Malaria Cases',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 11,
        name: 'Investments',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 12,
        name: 'Bridge Maintenance',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 13,
        name: 'Parts in storage',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 14,
        name: 'Customer Complaints',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 15,
        name: 'Issues',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 16,
        name: 'Tickets',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    },
    {
        id: 17,
        name: 'Clothing lines',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

    },
    {
        id: 18,
        name: 'Shoe Sales',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange',
        createdBy: 'JohnM',
        createdOn: '2017/01/01',
        refreshedBy: 'JohnM',
        refreshedOn: '2017/01/01',
        parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    }

];

const fields: field[] =
[
    {
        id: 1,
        name: 'DateTrade',
        type: 'Date',
        format: '',
        filter: '',
        calc: '',
        order: 'Asc 1'
    },
    {
        id: 2,
        name: 'Share',
        type: 'Text',
        format: '',
        filter:  '',
        calc:  '',
        order: ''
    },
    {
        id: 3,
        name: 'Volume',
        type: 'Number',
        format: 'Integer',
        filter: '',
        calc:  '',
        order: ''
    },
    {
        id: 4,
        name: 'Value',
        type: 'Number',
        format: '2 decimals',
        filter: '> 1m',
        calc: 'Volume * 10',
        order: ''
    }
];

const fieldsMetadata: fieldMetadata[] =
[
    {
        name: 'DateTrade',
        type: 'Date',
        description: 'Date on which trade when through trading system',
        keyField: false,
        explainedBy: ''
    },
    {
        name: 'Share',
        type: 'String',
        description: 'Name of share (stock) that traded, ie Anglo American plc',
        keyField: true,
        explainedBy: 'Bar of new Listings per Month'
    },
    {
        name: 'Volume',
        type: 'Number',
        description: 'Number of instruments traded.  Single counted, excluding BR, YT trade types.',
        keyField: false,
        explainedBy: 'Pie of Trades by Broker'
    },
    {
        name: 'Value',
        type: 'Number',
        description: 'Value in Rand of the instruments traded, based on Volume and Price.',
        keyField: false,
        explainedBy: 'Custom Query: TradeAttribution'
    }
];

// Old, Full list
    // const transformations: transformation[] =
    // [
    //     {
    //         id: 1,
    //         category: 'Column-level',
    //         name: 'FormatDate',
    //         description: '(columnName, new-date-format, old-date-format): if the columnName is blank, Tributary will try to convert all date fields.  The format can be YYYYMMDD, MMMMM, M/D/Y, etc.'
    //     },
    //     {
    //         id: 2,
    //         category: 'Column-level',
    //         name: 'FillBlanks',
    //         description: '(columnName, newValue)'
    //     },
    //     {
    //         id: 3,
    //         category: 'Column-level',
    //         name: 'FillNull',
    //         description: '(columnName, newValue)'
    //     },
    //     {
    //         id: 4,
    //         category: 'Column-level',
    //         name: 'FillBlankAndNull',
    //         description: '(columnName, newValue)'
    //     },
    //     {
    //         id: 5,
    //         category: 'Column-level',
    //         name: 'ReplaceNumbers',
    //         description: '(columnName, from, to, newValue)'
    //     },
    //     {
    //         id: 6,
    //         category: 'Column-level',
    //         name: 'ReplaceString',
    //         description: '(columnName, oldValue, newValue)'
    //     },
    //     {
    //         id: 7,
    //         category: 'Column-level',
    //         name: 'AppendColumn',
    //         description: '(newColumnName, dataType, fillValue)'
    //     },
    //     {
    //         id: 8,
    //         category: 'Column-level',
    //         name: 'Columns',
    //         description: '([column1, column2, ...]) to be returned'
    //     },
    //     {
    //         id: 9,
    //         category: 'Column-level',
    //         name: 'Field Filters',
    //         description: '([ {columnX, operator, value} ]'
    //     },
    //     {
    //         id: 10,
    //         category: 'Column-level',
    //         name: 'CalcColumn',
    //         description: '(newColumnName, columnOne, columnTwo, Operator, fillValue)'
    //     },
    //     {
    //         id: 11,
    //         category: 'Column-level',
    //         name: 'Substring',
    //         description: '(columnName, startPosition, length)'
    //     },
    //     {
    //         id: 12,
    //         category: 'Column-level',
    //         name: 'LeftTrim',
    //         description: '(columnName)'
    //     },
    //     {
    //         id: 13,
    //         category: 'Column-level',
    //         name: 'RightTrim',
    //         description: '(columnName)'
    //     },
    //     {
    //         id: 14,
    //         category: 'Column-level',
    //         name: 'Trim',
    //         description: '(columnName), which combines LeftTrim and RightTrim'
    //     },
    //     {
    //         id: 15,
    //         category: 'Column-level',
    //         name: 'RightSubstring',
    //         description: '(columnName, startPosition, length) is similar to Substring, but startPosition is counted from the right.'
    //     },
    //     {
    //         id: 16,
    //         category: 'Column-level',
    //         name: 'DatePart',
    //         description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second'
    //     },
    //     {
    //         id: 17,
    //         category: 'Column-level',
    //         name: 'Concatenate',
    //         description: '(columnNameOne, ColumnNameTwo)'
    //     },
    //     {
    //         id: 18,
    //         category: 'Column-level',
    //         name: 'ConcatenateColumn',
    //         description: '(columnName, preString, postString) will append strings to the front or back of a column'
    //     },
    //     {
    //         id: 19,
    //         category: 'Column-level',
    //         name: 'Calculate',
    //         description: '(columnName, expression) where operation is a valid math expression, for example ‘+ 2’, or ‘/1000’.  The [columnName] (in square brackets) can be part of the expression, say [columnName] * 1.14'
    //     },
    //     {
    //         id: 20,
    //         category: 'Column-level',
    //         name: 'FormatNumber',
    //         description: '(columnName, formatString) where formatString is a valid string in Excel (VBA) format.  For example, ‘#0.00’, R#0,00’, ‘0000’'
    //     },
    //     {
    //         id: 21,
    //         category: 'Column-level',
    //         name: 'AddLatitude',
    //         description: '(reference-columnName, new-columnName), add a new column with latitude, based on the information in the reference-columnName'
    //     },
    //     {
    //         id: 22,
    //         category: 'Column-level',
    //         name: 'AddLongitude',
    //         description: '(reference-columnName, new-columnName), add a new column with longitude, based on the information in the reference-columnName'
    //     },
    //     {
    //         id: 100,
    //         category: 'Table-level',
    //         name: 'Pivot',
    //         description: '(row-heading, column-heading, operator, data-heading) '
    //     },
    //     {
    //         id: 101,
    //         category: 'Table-level',
    //         name: 'Transpose',
    //         description: 'turning rows into columns and vice versa'
    //     },
    //     {
    //         id: 102,
    //         category: 'Table-level',
    //         name: 'FormatTable',
    //         description: '(format), where format = json, csv, tsv, Excel, ADO, etc.'
    //     },
    // ];
// End of list

const transformationsFormat: transformation[] =
[
    {
        id: 1,
        category: 'Column-level',
        name: 'FormatDate',
        description: '(columnName, new-date-format, old-date-format): if the columnName is blank, Tributary will try to convert all date fields.  The format can be YYYYMMDD, MMMMM, M/D/Y, etc.'
    },
    {
        id: 16,
        category: 'Column-level',
        name: 'DatePart',
        description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second'
    },
    {
        id: 20,
        category: 'Column-level',
        name: 'FormatNumber',
        description: '(columnName, formatString) where formatString is a valid string in Excel (VBA) format.  For example, ‘#0.00’, R#0,00’, ‘0000’'
    }
];

const currentTransformations: currentTransformation[] =
[
    {
        id: 1,
        category: 'Format',
        name: 'FillBlanks',
        description: 'bla-bla-bla',
        fieldID: 231,
        fieldName: 'Region',
        parameters: ""
    }
]

const transformationsFill: transformation[] =
[
    {
        id: 2,
        category: 'Column-level',
        name: 'FillBlanks',
        description: '(columnName, newValue)'
    },
    {
        id: 3,
        category: 'Column-level',
        name: 'FillNull',
        description: '(columnName, newValue)'
    },
    {
        id: 4,
        category: 'ColucurrentTransformationsmn-level',
        name: 'FillBlankAndNull',
        description: '(columnName, newValue)'
    }
];

const transformationsGeo: transformation[] =
[
    {
        id: 21,
        category: 'Column-level',
        name: 'AddLatitude',
        description: '(reference-columnName, new-columnName), add a new column with latitude, based on the information in the reference-columnName'
    },
    {
        id: 22,
        category: 'Column-level',
        name: 'AddLongitude',
        description: '(reference-columnName, new-columnName), add a new column with longitude, based on the information in the reference-columnName'
    }
];

const transformationsReplace: transformation[] =
[
    {
        id: 5,
        category: 'Column-level',
        name: 'ReplaceNumbers',
        description: '(columnName, from, to, newValue)'
    },
    {
        id: 6,
        category: 'Column-level',
        name: 'ReplaceString',
        description: '(columnName, oldValue, newValue)'
    }
];

const transformationsAddColumn: transformation[] =
[
    {
        id: 7,
        category: 'Column-level',
        name: 'AppendColumn',
        description: '(newColumnName, dataType, fillValue)'
    },
    {
        id: 10,
        category: 'Column-level',
        name: 'CalcColumn',
        description: '(newColumnName, columnOne, columnTwo, Operator, fillValue)'
    },
    {
        id: 17,
        category: 'Column-level',
        name: 'Concatenate',
        description: '(columnNameOne, ColumnNameTwo)'
    }
];

const transformationsTrim: transformation[] =
[
    {
        id: 12,
        category: 'Column-level',
        name: 'LeftTrim',
        description: '(columnName)'
    },
    {
        id: 13,
        category: 'Column-level',
        name: 'RightTrim',
        description: '(columnName)'
    },
    {
        id: 14,
        category: 'Column-level',
        name: 'Trim',
        description: '(columnName), which combines LeftTrim and RightTrim'
    }
];

const transformationsPortion: transformation[] =
[
    {
        id: 11,
        category: 'Column-level',
        name: 'Substring',
        description: '(columnName, startPosition, length)'
    },
    {
        id: 15,
        category: 'Column-level',
        name: 'RightSubstring',
        description: '(columnName, startPosition, length) is similar to Substring, but startPosition is counted from the right.'
    },
    {
        id: 16,
        category: 'Column-level',
        name: 'DatePart',
        description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second'
    },
    {
        id: 18,
        category: 'Column-level',
        name: 'ConcatenateColumn',
        description: '(columnName, preString, postString) will append strings to the front or back of a column'
    },
];

const dataServer: datasource[] =
[
    {
        id: 1,
        name: 'World Indices',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'SP Companies*',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Stock prices TEMP',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Trades per Year',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Bond volume trades',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Trades by Trade Type',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'YTD Expenditure by Cost Center',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Headcount',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Customer List',
        type: 'Xls File',
        description: ''
    }
];

const dataRecent: datasource[] =
[
    {
        id: 1,
        name: 'CPI figures',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'GDP by Country',
        type: 'Xls File',
        description: ''
    }
];

const dataSample: datasource[] =
[
    {
        id: 1,
        name: 'Bicycle trips in Rome',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Vega Airport Dataset',
        type: 'Xls File',
        description: ''
    },
    {
        id: 1,
        name: 'Test1',
        type: 'Xls File',
        description: ''
    }
];

@Injectable()
export class GlobalVariableService {
    dashboardTags: dashboardTag[] = dashboardTags;
    checkpoints: checkpoint[] = checkpoints;
    dashboards: dashboard[] = dashboards;
    currentTransformations: currentTransformation[] = currentTransformations;
    backgroundcolors: CSScolor[] = backgroundcolors;
    currentDatasources: currentDatasource[] = currentDatasources;
    datasources: currentDatasource[] = datasources;
    dataQualityIssues: dataQualityIssue[] = dataQualityIssues;
    transformationsFormat: transformation[] = transformationsFormat;
    fields: field[] = fields;
    fieldsMetadata: fieldMetadata[] = fieldsMetadata;
    dataServer: datasource[] = dataServer;
    dataRecent: datasource[] = dataRecent;
    dataSample: datasource[] = dataSample;
    dashboardThemes: dashboardTheme[] = dashboardThemes;
    dashboardSchedules: dashboardSchedule[] = dashboardSchedules;
    dashboardComments: dashboardComment[] = dashboardComments;
    
    isFirstTimeCanvas: boolean = true;
    isFirstTimeDashboard = new BehaviorSubject<boolean>(true);
    presentation = new BehaviorSubject<boolean>(false);
    presentationMsg: boolean = true;
    showGrid = new BehaviorSubject<boolean>(false);
    xlOpenGetDataWizard: boolean = false;                          // Open/Not the Get Data Wizard
    // Company related variables
    // companyName: string = 'Clarity Analytics';                  // Optional, set in SystemConfig
    // companyLogo: string = '';                                   // Optional file name, set in SystemConfig

    // System-wide related variables, set at Installation
    // systemConfigurationID: number = -1;
    // backendName: string = 'Eazl';
    // backendUrl: string = '';                                    // RESTi url, set in SystemConfig
    // defaultDaysToKeepResultSet: number = 1;                     // Optional, set in SystemConfig
    // frontendName: string = 'Canvas';
    // maxRowsDataReturned: number = 1000000;                      // Optional, set in SystemConfig
    // maxRowsPerWidgetGraph: number = 1;                          // Optional, set in SystemConfig
    // systemTitle: string = 'Canvas';

    // Current User
    // canvasUser = new BehaviorSubject<CanvasUser>(null);
    // isAuthenticatedOnEazl: boolean = false;        // True if authenticated

    // This session
    // showSystemConfigButtons: boolean = true;       // Menu option called = True: SystemConfiguration, False: System Info
    // sessionDateTimeLoggedin: string = '';
    // sessionDashboardTabID: number = null;          // Tab ID to load when form opens, -1 = none
    sessionDebugging: boolean = false;
    sessionLogging: boolean = false;
    // sessionLoadOnOpenDashboardID: number = null;   // Dashboard to load when form opens, 0 = none
    // sessionLoadOnOpenDashboardName: string = '';   // Dashboard to load when form opens, '' = none

    // At startup
    // startupDashboardID: number = 0;                             // Dashboard to load @start, 0 = none
    // startupDashboardTabID: number = 0;                          // Tab ID to load @start, -1 = none
    // startupMessageToShow: string = '';                          // Message to show at start

    // Environment
    // testEnvironmentName: string = '';                           // Spaces = in PROD

    // Dirtiness of system (local) data: True if dirty (all dirty at startup)
    // dirtyDataTextAlignDropdown: boolean = true;
    // dirtyDataBorderDropdown: boolean = true;
    // dirtyDataBoxShadowDropdown: boolean = true;
    // dirtyDataBackgroundImageDropdown: boolean = true;
    // dirtyDataDashboardTab: boolean = true;
    // dirtyDataCanvasMessage: boolean = true;
    // dirtyDataCanvasMessageRecipient: boolean = true;
    // dirtyDataDashboardTag: boolean = true;
    // dirtyDataDashboardTagMembership: boolean = true;
    // dirtyDataDashboard: boolean = true;
    // dirtyDataDatasource: boolean = true;
    // dirtyDataFilter: boolean = true;
    // dirtyDataFontSizeDropdown: boolean = true;
    // dirtyDataFontWeightDropdown: boolean = true;
    // dirtyDataGraphType: boolean = true;
    // dirtyDataGridSizeDropdown: boolean = true;
    // dirtyDataGroup: boolean = true;
    // dirtyDataImageSourceDropdown: boolean = true;
    // dirtyDataPackageTask: boolean = true;
    // dirtyDataReport: boolean = true;
    // dirtyDataReportWidgetSet: boolean = true;
    // dirtyDataReportHistory: boolean = true;
    // dirtyDataSystemConfiguration: boolean = true;
    // dirtyDataTextMarginDropdown: boolean = true;
    // dirtyDataTextPaddingDropdown: boolean = true;
    // dirtyDataTextPositionDropdown: boolean = true;
    // dirtyDataWidget: boolean = true;
    // dirtyDataWidgetTemplate: boolean = true;
    // dirtyDataWidgetType: boolean = true;
    // dirtyDataUser: boolean = true;

    // System & operation config
    // averageWarningRuntime: number = 0;
    // defaultWidgetConfiguration: string = '';
    // dashboardIDStartup: number = null;
    // defaultReportFilters: string = '';
    // environment: string = '';
    // frontendColorScheme: string = '';
    // growlSticky: boolean = false;
    // growlLife: number = 3000;
    // gridSize: number = 3;
    // snapToGrid: boolean = true;

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
    // lastBoxShadow: SelectedItem =
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

    private messageSource = new BehaviorSubject<string>("default message");
    currentMessage = this.messageSource.asObservable();
    menuCreateDisabled = new BehaviorSubject<boolean>(false);

    constructor() { }

    changeMessage(message: string) {
        console.log('changeMessage', message)
        this.messageSource.next(message)
    }

    changeMenuCreateDisabled(value: boolean) {
        this.menuCreateDisabled.next(value);
    }
}