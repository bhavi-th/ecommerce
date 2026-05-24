import cloudinary from '../config/cloudinary.js';

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Upload base64 image to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'ecommerce/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ message: 'Image deletion failed', error: error.message });
  }
};
