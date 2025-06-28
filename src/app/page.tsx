'use client';

import { useState } from 'react';
import { SalesEntry } from '@/lib/types';
import type { AnalyzeSalesTrendsOutput } from '@/ai/flows/analyze-sales-trends';
import Header from '@/components/header';
import SalesForm from '@/components/sales-form';
import SalesTable from '@/components/sales-table';
import SalesChart from '@/components/sales-chart';
import AiInsights from '@/components/ai-insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Ticket } from 'lucide-react';

const initialSalesData: SalesEntry[] = [
  { id: '1', date: new Date('2024-07-01'), salesValue: 2345, ticketAverage: 85.50, productsPerService: 2.1 },
  { id: '2', date: new Date('2024-07-02'), salesValue: 2890, ticketAverage: 92.30, productsPerService: 2.5 },
  { id: '3', date: new Date('2024-07-03'), salesValue: 2500, ticketAverage: 88.00, productsPerService: 2.3 },
  { id: '4', date: new Date('2024-07-04'), salesValue: 3150, ticketAverage: 105.00, productsPerService: 2.8 },
  { id: '5', date: new Date('2024-07-05'), salesValue: 3300, ticketAverage: 110.00, productsPerService: 3.0 },
  { id: '6', date: new Date('2024-07-06'), salesValue: 3500, ticketAverage: 112.50, productsPerService: 3.1 },
  { id: '7', date: new Date('2024-07-07'), salesValue: 3200, ticketAverage: 108.75, productsPerService: 2.9 },
  { id: '8', date: new Date('2024-07-08'), salesValue: 3800, ticketAverage: 115.00, productsPerService: 3.2 },
  { id: '9', date: new Date('2024-07-09'), salesValue: 4100, ticketAverage: 120.00, productsPerService: 3.4 },
  { id: '10', date: new Date('2024-07-10'), salesValue: 3950, ticketAverage: 118.25, productsPerService: 3.3 },
];


export default function DashboardPage() {
  const [salesData, setSalesData] = useState<SalesEntry[]>(initialSalesData);
  const [analysis, setAnalysis] = useState<AnalyzeSalesTrendsOutput | null>(null);

  const handleAddSale = (newSale: Omit<SalesEntry, 'id'>) => {
    const saleWithId = { ...newSale, id: new Date().toISOString() + Math.random() };
    setSalesData(prevData => [...prevData, saleWithId].sort((a, b) => a.date.getTime() - b.date.getTime()));
  };

  const totalSales = salesData.reduce((acc, entry) => acc + entry.salesValue, 0);
  const avgTicket = salesData.length > 0 ? salesData.reduce((acc, entry) => acc + entry.ticketAverage, 0) / salesData.length : 0;
  const avgPPA = salesData.length > 0 ? salesData.reduce((acc, entry) => acc + entry.productsPerService, 0) / salesData.length : 0;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Ticket</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${avgTicket.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products per Service</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgPPA.toFixed(2)}</div>
            </CardContent>
          </Card>
           <AiInsights salesData={salesData} setAnalysis={setAnalysis} analysis={analysis} />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2 grid gap-4">
             <SalesChart salesData={salesData} />
             <SalesTable salesData={salesData} />
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-1 lg:gap-8">
            <SalesForm onSaleAdd={handleAddSale} />
          </div>
        </div>
      </main>
    </div>
  );
}
