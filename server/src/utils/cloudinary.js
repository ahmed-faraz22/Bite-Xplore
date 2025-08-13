import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});                                     

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null;
        // upload file on the cloudinary
        const respose = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto', 
        })
        fs.unlinkSync(localFilePath); // Delete the file after upload
    }catch (error) {
        fs.unlinkSync(localFilePath); // Ensure the file is deleted even on error
        return null; // Return null if upload fails
    };
}
export { uploadOnCloudinary }