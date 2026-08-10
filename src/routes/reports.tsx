import {
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getPaidSessions,
  getOwnerToken,
  type PendingPayment,
} from "@/api/api";

export const Route = createFileRoute("/reports")({
  beforeLoad: () => {
  if (typeof window === "undefined") {
    return;
  }

  const token =
    window.sessionStorage.getItem("ownerAuthToken");

  if (!token) {
    throw redirect({
      to: "/owner-login",
    });
  }
},

  component: ReportsPage,
});

function ReportsPage() {
  const [dateFilter, setDateFilter] = useState<
    "today" | "yesterday" | "week" | "month" | "all"
  >("today");

  const [sessions, setSessions] =
    useState<PendingPayment[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
  const token = getOwnerToken();

  if (!token) {
    window.location.href = "/owner-login";
    return;
  }

  loadPaidSessions();
}, []);

    const filteredSessions = useMemo(() => {
    const now = new Date();

    if (dateFilter === "all") {
      return sessions;
    }

    const start = new Date(now);
    const end = new Date(now);

    if (dateFilter === "today") {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }

    if (dateFilter === "yesterday") {
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);

      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
    }

    if (dateFilter === "week") {
  const day = start.getDay();

  // Monday = 0, Tuesday = 1, ... Sunday = 6
  const daysSinceMonday =
    day === 0 ? 6 : day - 1;

  start.setDate(
    start.getDate() - daysSinceMonday
  );

  start.setHours(0, 0, 0, 0);

  end.setDate(
    start.getDate() + 6
  );

  end.setHours(23, 59, 59, 999);
}

    if (dateFilter === "month") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      end.setMonth(
        end.getMonth() + 1,
        0
      );
      end.setHours(23, 59, 59, 999);
    }

    return sessions.filter((session) => {
      if (!session.paidAt) {
        return false;
      }

      const paidAt = new Date(
        session.paidAt
      );

      return (
        paidAt >= start &&
        paidAt <= end
      );
    });
  }, [sessions, dateFilter]);

  async function loadPaidSessions() {
    try {
      setLoading(true);

      const data = await getPaidSessions();

      setSessions(data);

    } catch (error) {
  console.error(error);

  const token = getOwnerToken();

  if (!token) {
    window.location.href = "/owner-login";
    return;
  }

  alert("Failed to load reports.");
} finally {
      setLoading(false);
    }
  }

  const totalGamingRevenue = useMemo(() => {
    return filteredSessions.reduce(
      (total, session) =>
        total + session.gamingCharge,
      0
    );
  }, [filteredSessions]);

  const totalFoodSales = useMemo(() => {
    return filteredSessions.reduce(
      (total, session) =>
        total + session.foodGrossTotal,
      0
    );
  }, [filteredSessions]);

  const totalCommission = useMemo(() => {
    return filteredSessions.reduce(
      (total, session) =>
        total + session.foodCommissionTotal,
      0
    );
  }, [filteredSessions]);

  const totalCafeFoodRevenue = useMemo(() => {
    return filteredSessions.reduce(
      (total, session) =>
        total + session.foodNetTotal,
      0
    );
  }, [filteredSessions]);

  const totalRevenue = useMemo(() => {
    return filteredSessions.reduce(
      (total, session) =>
        total + session.totalAmount,
      0
    );
  }, [filteredSessions]);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}

        <div className="space-y-4">

  <div>
    <h1 className="text-3xl font-bold tracking-tight">
      Reports
    </h1>

    <p className="text-muted-foreground mt-2">
      Review finalized revenue from completed
      and paid sessions.
    </p>
  </div>

  <div className="flex flex-wrap gap-2">

    {[
      { key: "today", label: "Today" },
      { key: "yesterday", label: "Yesterday" },
      { key: "week", label: "This Week" },
      { key: "month", label: "This Month" },
      { key: "all", label: "All Time" },
    ].map((filter) => (

      <button
        key={filter.key}
        onClick={() =>
          setDateFilter(
            filter.key as
              | "today"
              | "yesterday"
              | "week"
              | "month"
              | "all"
          )
        }
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          dateFilter === filter.key
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        {filter.label}
      </button>

    ))}

  </div>

</div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              Loading reports...
            </CardContent>
          </Card>
        ) : (
          <>

            {/* Revenue Summary */}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹{totalRevenue.toFixed(2)}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Customer payments
                  </p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Gaming Revenue
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹{totalGamingRevenue.toFixed(2)}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Gaming sessions
                  </p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Food Sales
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹{totalFoodSales.toFixed(2)}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Gross food sales
                  </p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Partner Commission
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹{totalCommission.toFixed(2)}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Commission owed
                  </p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Café Food Revenue
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹{totalCafeFoodRevenue.toFixed(2)}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Net food revenue
                  </p>
                </CardContent>
              </Card>

            </div>


            {/* Paid Sessions */}

            <Card>

              <CardHeader>
                <CardTitle>
                  Paid Sessions
                </CardTitle>
              </CardHeader>

              <CardContent>

                {sessions.length === 0 ? (
                  <div className="py-10 text-center">

                    <p className="font-medium">
                      No paid sessions yet
                    </p>

                    <p className="text-sm text-muted-foreground mt-1">
                      Completed payments will appear here.
                    </p>

                  </div>
                ) : (
                  <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                      <thead>

                        <tr className="border-b">

                          <th className="text-left py-3 pr-4">
                            Paid At
                          </th>

                          <th className="text-left py-3 pr-4">
                            Session
                          </th>

                          <th className="text-left py-3 pr-4">
                            PC
                          </th>

                          <th className="text-right py-3 pr-4">
                            Gaming
                          </th>

                          <th className="text-right py-3 pr-4">
                            Food
                          </th>

                          <th className="text-right py-3 pr-4">
                            Commission
                          </th>

                          <th className="text-right py-3 pr-4">
                            Café Food
                          </th>

                          <th className="text-right py-3">
                            Total
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {filteredSessions.map((session) => (

                          <tr
                            key={session.id}
                            className="border-b last:border-0"
                          >

                            <td className="py-3 pr-4 whitespace-nowrap">

                              {session.paidAt
                                ? new Date(
                                    session.paidAt
                                  ).toLocaleString()
                                : "—"}

                            </td>

                            <td className="py-3 pr-4">
                              #{session.id}
                            </td>

                            <td className="py-3 pr-4">
                              {session.pcId}
                            </td>

                            <td className="py-3 pr-4 text-right">
                              ₹
                              {session.gamingCharge.toFixed(
                                2
                              )}
                            </td>

                            <td className="py-3 pr-4 text-right">
                              ₹
                              {session.foodGrossTotal.toFixed(
                                2
                              )}
                            </td>

                            <td className="py-3 pr-4 text-right">
                              ₹
                              {session.foodCommissionTotal.toFixed(
                                2
                              )}
                            </td>

                            <td className="py-3 pr-4 text-right">
                              ₹
                              {session.foodNetTotal.toFixed(
                                2
                              )}
                            </td>

                            <td className="py-3 text-right font-medium">
                              ₹
                              {session.totalAmount.toFixed(
                                2
                              )}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

              </CardContent>

            </Card>

          </>
        )}

      </div>
    </AppShell>
  );
}