import React, { useEffect, useState, useContext } from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  MessageSquare, 
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/services/api';
import type { DashboardStats } from '@/types';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { RouterContext } from '@/App';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminDashboard: React.FC = () => {
  const { setCurrentPage } = useContext(RouterContext);
  const { logout, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Admin Panel
          </h1>
        </div>
        <nav className="px-4 space-y-2">
          <Button variant="secondary" className="w-full justify-start">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calculator className="h-4 w-4 mr-2" />
            Tax Slabs
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Blog Posts
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="mb-4 px-4">
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your calculator usage and statistics.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats?.calculations.total.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  +{stats?.calculations.last30Days} last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Blog Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.blogPosts.total}</p>
                <p className="text-sm text-muted-foreground">
                  {stats?.blogPosts.published} published
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unread Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats?.contactMessages.unread}
                </p>
                <p className="text-sm text-muted-foreground">
                  awaiting response
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats?.topCountries.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  with calculations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="usage" className="w-full">
            <TabsList>
              <TabsTrigger value="usage">Usage Trends</TabsTrigger>
              <TabsTrigger value="countries">Top Countries</TabsTrigger>
              <TabsTrigger value="salary">Salary Ranges</TabsTrigger>
            </TabsList>

            <TabsContent value="usage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Calculations (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats?.dailyCalculations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="countries" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Countries by Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats?.topCountries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="countryCode" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="salary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Salary Range Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats?.salaryRanges}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {stats?.salaryRanges.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
