import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Shield, Gauge } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "user";
  const mode = searchParams.get("mode") || "login";
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    vehicleNumber: "",
    otp: "",
  });
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const loggedInRole = localStorage.getItem("userRole");
    if (loggedInRole) {
      navigate(`/${loggedInRole}-dashboard`);
    }
  }, [navigate]);

  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return <Shield className="w-8 h-8 text-primary" />;
      case "operator":
        return <Gauge className="w-8 h-8 text-secondary" />;
      default:
        return <User className="w-8 h-8 text-accent" />;
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "operator":
        return "Toll Booth Operator";
      default:
        return "User";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", formData.email);
      toast.success("Login successful!");
      navigate(`/${role}-dashboard`);
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showOTP) {
      // First step: Send OTP
      setIsLoading(true);
      setTimeout(() => {
        setShowOTP(true);
        toast.success("OTP sent to your email and phone!");
        setIsLoading(false);
      }, 1000);
    } else {
      // Second step: Verify OTP and register
      setIsLoading(true);
      setTimeout(() => {
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", formData.email);
        toast.success("Registration successful!");
        navigate(`/${role}-dashboard`);
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getRoleIcon()}
          </div>
          <CardTitle className="text-2xl">{getRoleTitle()} Portal</CardTitle>
          <CardDescription>
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={mode} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                {!showOTP ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input
                        id="reg-name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-phone">Phone Number</Label>
                      <Input
                        id="reg-phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {role === "user" && (
                      <div className="space-y-2">
                        <Label htmlFor="vehicle-number">Vehicle Number</Label>
                        <Input
                          id="vehicle-number"
                          name="vehicleNumber"
                          type="text"
                          placeholder="ABC-1234"
                          value={formData.vehicleNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground text-center">
                        OTP has been sent to {formData.email} and {formData.phone}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        placeholder="123456"
                        value={formData.otp}
                        onChange={handleInputChange}
                        required
                        maxLength={6}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Verifying..." : "Verify & Register"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowOTP(false)}
                    >
                      Change Details
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
