export type SalesEntry = {
  id: string;
  date: Date;
  salesValue: number;
  ticketAverage: number;
  productsPerService: number;
};

export type Seller = {
  id: string;
  name: string;
  salesValue: number;
  ticketAverage: number;
  pa: number;
};

export type GoalLevels = {
  metinha: number;
  meta: number;
  metona: number;
  lendaria: number;
};

export type Goals = {
  salesValue: GoalLevels;
  ticketAverage: GoalLevels;
  pa: GoalLevels;
};
