export interface Test {
   results: (boolean | number)[];

   TP?: number;
   TN?: number;
   FP?: number;
   FN?: number;

   characteristics?: {
      ac: number;
      se: number;
      sp: number;
      ppv: number;
      npv: number;
      lrPositive: number;
      lrNegative: number;
      distance?: number;
   };

   optimum?: {
      cutoff?: number;
      distance?: number;
      se?: number;
      sp?: number;
   };

   chartData?: any;
   chartDataItem?: any;
}

export interface NewSample {
   control: boolean;
   testsResults: boolean[];
}

export interface Strategy {
   id?: number;
   name?: string;
   paramsBounds?: ParameterWithBounds[];
}

export interface ParameterWithBounds extends Parameter {
   minBound: number;
   maxBound: number;
}

export interface Parameter {
   code: string;
   name: string;
   minAllowed: number;
   maxAllowed: number;
}

export interface Period {
   name: string;

   strategy1: Strategy;
   strategy2: Strategy;

   periodData?: {
      EUr: [number, number],
      EU1: [number, number],
      EU2: [number, number]
   };
}
