"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [points, setPoints] = useState("");
  const [fees, setFees] = useState("");
  const [ticketValue, setTicketValue] = useState("");
  const [valuePerPoint, setValuePerPoint] = useState<number | null>(null);

  useEffect(() => {
    const pointsNum = parseFloat(points);
    const feesNum = parseFloat(fees) || 0;
    const valueNum = parseFloat(ticketValue);

    if (pointsNum > 0 && valueNum > 0) {
      const actualValue = valueNum - feesNum;
      const perPoint = (actualValue / pointsNum) * 100;
      setValuePerPoint(perPoint);
    } else {
      setValuePerPoint(null);
    }
  }, [points, fees, ticketValue]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Airline Miles Value Calculator
            </CardTitle>
            <CardDescription className="text-center">
              Calculate the value of your airline miles in pence per point
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                type="number"
                id="points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Enter points required"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Fees and Taxes (£)</Label>
              <Input
                type="number"
                id="fees"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="Enter fees and taxes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Ticket Cash Value (£)</Label>
              <Input
                type="number"
                id="value"
                value={ticketValue}
                onChange={(e) => setTicketValue(e.target.value)}
                placeholder="Enter ticket cash value"
              />
            </div>

            {valuePerPoint !== null && (
              <div className="pt-4 border-t">
                <div className="text-lg text-center">
                  <span className="font-medium">Value per point: </span>
                  <span className="text-primary">
                    {valuePerPoint.toFixed(2)}p
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
