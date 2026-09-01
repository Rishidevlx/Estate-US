const Blog = require('../models/Blog');
const Enquiry = require('../models/Enquiry');
const Category = require('../models/Category');

exports.getDashboardData = async (req, res) => {
  try {
    // Run all count queries in parallel
    const [
      totalBlogs,
      totalEnquiries,
      activeEnquiries,
      totalCategories,
      recentEnquiries,
      recentBlogs,
      totalDrafts
    ] = await Promise.all([
      Blog.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: { $in: ['New', 'Inprogress'] } }),
      Category.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      Blog.find().sort({ createdAt: -1 }).limit(5),
      Blog.countDocuments({ status: 'Draft' })
    ]);

    // Construct simple chart data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const enquiriesLast6Months = await Enquiry.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { 
        $group: { 
          _id: { $month: "$createdAt" }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { "_id": 1 } }
    ]);

    const blogsLast6Months = await Blog.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { 
        $group: { 
          _id: { $month: "$createdAt" }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { "_id": 1 } }
    ]);

    // Map month numbers to short month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Create an array for the last 6 months to ensure we have continuous data
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mIdx = d.getMonth();
      
      const enqObj = enquiriesLast6Months.find(e => e._id === (mIdx + 1));
      const blogObj = blogsLast6Months.find(b => b._id === (mIdx + 1));
      
      chartData.push({
        name: monthNames[mIdx],
        enquiries: enqObj ? enqObj.count : 0,
        blogs: blogObj ? blogObj.count : 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalBlogs,
          activeEnquiries,
          totalCategories,
          totalDrafts
        },
        chartData,
        recentEnquiries,
        recentBlogs
      }
    });

  } catch (error) {
    console.error('Dashboard Data Error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching dashboard data' });
  }
};
