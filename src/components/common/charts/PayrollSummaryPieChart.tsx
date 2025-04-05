"use client";

import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PayrollRecord } from "@/types/payroll.type";
import { formatDate } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";

interface PayrollSummaryPieChartProps {
  payrollData: PayrollRecord;
}

export function PayrollSummaryPieChart({
  payrollData,
}: PayrollSummaryPieChartProps) {
  // Transform the payroll data into a format suitable for the pie chart

  const chartData = [
    {
      category: "Net Salary",
      value: payrollData.net_salary,
      fill: "hsl(var(--chart-2))",
    },
    {
      category: "Gross Salary",
      value: payrollData.gross_salary,
      fill: "hsl(var(--chart-3))",
    },

    {
      category: "Total Deduction",
      value: payrollData.totalDeduction,
      fill: "hsl(var(--chart-1))",
    },
  ];

  const chartConfig = {
    grossSalary: {
      label: "Gross Salary",
      color: "hsl(var(--chart-1))",
    },
    netSalary: {
      label: "Net Salary",
      color: "hsl(var(--chart-2))",
    },
    totalDeduction: {
      label: "Total Deduction",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const SideDetails = ({
    color,
    name,
    figure,
  }: {
    color: string;
    name: string;
    figure: number;
  }) => {
    return (
      <div className="flex items-center gap-3">
        <div
          style={{
            backgroundColor: `hsl(var(--chart-${color}))`,
          }}
          className="h-8 w-1 rounded-lg"
        />
        <div>
          <p>{name}</p>
          <p className="md:text-lg text-sm font-semibold">
            {formatCurrency(figure)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="flex flex-col md:flex-row py-4 mt-6 border-0 shadow-none">
      <CardContent className="md:w-[60%] w-full pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 4} />
              )}
            >
              <Label
                position="center"
                fontSize={13}
                fontWeight={700}
                value={`${formatDate(
                  new Date(payrollData.payroll_date),
                  "MMMM yyyy"
                )}`}
                fill="var(--color-text)"
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 w-full md:w-[40%] md:pl-6 text-sm justify-center">
        <div className="flex md:flex-col gap-4">
          <SideDetails
            color="2"
            name="Net Salary"
            figure={payrollData.net_salary}
          />
          <SideDetails
            color="1"
            name="Total Deduction"
            figure={payrollData.totalDeduction}
          />
          <SideDetails
            color="3"
            name="Gross Salary"
            figure={payrollData.gross_salary}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
