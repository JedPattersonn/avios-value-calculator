"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SaveIcon, XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface SavedFlight {
  id: string;
  name: string;
  points: number;
  fees: number;
  ticketValue: number;
  valuePerPoint: number;
  timestamp: number;
  dateRange?: DateRange;
}

export default function Home() {
  const [points, setPoints] = useState("");
  const [fees, setFees] = useState("");
  const [ticketValue, setTicketValue] = useState("");
  const [valuePerPoint, setValuePerPoint] = useState<number | null>(null);
  const [flightName, setFlightName] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [savedFlights, setSavedFlights] = useState<SavedFlight[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedFlights");
    if (saved) {
      setSavedFlights(
        JSON.parse(saved, (key, value) => {
          if ((key === "from" || key === "to") && value) {
            return new Date(value);
          }
          return value;
        })
      );
    }
  }, []);

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

  const saveFlight = () => {
    if (
      valuePerPoint !== null &&
      flightName.trim() &&
      points &&
      fees &&
      ticketValue
    ) {
      const newFlight: SavedFlight = {
        id: Date.now().toString(),
        name: flightName,
        points: parseFloat(points),
        fees: parseFloat(fees),
        ticketValue: parseFloat(ticketValue),
        valuePerPoint,
        timestamp: Date.now(),
        dateRange: date,
      };

      const updatedFlights = [...savedFlights, newFlight];
      setSavedFlights(updatedFlights);
      localStorage.setItem("savedFlights", JSON.stringify(updatedFlights));
      setFlightName("");
      setDate({ from: undefined, to: undefined });
    }
  };

  const deleteFlight = (id: string) => {
    const updatedFlights = savedFlights.filter((flight) => flight.id !== id);
    setSavedFlights(updatedFlights);
    localStorage.setItem("savedFlights", JSON.stringify(updatedFlights));
  };

  const formatDateRange = (range?: DateRange) => {
    if (!range?.from) return "Select dates";
    if (!range.to) return format(range.from, "PPP");
    return `${format(range.from, "PP")} - ${format(range.to, "PP")}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <motion.div
                initial={false}
                animate={{
                  opacity: valuePerPoint !== null ? 1 : 0.7,
                }}
                transition={{ duration: 0.2 }}
                className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground text-center">
                    Value per Point
                  </h3>
                  <div className="text-3xl font-bold text-center text-primary h-[40px] flex items-center justify-center">
                    {valuePerPoint !== null ? (
                      `${valuePerPoint.toFixed(2)}p`
                    ) : (
                      <span className="text-muted-foreground text-lg">
                        Enter values above
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="flightName">Flight Details (Optional)</Label>
                  <Input
                    type="text"
                    id="flightName"
                    value={flightName}
                    onChange={(e) => setFlightName(e.target.value)}
                    placeholder="e.g., London to New York - BA"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Flight Dates (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDateRange(date)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  onClick={saveFlight}
                  className="w-full"
                  disabled={!valuePerPoint || !flightName.trim()}
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  Save Flight
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Saved Flights
              </CardTitle>
              <CardDescription className="text-center">
                Compare your saved flight options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {savedFlights.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-muted-foreground"
                  >
                    No saved flights yet
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {savedFlights
                      .sort((a, b) => b.valuePerPoint - a.valuePerPoint)
                      .map((flight) => (
                        <motion.div
                          key={flight.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="p-4 rounded-lg border relative hover:bg-accent"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => deleteFlight(flight.id)}
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                          <div className="font-medium">{flight.name}</div>
                          {flight.dateRange?.from && (
                            <div className="text-sm text-muted-foreground">
                              {formatDateRange(flight.dateRange)}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            {flight.points.toLocaleString()} points + £
                            {flight.fees}
                          </div>
                          <div className="text-sm">
                            Ticket value: £{flight.ticketValue}
                          </div>
                          <div className="mt-2 font-semibold text-primary">
                            {flight.valuePerPoint.toFixed(2)}p per point
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
