import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Wallet, Zap, BarChart3, Users, Clock } from "lucide-react";
import heroImage from "@/assets/toll-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(16, 39, 77, 0.7), rgba(16, 39, 77, 0.9)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-primary-foreground">
              SmartToll Connect
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Revolutionizing Highway Toll Management with RFID Technology
            </p>
            <p className="text-lg mb-12 text-primary-foreground/80 max-w-2xl mx-auto">
              Seamless toll collection, instant payments, and comprehensive management for users, operators, and administrators
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/auth?role=user">
                <Button variant="hero" size="xl">
                  User Login
                </Button>
              </Link>
              <Link to="/auth?role=admin">
                <Button variant="secondary" size="xl">
                  Admin Portal
                </Button>
              </Link>
              <Link to="/auth?role=operator">
                <Button variant="outline" size="xl" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                  Operator Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets seamless user experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">RFID Detection</h3>
                <p className="text-muted-foreground">
                  Automatic vehicle detection and instant toll deduction using advanced RFID technology
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-lg bg-gradient-secondary flex items-center justify-center mb-4">
                  <Wallet className="w-7 h-7 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Digital Wallet</h3>
                <p className="text-muted-foreground">
                  Secure wallet management with instant recharge and real-time balance updates
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                <p className="text-muted-foreground">
                  Bank-grade security with OTP verification and encrypted payment processing
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-lg bg-success flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-success-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                <p className="text-muted-foreground">
                  Instant notifications for transactions, low balance alerts, and system updates
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <BarChart3 className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Comprehensive reports and insights for administrators and operators
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-lg bg-gradient-secondary flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Role Access</h3>
                <p className="text-muted-foreground">
                  Dedicated portals for users, administrators, and toll booth operators
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Join thousands of users experiencing seamless toll payments
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/auth?role=user&mode=register">
                <Button variant="secondary" size="xl">
                  Register Now
                </Button>
              </Link>
              <Link to="/auth?role=user">
                <Button variant="outline" size="xl" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 SmartToll Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
