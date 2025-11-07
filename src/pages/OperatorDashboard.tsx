import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Gauge, 
  LogOut, 
  Car,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from "lucide-react";

interface Vehicle {
  id: number;
  vehicleNumber: string;
  rfidStatus: "detected" | "processing" | "paid" | "failed";
  amount: number;
  timestamp: string;
  lane: number;
}

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const [boothInfo] = useState({
    name: "Plaza A",
    location: "Highway 101 North",
    lane: 3,
    shift: "Morning (6 AM - 2 PM)"
  });

  const [todayStats] = useState({
    vehicles: 142,
    revenue: 2184.50,
    avgTime: "12s"
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 1, vehicleNumber: "ABC-1234", rfidStatus: "paid", amount: 15.50, timestamp: "14:35:20", lane: 3 },
    { id: 2, vehicleNumber: "XYZ-5678", rfidStatus: "processing", amount: 15.50, timestamp: "14:35:15", lane: 3 },
    { id: 3, vehicleNumber: "DEF-9012", rfidStatus: "paid", amount: 15.50, timestamp: "14:34:58", lane: 3 },
    { id: 4, vehicleNumber: "GHI-3456", rfidStatus: "paid", amount: 15.50, timestamp: "14:34:42", lane: 3 },
  ]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "operator") {
      navigate("/auth?role=operator");
    }

    // Simulate real-time vehicle updates
    const interval = setInterval(() => {
      // Randomly update vehicle statuses
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => {
          if (vehicle.rfidStatus === "processing") {
            return { ...vehicle, rfidStatus: Math.random() > 0.1 ? "paid" : "failed" as any };
          }
          return vehicle;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getStatusBadge = (status: Vehicle["rfidStatus"]) => {
    switch (status) {
      case "detected":
        return <Badge variant="outline" className="bg-secondary/20 text-secondary">Detected</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-accent/20 text-accent">Processing</Badge>;
      case "paid":
        return <Badge variant="outline" className="bg-success/20 text-success">Paid</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Gauge className="w-8 h-8 text-secondary" />
              <div>
                <h1 className="text-xl font-bold">SmartToll Connect</h1>
                <p className="text-sm text-muted-foreground">Operator Dashboard</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Booth Info */}
        <Card className="mb-8 bg-gradient-secondary text-secondary-foreground shadow-xl">
          <CardHeader>
            <CardTitle>Current Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm opacity-90">Booth</p>
                <p className="text-lg font-semibold">{boothInfo.name}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Location</p>
                <p className="text-lg font-semibold">{boothInfo.location}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Lane</p>
                <p className="text-lg font-semibold">Lane {boothInfo.lane}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Shift</p>
                <p className="text-lg font-semibold">{boothInfo.shift}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vehicles Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{todayStats.vehicles}</div>
                <Car className="w-8 h-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Today's count</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Collected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">${todayStats.revenue}</div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">This shift</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{todayStats.avgTime}</div>
                <Clock className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-xs text-success mt-2">Excellent performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Vehicle Monitoring */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Live Vehicle Monitoring
            </CardTitle>
            <CardDescription>
              Real-time tracking of vehicles passing through your lane
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      vehicle.rfidStatus === 'paid' 
                        ? 'bg-success/20 text-success' 
                        : vehicle.rfidStatus === 'failed'
                        ? 'bg-destructive/20 text-destructive'
                        : 'bg-accent/20 text-accent'
                    }`}>
                      {vehicle.rfidStatus === 'paid' ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : vehicle.rfidStatus === 'failed' ? (
                        <XCircle className="w-6 h-6" />
                      ) : (
                        <Clock className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{vehicle.vehicleNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        Lane {vehicle.lane} • {vehicle.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${vehicle.amount.toFixed(2)}</p>
                      <div className="mt-1">{getStatusBadge(vehicle.rfidStatus)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OperatorDashboard;
