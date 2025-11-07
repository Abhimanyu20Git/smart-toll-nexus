import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Wallet, 
  CreditCard, 
  History, 
  Car, 
  LogOut, 
  ArrowUpCircle,
  Receipt
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(250.50);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2024-01-15", time: "14:30", booth: "Plaza A - Lane 3", amount: 15.50, type: "toll" },
    { id: 2, date: "2024-01-14", time: "09:15", booth: "Wallet Recharge", amount: 100.00, type: "recharge" },
    { id: 3, date: "2024-01-13", time: "18:45", booth: "Plaza B - Lane 1", amount: 20.00, type: "toll" },
    { id: 4, date: "2024-01-12", time: "11:20", booth: "Plaza C - Lane 2", amount: 12.50, type: "toll" },
  ]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "user") {
      navigate("/auth?role=user");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      setWalletBalance(walletBalance + amount);
      setTransactions([
        {
          id: transactions.length + 1,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          booth: "Wallet Recharge",
          amount: amount,
          type: "recharge"
        },
        ...transactions
      ]);
      setRechargeAmount("");
      toast.success(`Wallet recharged with $${amount.toFixed(2)}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">SmartToll Connect</h1>
                <p className="text-sm text-muted-foreground">User Dashboard</p>
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
        {/* Wallet Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 bg-gradient-primary text-primary-foreground shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-6 h-6" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-4">
                ${walletBalance.toFixed(2)}
              </div>
              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="lg">
                      <ArrowUpCircle className="w-5 h-5 mr-2" />
                      Recharge Wallet
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Recharge Wallet</DialogTitle>
                      <DialogDescription>
                        Add funds to your SmartToll wallet
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="50.00"
                          value={rechargeAmount}
                          onChange={(e) => setRechargeAmount(e.target.value)}
                          min="1"
                          step="0.01"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[50, 100, 200].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            onClick={() => setRechargeAmount(amount.toString())}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      <Button onClick={handleRecharge} className="w-full" size="lg">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pay Now
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Number</p>
                  <p className="font-semibold">ABC-1234</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RFID Status</p>
                  <p className="font-semibold text-success">Active</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Toll</p>
                  <p className="font-semibold">2024-01-15, 14:30</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Transaction History
            </CardTitle>
            <CardDescription>
              View all your toll payments and wallet recharges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'recharge' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-accent/20 text-accent'
                    }`}>
                      {transaction.type === 'recharge' ? (
                        <ArrowUpCircle className="w-5 h-5" />
                      ) : (
                        <Receipt className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.booth}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date} at {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'recharge' 
                      ? 'text-success' 
                      : 'text-foreground'
                  }`}>
                    {transaction.type === 'recharge' ? '+' : '-'}${transaction.amount.toFixed(2)}
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

export default UserDashboard;
