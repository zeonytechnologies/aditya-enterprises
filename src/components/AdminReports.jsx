import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Calendar, DollarSign, ShoppingBag, TrendingUp, Filter, Download, User, Crown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminReports({ orders = [], products = [] }) {
  const [filterType, setFilterType] = useState('month'); // 'month' or 'date_range'
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10)
  });

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      if (filterType === 'month') {
        const orderMonth = order.created_at.slice(0, 7);
        return orderMonth === selectedMonth;
      } else {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      }
    });
  }, [orders, filterType, selectedMonth, dateRange]);

  // KPIs
  const kpis = useMemo(() => {
    let totalRevenue = 0;
    let totalGST = 0;
    let totalOrders = filteredOrders.length;

    filteredOrders.forEach(o => {
      if (o.status === 'Delivered') {
        const amt = parseFloat(o.total_amount || o.grand_total || o.grandTotal || o.total || 0);
        totalRevenue += amt;
        const gst = parseFloat(o.gst_amount || o.gst || 0);
        totalGST += gst;
      }
    });

    return {
      totalRevenue,
      totalGST,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders) : 0
    };
  }, [filteredOrders]);

  // Data for Charts
  const revenueByDate = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      if (o.status !== 'Delivered') return;
      const date = o.created_at.slice(0, 10);
      const amt = parseFloat(o.total_amount || o.grand_total || o.grandTotal || o.total || 0);
      map[date] = (map[date] || 0) + amt;
    });
    return Object.keys(map).sort().map(date => ({
      date,
      revenue: map[date]
    }));
  }, [filteredOrders]);

  const orderStatusData = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      const status = o.status || 'Pending';
      map[status] = (map[status] || 0) + 1;
    });
    return Object.keys(map).map(status => ({
      name: status,
      value: map[status]
    }));
  }, [filteredOrders]);

  const topProductsData = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      if (o.status !== 'Delivered' || !o.items) return;
      
      // Handle items whether parsed or stringified
      let items = o.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch (e) { items = []; }
      }
      
      items.forEach(item => {
        const name = item.name || item.product?.name || 'Unknown Product';
        map[name] = (map[name] || 0) + (item.quantity || 1);
      });
    });

    return Object.keys(map)
      .map(name => ({ name: name.substring(0, 20) + (name.length > 20 ? '...' : ''), quantity: map[name] }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredOrders]);

  const productSalesDetails = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      if (o.status !== 'Delivered' || !o.items) return;
      let items = o.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch (e) { items = []; }
      }
      items.forEach(item => {
        const name = item.name || item.product?.name || 'Unknown Product';
        const qty = item.quantity || 1;
        const price = parseFloat(item.price || item.product?.price || 0);
        const revenue = qty * price;
        if (!map[name]) map[name] = { name, quantity: 0, revenue: 0 };
        map[name].quantity += qty;
        map[name].revenue += revenue;
      });
    });
    return Object.values(map).sort((a, b) => b.quantity - a.quantity);
  }, [filteredOrders]);

  const topCustomersData = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      if (o.status !== 'Delivered') return;
      const customer = o.user?.full_name || o.user?.name || o.shipping_address?.firstName || 'Retail Customer';
      const role = o.user?.role === 'dealer' || o.user?.role === 'distributor' ? 'Dealer' : 'Retail';
      const key = `${customer}||${role}`;
      const amt = parseFloat(o.total_amount || o.grand_total || o.grandTotal || o.total || 0);
      
      if (!map[key]) map[key] = { name: customer, role, totalSpent: 0, orderCount: 0 };
      map[key].totalSpent += amt;
      map[key].orderCount += 1;
    });

    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [filteredOrders]);

  const topDealer = topCustomersData.find(c => c.role === 'Dealer');
  const topRetail = topCustomersData.find(c => c.role === 'Retail');

  const handleDownloadPDF = () => {
    if (filteredOrders.length === 0) {
      alert("No data available to download for this period.");
      return;
    }
    
    const doc = new jsPDF();
    const fileName = `sales_report_${filterType === 'month' ? selectedMonth : dateRange.start + '_to_' + dateRange.end}.pdf`;
    
    doc.setFontSize(16);
    doc.text('Sales & Analytics Report', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Period: ${filterType === 'month' ? selectedMonth : dateRange.start + ' to ' + dateRange.end}`, 14, 30);
    
    const headers = [['Order ID', 'Date', 'Customer', 'Status', 'Items', 'Total Amount', 'GST']];
    const data = filteredOrders.map(o => {
      const customer = o.user?.full_name || o.user?.name || o.shipping_address?.firstName || 'Retail Customer';
      let itemsCount = 0;
      if (typeof o.items === 'string') {
        try { itemsCount = JSON.parse(o.items).length; } catch(e){}
      } else if (Array.isArray(o.items)) {
        itemsCount = o.items.length;
      }
      return [
        o.display_id || o.id.substring(0,8),
        new Date(o.created_at).toLocaleDateString(),
        customer,
        o.status,
        itemsCount.toString(),
        `Rs. ${parseFloat(o.total_amount || o.grand_total || o.grandTotal || o.total || 0).toLocaleString('en-IN')}`,
        `Rs. ${parseFloat(o.gst_amount || o.gst || 0).toLocaleString('en-IN')}`
      ];
    });
    
    autoTable(doc, {
      startY: 36,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }
    });
    
    doc.save(fileName);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold font-display flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-500" />
          Sales & Analytics
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border dark:border-slate-800">
            <button 
              onClick={() => setFilterType('month')}
              className={`px-3 py-1.5 rounded-md transition-colors ${filterType === 'month' ? 'bg-white dark:bg-slate-800 shadow-sm font-bold' : 'text-slate-500'}`}
            >
              By Month
            </button>
            <button 
              onClick={() => setFilterType('date_range')}
              className={`px-3 py-1.5 rounded-md transition-colors ${filterType === 'date_range' ? 'bg-white dark:bg-slate-800 shadow-sm font-bold' : 'text-slate-500'}`}
            >
              Date Range
            </button>
          </div>

          {filterType === 'month' ? (
            <input 
              type="month" 
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-3 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-950 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ) : (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={dateRange.start}
                onChange={e => setDateRange(prev => ({...prev, start: e.target.value}))}
                className="px-3 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-950 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="text-slate-400 font-medium">to</span>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={e => setDateRange(prev => ({...prev, end: e.target.value}))}
                className="px-3 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-950 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            <Download className="h-4 w-4" />
            Download Report (PDF)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 rounded-3xl shadow-sm text-white space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><DollarSign className="h-16 w-16" /></div>
          <span className="font-semibold block uppercase text-xs flex items-center gap-1 opacity-90 relative z-10">
            Total Revenue
          </span>
          <span className="text-3xl font-extrabold font-display relative z-10">
            ₹{kpis.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-3xl shadow-sm text-white space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Filter className="h-16 w-16" /></div>
          <span className="font-semibold block uppercase text-xs flex items-center gap-1 opacity-90 relative z-10">
            GST Collected
          </span>
          <span className="text-3xl font-extrabold font-display relative z-10">
            ₹{kpis.totalGST.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-2 relative">
          <span className="text-slate-400 font-semibold block uppercase text-xs flex items-center gap-1">
            <ShoppingBag className="h-4 w-4" /> Orders Placed
          </span>
          <span className="text-3xl font-extrabold font-display text-slate-800 dark:text-white">
            {kpis.totalOrders}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-2 relative">
          <span className="text-slate-400 font-semibold block uppercase text-xs flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> Avg Order Value
          </span>
          <span className="text-3xl font-extrabold font-display text-slate-800 dark:text-white">
            ₹{kpis.avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">Revenue Trend</h3>
          <div className="h-[300px] w-full">
            {revenueByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByDate}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickMargin={10} />
                  <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={val => `₹${val/1000}k`} />
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No revenue data for this period</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">Orders by Status</h3>
          <div className="h-[300px] w-full">
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No orders for this period</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-white mb-6">Top Products (Units Sold)</h3>
        <div className="h-[300px] w-full">
          {topProductsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis dataKey="name" type="category" tick={{fontSize: 11, fill: '#475569'}} width={120} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="quantity" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">No product sales for this period</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Top Buying Dealer
          </h3>
          {topDealer ? (
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-800">
              <div>
                <p className="font-bold text-lg text-slate-900 dark:text-white">{topDealer.name}</p>
                <p className="text-sm text-slate-500">{topDealer.orderCount} Orders</p>
              </div>
              <p className="text-xl font-black text-blue-600">₹{topDealer.totalSpent.toLocaleString('en-IN')}</p>
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400">No dealer sales for this period.</div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <User className="h-5 w-5 text-purple-500" />
            Top Retail Customer
          </h3>
          {topRetail ? (
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-800">
              <div>
                <p className="font-bold text-lg text-slate-900 dark:text-white">{topRetail.name}</p>
                <p className="text-sm text-slate-500">{topRetail.orderCount} Orders</p>
              </div>
              <p className="text-xl font-black text-emerald-600">₹{topRetail.totalSpent.toLocaleString('en-IN')}</p>
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400">No retail sales for this period.</div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-white mb-6">Detailed Product Sales</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 rounded-tl-xl">Product Name</th>
                <th className="p-4 text-center">Units Sold</th>
                <th className="p-4 text-right rounded-tr-xl">Total Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {productSalesDetails.length > 0 ? productSalesDetails.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{item.name}</td>
                  <td className="p-4 text-center">
                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full font-bold text-xs">{item.quantity}</span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-600">₹{item.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-400">No products sold in this period.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
