import profileModel from "../models/profile.model.js";
import userModel from "../models/user.model.js";
import { uploadFile } from "../services/storage.services.js";

export const profile = async (req, res) => {
    const {
        profession, bio, experience, city, state,
        address, equipments, profileImage, pricePerHour
    } = req.body;

    try {
        const user = req.user;
        const userDoc = await userModel.findById(user._id);

        if (!userDoc) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (userDoc.role === "user") {
            return res.status(403).json({ success: false, message: "Users cannot create a provider profile" });
        }

        if (userDoc.isVerified) {
            return res.status(409).json({ success: false, message: "Profile already created" });
        }

        const newProfile = await profileModel.create({
            user: userDoc._id,
            profession,
            bio,
            experience,
            city,
            state,
            address,
            equipments,
            profileImage,
            pricePerHour,
            completedProfile: true
        });

        await userDoc.updateOne({ isVerified: true });

        return res.status(201).json({
            success: true,
            message: "Profile created successfully",
            data: newProfile
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const portfolio = async (req, res) => {
    try {
        const user = req.user;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No files uploaded" });
        }

        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname,
                });
                return { url: result.url, fileId: result.fileId };
            })
        );

        const updatedProfile = await profileModel.findOneAndUpdate(
            { user: user._id },
            { $push: { portfolioImages: { $each: uploadedImages } } },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Portfolio images uploaded successfully",
            data: updatedProfile
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = req.user;
        const profileData = await profileModel.findOne({ user: user._id });

        if (!profileData) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            userDetail: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                contact: user.contact,
                profession: profileData.profession,
                bio: profileData.bio,
                experience: profileData.experience,
                city: profileData.city,
                state: profileData.state,
                address: profileData.address,
                equipments: profileData.equipments,
                profileImage: profileData.profileImage,
                portfolioImages: profileData.portfolioImages,
                pricePerHour: profileData.pricePerHour,
                status: profileData.status,
                isAvailable: profileData.isAvailable,
                location: profileData.location || { type: "Point", coordinates: [0, 0] },
                lastLocationUpdate: profileData.lastLocationUpdate,
                createdAt: profileData.createdAt
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAllProfile = async (req, res) => {
    try {
        // populate user so profile.user.fullname is available on the frontend
        const profiles = await profileModel
            .find()
            .populate("user", "fullname email profileImage");

        return res.status(200).json({
            success: true,
            message: "All profiles fetched successfully",
            profile: profiles
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const profileDetail = async (req, res) => {
    try {
        const { id } = req.params;

        // populate user so detail page can show fullname/email
        const profileData = await profileModel
            .findById(id)
            .populate("user", "fullname email profileImage");

        if (!profileData) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile found",
            profile: profileData
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const isActive = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        const profileData = await profileModel.findOne({ user: req.user._id });

        if (!profileData) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        if (profileData.status === "busy") {
            return res.status(400).json({
                success: false,
                message: "Cannot change status while busy"
            });
        }

        const newStatus = profileData.status === "active" ? "offline" : "active";
        profileData.status = newStatus;
        profileData.isAvailable = newStatus === "active";

        if (newStatus === "active" && latitude !== undefined && longitude !== undefined) {
            profileData.location = {
                type: "Point",
                coordinates: [longitude, latitude]
            };
            profileData.lastLocationUpdate = Date.now();
        }

        await profileData.save();

        return res.status(200).json({
            success: true,
            status: profileData.status,
            message: `Status changed to ${profileData.status}`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};