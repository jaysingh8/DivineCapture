import profileModel from "../models/profile.model.js";
import userModel from "../models/user.model.js";
import { uploadFile } from "../services/storage.sevices.js";

export const profile = async (req, res) => {

   const { profession, bio, experience, city, state, address, equipments, completedProfile, profileImage } = req.body;

   try {

      const user = req.user

      const userDoc = await userModel.findById(user._id)

      if (!userDoc) {
         return res.status(401).json({
            message: "user not found",
            success: false
         })
      }

      if (userDoc.role == "user") {
         return res.status(401).json({
            message: "Wrong details filled",
            success: false
         })

      }


      if (userDoc.isVerified) {
         return res.status(401).json({
            message: "already profile created",
            success: false
         })
      }

      const profile = await profileModel.create({
         user: userDoc._id,
         profession,
         bio,
         experience,
         city,
         state,
         address,
         equipments,
         profileImage,
         completedProfile: true

      })

      await userDoc.updateOne({
         isVerified: true
      })

      return res.status(201).json({
         message: "Profile created successfully",
         success: true,
         data: profile

      })

   } catch (error) {
      console.log(error);

      res.status(500).json({
         message: "server error",

      })

   }



}


export const portfolio = async (req, res) => {
    try {
        const user = req.user;

        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname,
                });

                return result.url; 
            })
        );

        const profile = await profileModel.findOneAndUpdate(
            { user: user._id },
            {
                $push: {
                    portfolioImages: { $each: uploadedImages }
                }
            },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Portfolio images uploaded successfully",
            data: profile
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}