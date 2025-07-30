
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CreditCard, Users, DollarSign, AlertTriangle, Check, X, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import HelpTooltip from '@/components/shared/HelpTooltip';

const PaymentMethodBehaviorReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedRenewalStatus, setSelectedRenewalStatus] = useState('all');

  // Mock payment data
  const paymentSummary = {
    totalActiveSubscribers: 12450,
    autoRenewalSubscribers: 9560,
    manualRenewalSubscribers: 2890,
    totalRefunds: 187500,
    successfulPayments: 98.2,
    failedPayments: 1.8
  };

  const paymentMethodStats = [
    { method: 'Credit Card', count: 7840, percentage: 63.0, avgSuccessRate: 98.5, totalRefunds: 89400 },
    { method: 'PayPal', count: 2680, percentage: 21.5, avgSuccessRate: 97.8, totalRefunds: 42300 },
    { method: 'Debit Card', count: 1240, percentage: 10.0, avgSuccessRate: 96.2, totalRefunds: 28600 },
    { method: 'Bank Transfer', count: 480, percentage: 3.9, avgSuccessRate: 99.1, totalRefunds: 15800 },
    { method: 'Check', count: 210, percentage: 1.6, avgSuccessRate: 94.3, totalRefunds: 11400 }
  ];

  const subscriberData = [
    {
      id: 'SUB001',
      customerName: 'John Smith',
      email: 'john.smith@email.com',
      paymentMethod: 'Credit Card',
      cardLast4: '4532',
      autoRenewal: true,
      subscriptionType: 'Print + Digital',
      monthlyAmount: 24.99,
      successfulPayments: 12,
      failedPayments: 0,
      totalRefunds: 0,
      lastPaymentDate: '2024-05-15',
      nextBillingDate: '2024-06-15',
      paymentStatus: 'Current'
    },
    {
      id: 'SUB002',
      customerName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      paymentMethod: 'PayPal',
      cardLast4: null,
      autoRenewal: true,
      subscriptionType: 'Digital Only',
      monthlyAmount: 12.99,
      successfulPayments: 8,
      failedPayments: 1,
      totalRefunds: 12.99,
      lastPaymentDate: '2024-05-10',
      nextBillingDate: '2024-06-10',
      paymentStatus: 'Current'
    },
    {
      id: 'SUB003',
      customerName: 'Michael Brown',
      email: 'mbrown@email.com',
      paymentMethod: 'Credit Card',
      cardLast4: '9876',
      autoRenewal: false,
      subscriptionType: 'Print Only',
      monthlyAmount: 18.99,
      successfulPayments: 6,
      failedPayments: 2,
      totalRefunds: 0,
      lastPaymentDate: '2024-04-20',
      nextBillingDate: '2024-07-20',
      paymentStatus: 'Payment Due'
    },
    {
      id: 'SUB004',
      customerName: 'Emily Davis',
      email: 'emily.davis@email.com',
      paymentMethod: 'Debit Card',
      cardLast4: '2468',
      autoRenewal: true,
      subscriptionType: 'Print + Digital',
      monthlyAmount: 29.99,
      successfulPayments: 15,
      failedPayments: 0,
      totalRefunds: 29.99,
      lastPaymentDate: '2024-05-12',
      nextBillingDate: '2024-06-12',
      paymentStatus: 'Current'
    },
    {
      id: 'SUB005',
      customerName: 'Robert Wilson',
      email: 'rwilson@email.com',
      paymentMethod: 'Bank Transfer',
      cardLast4: null,
      autoRenewal: true,
      subscriptionType: 'Digital Only',
      monthlyAmount: 9.99,
      successfulPayments: 24,
      failedPayments: 0,
      totalRefunds: 0,
      lastPaymentDate: '2024-05-18',
      nextBillingDate: '2024-06-18',
      paymentStatus: 'Current'
    },
    {
      id: 'SUB006',
      customerName: 'Lisa Anderson',
      email: 'l.anderson@email.com',
      paymentMethod: 'PayPal',
      cardLast4: null,
      autoRenewal: false,
      subscriptionType: 'Print Only',
      monthlyAmount: 22.99,
      successfulPayments: 9,
      failedPayments: 3,
      totalRefunds: 68.97,
      lastPaymentDate: '2024-03-15',
      nextBillingDate: '2024-06-15',
      paymentStatus: 'Payment Failed'
    },
    {
      id: 'SUB007',
      customerName: 'David Martinez',
      email: 'dmartinez@email.com',
      paymentMethod: 'Credit Card',
      cardLast4: '1357',
      autoRenewal: true,
      subscriptionType: 'Print + Digital',
      monthlyAmount: 34.99,
      successfulPayments: 18,
      failedPayments: 1,
      totalRefunds: 0,
      lastPaymentDate: '2024-05-20',
      nextBillingDate: '2024-06-20',
      paymentStatus: 'Current'
    },
    {
      id: 'SUB008',
      customerName: 'Jennifer Garcia',
      email: 'jgarcia@email.com',
      paymentMethod: 'Check',
      cardLast4: null,
      autoRenewal: false,
      subscriptionType: 'Print Only',
      monthlyAmount: 15.99,
      successfulPayments: 4,
      failedPayments: 0,
      totalRefunds: 15.99,
      lastPaymentDate: '2024-05-01',
      nextBillingDate: '2024-08-01',
      paymentStatus: 'Current'
    }
  ];

  const paymentStatusTrends = [
    { month: 'Jan', successful: 2840, failed: 52, refunds: 12 },
    { month: 'Feb', successful: 2920, failed: 48, refunds: 18 },
    { month: 'Mar', successful: 3100, failed: 65, refunds: 15 },
    { month: 'Apr', successful: 3050, failed: 42, refunds: 22 },
    { month: 'May', successful: 3180, failed: 38, refunds: 19 },
    { month: 'Jun', successful: 3220, failed: 41, refunds: 16 }
  ];

  // Filter data based on search and filters
  const filteredData = subscriberData.filter(subscriber => {
    const matchesSearch = subscriber.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentMethod = selectedPaymentMethod === 'all' || subscriber.paymentMethod === selectedPaymentMethod;
    const matchesRenewalStatus = selectedRenewalStatus === 'all' || 
                                (selectedRenewalStatus === 'auto' && subscriber.autoRenewal) ||
                                (selectedRenewalStatus === 'manual' && !subscriber.autoRenewal);
    
    return matchesSearch && matchesPaymentMethod && matchesRenewalStatus;
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Current':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Current</Badge>;
      case 'Payment Due':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Payment Due</Badge>;
      case 'Payment Failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-xs font-medium leading-none">Total Subscribers</p>
                <p className="text-2xl font-bold">{paymentSummary.totalActiveSubscribers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-xs font-medium leading-none">Auto-Renewal</p>
                <p className="text-2xl font-bold">{paymentSummary.autoRenewalSubscribers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-xs font-medium leading-none">Success Rate</p>
                <p className="text-2xl font-bold">{paymentSummary.successfulPayments}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-xs font-medium leading-none">Total Refunds</p>
                <p className="text-2xl font-bold">${(paymentSummary.totalRefunds / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              Payment Method Distribution
              <HelpTooltip helpId="payment-method-distribution" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, percentage }) => `${method}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {paymentMethodStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Subscribers']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {paymentMethodStats.map((method, index) => (
                <div key={method.method} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                    <span>{method.method}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{method.count.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{method.avgSuccessRate}% success</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              Payment Trends
              <HelpTooltip helpId="payment-behavior-analysis" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentStatusTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="successful" fill="#10b981" name="Successful" />
                  <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                  <Bar dataKey="refunds" fill="#f59e0b" name="Refunds" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Payment Details</CardTitle>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Payment Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
            </select>
            <select
              value={selectedRenewalStatus}
              onChange={(e) => setSelectedRenewalStatus(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Renewal Types</option>
              <option value="auto">Auto-Renewal</option>
              <option value="manual">Manual Renewal</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscriber</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Auto-Renewal</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Success/Fail</TableHead>
                <TableHead>Refunds</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Billing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{subscriber.customerName}</div>
                      <div className="text-sm text-gray-600">{subscriber.email}</div>
                      <div className="text-xs text-gray-500">{subscriber.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{subscriber.paymentMethod}</div>
                      {subscriber.cardLast4 && (
                        <div className="text-sm text-gray-600">****{subscriber.cardLast4}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {subscriber.autoRenewal ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <Check className="h-3 w-3 mr-1" />
                        Auto
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                        <X className="h-3 w-3 mr-1" />
                        Manual
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{subscriber.subscriptionType}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${subscriber.monthlyAmount}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-green-600">{subscriber.successfulPayments} success</div>
                      {subscriber.failedPayments > 0 && (
                        <div className="text-red-600">{subscriber.failedPayments} failed</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {subscriber.totalRefunds > 0 ? (
                      <div className="text-sm font-medium text-red-600">
                        ${subscriber.totalRefunds}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">None</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(subscriber.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{subscriber.nextBillingDate}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No subscribers found matching your search criteria.
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredData.length} of {subscriberData.length} subscribers
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Behavior Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">High Success Rate</h4>
                <p className="text-sm text-green-700 mt-1">
                  Bank transfers show the highest success rate at 99.1%, followed by credit cards at 98.5%.
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">Auto-Renewal Adoption</h4>
                <p className="text-sm text-blue-700 mt-1">
                  76.8% of subscribers use auto-renewal, reducing payment failures and improving retention.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800">Payment Method Preference</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Credit cards dominate at 63% of all payment methods, with PayPal as the second choice at 21.5%.
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800">Refund Analysis</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Total refunds represent 0.8% of revenue, with most refunds occurring within 30 days of subscription.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodBehaviorReport;
