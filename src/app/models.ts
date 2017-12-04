// ALL models (schema) are kept here

// Datasource
export class datasource {
    id: number;
    name: string;
    type: string;
    description;
}

export class currentDatasource {
    id: number;
    name: string;
    type: string;
    description: string;
    createdBy: string;
    createdOn: string;
    refreshedBy: string;
    refreshedOn;
    parameters: string;
}

// Dashboard
export class dashboard {
    id: number;
    state: string;
    name: string;
    description: string;
    nrWidgets: number;
    nrRecords: number;
    creator: string;
    nrTimesOpened: number;
}

export class dashboardTag {
    id: number;
    dashboardID: number;
    tag: string;
}

export class dashboardTheme {
    id: number;
    name: string;
    description: string;
}

export class checkpoint {
    id: number; 
    dashboardID: number;
    name: string;
    comment: string;
}

export class dashboardSchedule {
    id: number;
    dashboardID: number;
    name: string;
    description: string;
    repeats: string;       // Daily, Weekday (M-F), Weekly, Monthly, Yearly
    repeatsEvery: number;  //   X                     X        X        X
    repeatsOn: string[];   // Weekly:  (M, T, W, ... S)
    repeatsFor: string;    // Monthly: DayOfWeek, DayOfMonth
    startsOn: string;      // Date
    EndsNever: boolean;
    EndsAfter: number;     // n times
    EndsOn: string;        // Date
}

// CSS Color
export class CSScolor {
    name: string;
}

export class transformation {
    id: number;
    category: string;
    name: string;
    description: string;
}

export class currentTransformation {
    id: number;
    category: string;
    name: string;
    description: string;
    fieldID: number;
    fieldName: string;
    parameters: string;
}

export class field {
    id: number;
    name: string;
    type: string;
    format: string;
    filter: string;
    calc: string;
    order: string;
}

export class fieldMetadata{
    name: string;
    type: string;
    description: string;
    keyField: boolean;
    explainedBy: string
}
