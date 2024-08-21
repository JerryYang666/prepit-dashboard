"use client";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquareText, Clock10, BookCheck, Users } from "lucide-react";
import { useEffect } from "react";
import { ping } from "@/app/api/auth/auth";
import Cookies from "js-cookie";

export default function Page() {
  useEffect(() => {
    // refresh token if there is a refresh token and access token is expired
    if (Cookies.get("refresh_token") && !Cookies.get("access_token")) {
      ping();
    }
  }, []);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          {/* <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Practice Sessions
                  </CardTitle>
                  <MessageSquareText />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Hours Practiced
                  </CardTitle>
                  <Clock10 />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">20</div>
                  <p className="text-xs text-muted-foreground">
                    +80.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Cases</CardTitle>
                  <BookCheck />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+5</div>
                  <p className="text-xs text-muted-foreground">
                    5 new cases added
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Practicing Now
                  </CardTitle>
                  <Users />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-row align-bottom items-baseline">
                    <div className="text-2xl font-bold mr-2">233</div>
                  <p className="text-xs text-muted-foreground">
                    People
                  </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +15 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Your Trend (Cases Practiced)</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Interviews</CardTitle>
                  <CardDescription>
                    Come back and finish your interviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent> */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="p-4 w-1/2">
              Data Dashboard Coming Soon... Please go to Case Books to start
              practicing. Or go to "Interviews" to view your interviews.
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            {/* <CalendarDateRangePicker />
            <Button>Download Report</Button> */}
            <Card className="p-4 w-1/2">
              Data Dashboard Coming Soon... Please go to Case Books to start
              practicing. Or go to "Interviews" to view your interviews.
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
