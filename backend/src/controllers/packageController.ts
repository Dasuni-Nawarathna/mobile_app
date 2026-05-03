import { Request, Response } from 'express';

/**
 * GET /api/packages
 * List all packages with filters and pagination
 */
export async function listPackages(req: Request, res: Response) {
  try {
    const { page = 1, limit = 20, search, type, published } = req.query;

    // TODO: Connect to Package model
    // const filter: Record<string, any> = { isDeleted: false };
    // if (published === 'true') filter.isPublished = true;
    // if (type) filter.type = type;
    // if (search) filter.title = { $regex: search, $options: 'i' };

    // const packages = await Package.find(filter)
    //   .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    //   .limit(parseInt(limit as string))
    //   .sort({ createdAt: -1 });

    // const total = await Package.countDocuments(filter);

    // Mock data for now
    const packages = [
      {
        _id: '1',
        title: 'Colombo City Tour',
        type: 'journey',
        durationDays: 1,
        priceMin: 50,
        priceMax: 150,
        isPublished: true,
      },
    ];

    res.json({
      data: packages,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: packages.length,
      },
    });
  } catch (error) {
    console.error('❌ Error listing packages:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Failed to list packages',
      },
    });
  }
}

/**
 * POST /api/packages
 * Create a new package
 */
export async function createPackage(req: Request, res: Response) {
  try {
    const { title, description, type, durationDays, priceMin, priceMax } = req.body;

    // Validation
    if (!title || !type || !durationDays || !priceMin || !priceMax) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Missing required fields',
        },
      });
    }

    // TODO: Create package in database
    // const packageObj = await Package.create({
    //   title,
    //   description,
    //   type,
    //   durationDays,
    //   priceMin,
    //   priceMax,
    //   isPublished: false,
    //   createdBy: req.user?.userId,
    // });

    // Mock for now
    const packageObj = {
      _id: 'new-id',
      title,
      description,
      type,
      durationDays,
      priceMin,
      priceMax,
      isPublished: false,
    };

    res.status(201).json({
      message: 'Package created successfully',
      package: packageObj,
    });
  } catch (error) {
    console.error('❌ Error creating package:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Failed to create package',
      },
    });
  }
}

/**
 * GET /api/packages/:id
 * Get a single package by ID
 */
export async function getPackage(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // TODO: Fetch package from database
    // const packageObj = await Package.findById(id);
    // if (!packageObj) {
    //   return res.status(404).json({
    //     error: { status: 404, message: 'Package not found' }
    //   });
    // }

    // Mock for now
    const packageObj = {
      _id: id,
      title: 'Colombo City Tour',
      description: 'Explore the beautiful city',
      type: 'journey',
      durationDays: 1,
      priceMin: 50,
      priceMax: 150,
    };

    res.json(packageObj);
  } catch (error) {
    console.error('❌ Error fetching package:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Failed to fetch package',
      },
    });
  }
}

/**
 * PUT /api/packages/:id
 * Update a package
 */
export async function updatePackage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // TODO: Update package in database
    // const packageObj = await Package.findByIdAndUpdate(id, updates, { new: true });
    // if (!packageObj) {
    //   return res.status(404).json({
    //     error: { status: 404, message: 'Package not found' }
    //   });
    // }

    // Mock for now
    const packageObj = {
      _id: id,
      ...updates,
    };

    res.json({
      message: 'Package updated successfully',
      package: packageObj,
    });
  } catch (error) {
    console.error('❌ Error updating package:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Failed to update package',
      },
    });
  }
}

/**
 * DELETE /api/packages/:id
 * Delete a package
 */
export async function deletePackage(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // TODO: Delete package from database
    // const packageObj = await Package.findByIdAndDelete(id);
    // if (!packageObj) {
    //   return res.status(404).json({
    //     error: { status: 404, message: 'Package not found' }
    //   });
    // }

    res.json({
      message: 'Package deleted successfully',
      id,
    });
  } catch (error) {
    console.error('❌ Error deleting package:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Failed to delete package',
      },
    });
  }
}
