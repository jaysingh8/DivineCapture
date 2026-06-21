import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    profileImage: {
        type: String,
        default: "https://tse4.mm.bing.net/th/id/OIP.3U017h9GAnFM3aRkV-WLiwHaHa?r=0&cb=thfc1falcon2&rs=1&pid=ImgDetMain&o=7&rm=3"

    },
    profession: {
        type: [String],
        enum: ["photographer", "videographer", "editor"],
        required: true,
        validate: {
            validator: arr => arr.length > 0,
            message: "At least one profession is required"
        }
    },
    bio: {
        type: String,
        maxlength: 500,
    },



    experience: Number,

    city: String,

    state: String,

    address: String,

    equipments: {
        type: [String],
        required: true,
        validate: {
            validator: arr => arr.length > 0,
            message: "At least one equipment is required"
        }
    },



    pricePerHour: Number,

    portfolioImages: [
        {
            url: String,
            fileId: String
        }
    ],
    status: {
        type: String,
        enum: ["active", "busy"],
        default: "active",
        required: true
    },
    completedProfile: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true,
});

const profileModel = mongoose.model('Profile', profileSchema);
export default profileModel;