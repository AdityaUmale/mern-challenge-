import { Router, Request, Response } from 'express';
import Transaction from '../models/Transaction';

const router: Router = Router();


const monthNameToNumber = (monthName: string): number | undefined => {
    const key = monthName.trim().toLowerCase();
    const months: { [key: string]: number } = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11
    };
    console.log("Mapping key:", key, "=>", months[key]);
    return months[key];
};


router.get('/transactions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { month, search = '', page = '1', perPage = '10' } = req.query;
    if (!month || typeof month !== 'string') {
      res.status(400).json({ message: 'Month is required' });
      return;
    }

    const monthNum = monthNameToNumber(month);
    if (monthNum === undefined) {
      res.status(400).json({ message: 'Invalid month provided' });
      return;
    }

    
    const query: any = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNum + 1] }
    };

    
    if (search && typeof search === 'string') {
      const searchNumber = Number(search);
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        ...(isNaN(searchNumber) ? [] : [{ price: searchNumber }])
      ];
    }

    const pageNumber = Number(page);
    const itemsPerPage = Number(perPage);
    const skip = (pageNumber - 1) * itemsPerPage;

    const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(itemsPerPage);

    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/statistics', async (req: Request, res: Response): Promise<void> => {
  try {
    const { month } = req.query;
    if (!month || typeof month !== 'string') {
      res.status(400).json({ message: 'Month is required' });
      return;
    }

    const monthNum = monthNameToNumber(month);
    if (monthNum === undefined) {
      res.status(400).json({ message: 'Invalid month provided' });
      return;
    }

    const stats = await Transaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNum + 1] } } },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" },
          totalSoldItems: { $sum: { $cond: ["$sold", 1, 0] } },
          totalNotSoldItems: { $sum: { $cond: ["$sold", 0, 1] } }
        }
      }
    ]);

    res.json(stats[0] || { totalSaleAmount: 0, totalSoldItems: 0, totalNotSoldItems: 0 });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/bar-chart', async (req: Request, res: Response): Promise<void> => {
  try {
    const { month } = req.query;
    if (!month || typeof month !== 'string') {
      res.status(400).json({ message: 'Month is required' });
      return;
    }

    const monthNum = monthNameToNumber(month);
    if (monthNum === undefined) {
      res.status(400).json({ message: 'Invalid month provided' });
      return;
    }

    const ranges = [
      { label: "0 - 100", min: 0, max: 100 },
      { label: "101 - 200", min: 101, max: 200 },
      { label: "201 - 300", min: 201, max: 300 },
      { label: "301 - 400", min: 301, max: 400 },
      { label: "401 - 500", min: 401, max: 500 },
      { label: "501 - 600", min: 501, max: 600 },
      { label: "601 - 700", min: 601, max: 700 },
      { label: "701 - 800", min: 701, max: 800 },
      { label: "801 - 900", min: 801, max: 900 },
      { label: "901-above", min: 901, max: Number.MAX_SAFE_INTEGER }
    ];

 
    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNum + 1] }
    });

    const chartData = ranges.map(range => {
      const count = transactions.filter(item => item.price >= range.min && item.price <= range.max).length;
      return { priceRange: range.label, count };
    });

    res.json(chartData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/pie-chart', async (req: Request, res: Response): Promise<void> => {
  try {
    const { month } = req.query;
    if (!month || typeof month !== 'string') {
      res.status(400).json({ message: 'Month is required' });
      return;
    }

    const monthNum = monthNameToNumber(month);
    if (monthNum === undefined) {
      res.status(400).json({ message: 'Invalid month provided' });
      return;
    }

    const pieData = await Transaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNum + 1] } } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1
        }
      }
    ]);

    res.json(pieData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/combined', async (req: Request, res: Response): Promise<void> => {
  try {
    const { month } = req.query;
    if (!month || typeof month !== 'string') {
      res.status(400).json({ message: 'Month is required' });
      return;
    }

    const monthNum = monthNameToNumber(month);
    if (monthNum === undefined) {
      res.status(400).json({ message: 'Invalid month provided' });
      return;
    }

    
    const statsAgg = await Transaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNum + 1] } } },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" },
          totalSoldItems: { $sum: { $cond: ["$sold", 1, 0] } },
          totalNotSoldItems: { $sum: { $cond: ["$sold", 0, 1] } }
        }
      }
    ]);
    const statistics = statsAgg[0] || { totalSaleAmount: 0, totalSoldItems: 0, totalNotSoldItems: 0 };

   
    const ranges = [
      { label: "0 - 100", min: 0, max: 100 },
      { label: "101 - 200", min: 101, max: 200 },
      { label: "201 - 300", min: 201, max: 300 },
      { label: "301 - 400", min: 301, max: 400 },
      { label: "401 - 500", min: 401, max: 500 },
      { label: "501 - 600", min: 501, max: 600 },
      { label: "601 - 700", min: 601, max: 700 },
      { label: "701 - 800", min: 701, max: 800 },
      { label: "801 - 900", min: 801, max: 900 },
      { label: "901-above", min: 901, max: Number.MAX_SAFE_INTEGER }
    ];

    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNum + 1] }
    });

    const barChart = ranges.map(range => {
      const count = transactions.filter(item => item.price >= range.min && item.price <= range.max).length;
      return { priceRange: range.label, count };
    });

 
    const pieChart = await Transaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNum + 1] } } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1
        }
      }
    ]);

    res.json({ statistics, barChart, pieChart });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
