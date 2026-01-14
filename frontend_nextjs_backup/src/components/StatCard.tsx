import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <Card className="bg-blue-800 text-white">
      <CardHeader className="flex items-center justify-between p-4">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <h2 className="text-2xl font-bold">{value}</h2>
      </CardContent>
    </Card>
  );
};
