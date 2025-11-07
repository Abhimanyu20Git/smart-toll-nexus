import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Shield, 
  LogOut, 
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TollBooth {
  id: number;
  name: string;
  location: string;
  lanes: number;
  operator: string;
  rate: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tollBooths, setTollBooths] = useState<TollBooth[]>([
    { id: 1, name: "Plaza A", location: "Highway 101 North", lanes: 4, operator: "John Smith", rate: 15.50 },
    { id: 2, name: "Plaza B", location: "Highway 101 South", lanes: 6, operator: "Jane Doe", rate: 20.00 },
    { id: 3, name: "Plaza C", location: "Interstate 5", lanes: 5, operator: "Mike Johnson", rate: 12.50 },
  ]);

  const [editingBooth, setEditingBooth] = useState<TollBooth | null>(null);
  const [boothForm, setBoothForm] = useState({
    name: "",
    location: "",
    lanes: 1,
    operator: "",
    rate: 0
  });

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "admin") {
      navigate("/auth?role=admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleAddBooth = () => {
    const newBooth = {
      id: tollBooths.length + 1,
      ...boothForm
    };
    setTollBooths([...tollBooths, newBooth]);
    toast.success("Toll booth added successfully");
    resetForm();
  };

  const handleUpdateBooth = () => {
    if (!editingBooth) return;
    setTollBooths(tollBooths.map(booth => 
      booth.id === editingBooth.id ? { ...editingBooth, ...boothForm } : booth
    ));
    toast.success("Toll booth updated successfully");
    resetForm();
  };

  const handleDeleteBooth = (id: number) => {
    setTollBooths(tollBooths.filter(booth => booth.id !== id));
    toast.success("Toll booth removed successfully");
  };

  const resetForm = () => {
    setBoothForm({
      name: "",
      location: "",
      lanes: 1,
      operator: "",
      rate: 0
    });
    setEditingBooth(null);
  };

  const startEdit = (booth: TollBooth) => {
    setEditingBooth(booth);
    setBoothForm({
      name: booth.name,
      location: booth.location,
      lanes: booth.lanes,
      operator: booth.operator,
      rate: booth.rate
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">SmartToll Connect</h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
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
        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">$45,231</div>
                <DollarSign className="w-8 h-8 text-success" />
              </div>
              <p className="text-xs text-success mt-2">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Toll Booths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{tollBooths.length}</div>
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Across all highways</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">2,847</div>
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-xs text-success mt-2">+8.2% growth</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">12,894</div>
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Toll Booth Management */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Toll Booth Management
                </CardTitle>
                <CardDescription>
                  Manage toll booths, operators, and rates
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Booth
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingBooth ? 'Edit' : 'Add'} Toll Booth</DialogTitle>
                    <DialogDescription>
                      {editingBooth ? 'Update' : 'Create a new'} toll booth configuration
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Booth Name</Label>
                      <Input
                        placeholder="Plaza A"
                        value={boothForm.name}
                        onChange={(e) => setBoothForm({ ...boothForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="Highway 101 North"
                        value={boothForm.location}
                        onChange={(e) => setBoothForm({ ...boothForm, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Lanes</Label>
                      <Input
                        type="number"
                        min="1"
                        value={boothForm.lanes}
                        onChange={(e) => setBoothForm({ ...boothForm, lanes: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Operator Name</Label>
                      <Input
                        placeholder="John Smith"
                        value={boothForm.operator}
                        onChange={(e) => setBoothForm({ ...boothForm, operator: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Toll Rate ($)</Label>
                      <Input
                        type="number"
                        step="0.50"
                        min="0"
                        value={boothForm.rate}
                        onChange={(e) => setBoothForm({ ...boothForm, rate: parseFloat(e.target.value) })}
                      />
                    </div>
                    <Button 
                      onClick={editingBooth ? handleUpdateBooth : handleAddBooth}
                      className="w-full"
                    >
                      {editingBooth ? 'Update' : 'Add'} Booth
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tollBooths.map((booth) => (
                <div
                  key={booth.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{booth.name}</h3>
                    <p className="text-sm text-muted-foreground">{booth.location}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        <span className="font-medium text-foreground">{booth.lanes}</span> lanes
                      </span>
                      <span className="text-muted-foreground">
                        Operator: <span className="font-medium text-foreground">{booth.operator}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Rate: <span className="font-medium text-success">${booth.rate}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => startEdit(booth)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Toll Booth</DialogTitle>
                          <DialogDescription>
                            Update toll booth configuration
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Booth Name</Label>
                            <Input
                              placeholder="Plaza A"
                              value={boothForm.name}
                              onChange={(e) => setBoothForm({ ...boothForm, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              placeholder="Highway 101 North"
                              value={boothForm.location}
                              onChange={(e) => setBoothForm({ ...boothForm, location: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Number of Lanes</Label>
                            <Input
                              type="number"
                              min="1"
                              value={boothForm.lanes}
                              onChange={(e) => setBoothForm({ ...boothForm, lanes: parseInt(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Operator Name</Label>
                            <Input
                              placeholder="John Smith"
                              value={boothForm.operator}
                              onChange={(e) => setBoothForm({ ...boothForm, operator: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Toll Rate ($)</Label>
                            <Input
                              type="number"
                              step="0.50"
                              min="0"
                              value={boothForm.rate}
                              onChange={(e) => setBoothForm({ ...boothForm, rate: parseFloat(e.target.value) })}
                            />
                          </div>
                          <Button onClick={handleUpdateBooth} className="w-full">
                            Update Booth
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteBooth(booth.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default AdminDashboard;
